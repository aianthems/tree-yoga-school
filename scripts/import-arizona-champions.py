#!/usr/bin/env python3
"""Import the reviewed 2023 Arizona champion appendix (PDF pages 34–37).
Usage: python scripts/import-arizona-champions.py REPORT.pdf COUNTIES.zip
Requires Poppler pdftotext; otherwise uses Python's standard library.
"""
import csv, hashlib, io, json, re, subprocess, sys, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://dffm.az.gov/sites/default/files/media/2023%20Magnificent%20Tree%20Annual%20Report.pdf'
PROGRAM = 'https://dffm.az.gov/arizonas-magnificent-trees'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'

def extract(path):
    s = subprocess.check_output(['pdftotext','-layout',str(path),'-'], text=True)
    t = s[s.index('2023 Champion Trees'):s.index('2023 Witness/Heritage Trees')]
    rows = []
    for line in t.splitlines():
        m = re.match(r'^\s*(\d+)\s+',line)
        if not m or not 1 <= int(m[1]) <= 143: continue
        z = re.split(r'\s{2,}',line.strip()); n = int(z[0])
        # Two status cells wrap above and below their row; visually reviewed.
        if n in [33,109]: z.insert(10, ('National' if n == 33 else 'State') + ' Champion, Witness, Heritage')
        assert len(z) == 13, (n,z)
        rows.append(dict(sourceRow=n,sourcePage=34 if n<=34 else 35 if n<=68 else 36 if n<=124 else 37,
            scientificName=z[1],commonName=z[2],sourceTreeId=z[3],measurements=z[4:8],
            nominated=z[8],measured=z[9],status=z[10],county=z[11]))
    assert [r['sourceRow'] for r in rows] == list(range(1,144))
    return rows

def build(report, counties):
    fixture = extract(report)
    assert fixture == json.loads((ROOT/'scripts/fixtures/arizona-champions-2023.json').read_text()), 'Source changed; review the entire appendix before updating the fixture'
    with zipfile.ZipFile(counties) as archive: content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    geography = {}
    for raw in csv.DictReader(io.StringIO(content),delimiter='|'):
        r = {k.strip():v.strip() for k,v in raw.items()}
        if r['USPS']=='AZ': geography[r['NAME'].removesuffix(' County')] = dict(lat=float(r['INTPTLAT']),lng=float(r['INTPTLONG']))
    grouped = {}
    for r in fixture: grouped.setdefault(r['sourceTreeId'],[]).append(r)
    assert len(grouped)==139
    records=[]; points={}; duplicates=[]
    for treeid, versions in grouped.items():
        # Select the latest explicitly dated measurement of a repeated ID, not the highest score.
        r = max(versions,key=lambda v:int(v['measured']) if v['measured'].isdigit() else -1)
        warnings=[]
        if len(versions)>1:
            duplicates.append(dict(treeId=treeid,rows=[v['sourceRow'] for v in versions],selectedRow=r['sourceRow']))
            if treeid=='AZ0098': warnings.append('Repeated ID AZ0098: row 76 (measured 2022) is used instead of row 4 (measured 2004). Older published circumference/height/crown/score: 57 in / 32 ft / 30 ft / 97 points. Newer published values: 58 in / 39 ft / 28 ft / 104 points.')
        county = '' if r['county']=='N/A' else r['county']
        if county:
            assert county in geography, county
            points[county]=geography[county]
        circ,height,crown,score = map(float,r['measurements'])
        records.append(dict(id='az-'+treeid.lower(),state='AZ',sourceTreeId=treeid,
            sourceRow=r['sourceRow'],sourcePage=r['sourcePage'],sourceUrl=SOURCE+'#page='+str(r['sourcePage']),
            scientificName=r['scientificName'],commonName=r['commonName'],town='',county=county,
            sourceCounty=r['county'],location=None,measured=None if r['measured']=='N/A' else r['measured'],
            nominated=None if r['nominated']=='N/A' else r['nominated'],status=r['status'],
            circumference=circ,height=height,crown=crown,points=score,sourceReviewNotes=warnings,
            notes='2023 champion appendix; source rows '+', '.join(str(v['sourceRow']) for v in versions)+'. Names, measurements, scores and designations retained as published. Current condition, champion titles and visiting access unverified. County markers are approximate; no exact tree position supplied.'))
    unmapped=[r['id'] for r in records if not r['county']]
    discrepancies=[r['id'] for r in records if abs(r['circumference']+r['height']+r['crown']/4-r['points'])>1]
    audit=dict(registerUrl=SOURCE,programUrl=PROGRAM,geographyUrl=GEOGRAPHY,retrieved='October 11, 2026',edition=2023,
        publishedRows=143,expectedRecords=139,mappedRecords=len(records)-len(unmapped),countyCount=len(points),
        unmappedIds=unmapped,duplicateGroups=duplicates,scoreDiscrepancyIds=discrepancies,
        sourceHashes={Path(p).name:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in (report,counties)},
        review='All 143 numbered champion rows on PDF pages 34–37 reviewed. Four repeated IDs consolidated; latest explicitly dated measurement chosen for cork oak AZ0098. Other duplicates identical in retained fields. Different IDs remain distinct, even with repeated species/measurements. Separate Heritage/Witness appendix excluded; dual designations already in champion appendix retained. 2024 additions and inaccessible 2025 report not merged; this is a 2023 snapshot, not a current register.',
        geography='Published counties matched exactly to Census 2025 Arizona county points. N/A county retained as undisclosed, without an inferred map point.',
        units='Circumference inches; height and full crown spread feet; source scores unchanged.',
        privacy='Nominator names omitted. No exact positions, addresses or visiting permissions inferred.')
    for name,data in [('arizona-champion-trees.json',records),('arizona-county-points.json',dict(sorted(points.items()))),('arizona-import-audit.json',audit)]:
        (ROOT/'lib/data'/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(records=len(records),mapped=audit['mappedRecords'],counties=len(points),unmapped=unmapped,duplicates=duplicates,scoreDiscrepancies=discrepancies)))
if __name__=='__main__':
    if len(sys.argv)!=3: sys.exit(__doc__)
    build(sys.argv[1],sys.argv[2])
