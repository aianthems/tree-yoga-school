#!/usr/bin/env python3
"""Import all six pages of Nevada's 2023 register, preserving printed labels.
Usage: python scripts/import-nevada-champions.py REGISTER.pdf COUNTIES.zip
Requires pdfplumber. The reviewed fixture excludes the Ownership column.
"""
import csv, hashlib, io, json, re, sys, zipfile
from collections import Counter
import collections
from pathlib import Path
import pdfplumber
ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://forestry.nv.gov/uploads/missions/2023_Big_Tree_Program_Register.pdf'
PROGRAM = 'https://forestry.nv.gov/nevadas-big-tree-program'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'

def geography(path):
    with zipfile.ZipFile(path) as archive:
        content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    result = {}
    for raw in csv.DictReader(io.StringIO(content), delimiter='|'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        if r['USPS'] == 'NV':
            result[r['NAME'].removesuffix(' County')] = dict(lat=float(r['INTPTLAT']), lng=float(r['INTPTLONG']))
    return result

def extract(register):
    rows=[]
    with pdfplumber.open(register) as pdf:
     for page_no,page in enumerate(pdf.pages,1):
      table=page.find_tables()[0]
      for row_no,row in enumerate(table.rows[1:] if page_no==1 else table.rows,1):
       values=[]
       for cell in row.cells[:9]:
        x0,y0,x1,y1=cell
        chars=[c for c in page.chars if x0<=((c['x0']+c['x1'])/2)<x1 and y0<=(c['top']+c['bottom'])/2<y1]
        lines=collections.defaultdict(list)
        for c in chars: lines[round(c['top'])].append(c)
        text=[]
        for _,line in sorted(lines.items()):
         glyphs=[c for c in line if not c['text'].isspace()]
         glyphs=sorted(glyphs,key=lambda c:c['x0'])
         out='';prev=None
         for c in glyphs:
          if prev and c['x0']-prev['x1']>1:out+=' '
          out+=c['text'];prev=c
         text.append(out.strip())
        values.append(' '.join(' '.join(text).split()))
       rows.append(dict(page=page_no,row=row_no,commonName=values[0],scientificName=values[1],status=values[2],measurements=values[3:8],sourceCounty=values[8]))
    return rows

def build(register, counties):
    fixture = extract(register)
    reviewed = json.loads((ROOT / 'scripts/fixtures/nevada-champions-2023.json').read_text())
    assert fixture == reviewed, 'Source changed; review every source row before refreshing'
    assert len(fixture) == 223
    assert Counter(r['status'] for r in fixture) == {'Champion': 211, 'Co-champion': 12}
    geography_points = geography(counties)
    records, points = [], {}
    for f in fixture:
        circumference, height, crown, crown_points, score = map(int, f['measurements'])
        county = 'White Pine' if f['sourceCounty'] == 'Pine' else f['sourceCounty']
        assert county in geography_points
        points[county] = geography_points[county]
        incomplete = not bool(re.match(r'^[A-Z][a-z]+ [a-z]', f['scientificName']))
        warnings = []
        if incomplete:
            warnings.append('The printed botanical label is incomplete (a species epithet, variety, or cultivar fragment). No genus or full identity is inferred. Use name search; this record is omitted from species and genus filters.')
        if f['sourceCounty'] == 'Pine':
            warnings.append('The source county label “Pine” is interpreted as White Pine, the only Nevada county with that name ending. The original label is retained; the marker is approximate.')
        records.append(dict(
            id=f"nv-p{f['page']}-r{f['row']}", state='NV', sourcePage=f['page'], sourceRow=f['row'],
            sourceUrl=SOURCE + '#page=' + str(f['page']), sourceCounty=f['sourceCounty'],
            scientificName=f['scientificName'], scientificNameIncomplete=incomplete, commonName=f['commonName'],
            town='', county=county, location=None, measured=None,
            circumference=circumference, height=height, crown=crown, crownPoints=crown_points, points=score,
            status='Nevada ' + f['status'].lower() + ' · 2023 register',
            notes='2023 register; current condition, champion status and visiting access are unverified. Common and botanical labels are retained as printed, including incomplete names and spelling errors. Crown spread and rounded crown points are both published; full average spread is displayed. Measurement dates are not supplied. Ownership is not used to infer visiting access.',
            sourceReviewNotes=warnings,
        ))
    audit = dict(
        edition='2023', retrieved='October 11, 2026', registerUrl=SOURCE, programUrl=PROGRAM, geographyUrl=GEOGRAPHY,
        hiatusSourceUrl='https://nationalchampiontree.org/state-programs/',
        sourceHashes={Path(path).name: hashlib.sha256(Path(path).read_bytes()).hexdigest() for path in (register, counties)},
        expectedRecords=223, champions=211, coChampions=12, mappedRecords=223, countyCount=7,
        tablePages=list(range(1, 7)), recordsPerPage=dict(Counter(r['page'] for r in fixture)),
        incompleteBotanicalLabels=sum(r['scientificNameIncomplete'] for r in records),
        units='Circumference in inches; height and average crown spread in feet. Original rounded crown points and total points retained.',
        review='All 223 printed tree rows retained, including all 12 co-champion labels and repeated names. The program page mentions 303 trees, which does not match its linked six-page 2023 PDF. No missing records invented. Printed botanical fragments, truncated common names and misspellings preserved; incomplete botanical labels are excluded from species/genus grouping but remain name-searchable. Pine interpreted as White Pine County with a note. No national titles inferred. Program on hiatus according to NCTP state directory.',
        privacy='Ownership column, personal names, addresses and individual-tree positions omitted. County markers do not establish visiting permission.',
    )
    for name, data in [('nevada-champion-trees.json', records), ('nevada-county-points.json', dict(sorted(points.items()))), ('nevada-import-audit.json', audit)]:
        (ROOT / 'lib/data' / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(records=len(records), counties=len(points), coChampions=12)))

if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    build(sys.argv[1], sys.argv[2])
