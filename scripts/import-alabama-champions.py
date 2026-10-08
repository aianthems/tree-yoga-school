#!/usr/bin/env python3
"""Import AFC's 2025 PDF using pdfplumber and the Census 2025 county ZIP.
Usage: python scripts/import-alabama-champions.py REGISTER.pdf COUNTIES.zip
"""
import csv, hashlib, io, json, re, sys, zipfile
from pathlib import Path
import pdfplumber
OUT = Path(__file__).resolve().parents[1] / 'lib/data'
SOURCE = 'https://www.forestry.alabama.gov/Pages/Management/Forms/Champion_Trees_2025.pdf'
def clean(value):
    return ' '.join(value.replace('-\n', '-').split())
def build(pdf, county_zip):
    with zipfile.ZipFile(county_zip) as archive:
        text = archive.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter='|' if '|' in text.splitlines()[0] else '\t'):
        row = {k.strip(): v.strip() for k,v in raw.items()}
        if row['USPS'] == 'AL': counties[row['NAME'].removesuffix(' County')] = {'lat':float(row['INTPTLAT']), 'lng':float(row['INTPTLONG'])}
    assert len(counties) == 67
    records, points = [], {}
    with pdfplumber.open(pdf) as doc:
        for page_number in range(3,10):
            tables = doc.pages[page_number-1].extract_tables()
            assert len(tables) == 1
            table = tables[0]
            assert len(table[0]) == 10 and clean(table[0][2]) == 'Remeasure Due'
            for row_number, raw in enumerate(table[1:],1):
                cells = [clean(v) for v in raw[:8]]
                name_year, scientific, due, circumference, height, crown, score, county = cells
                match = re.fullmatch(r'(.+?)\s*-\s*(\d{4})',name_year)
                assert match and county in counties, cells
                common, year = match.groups()
                assert all(re.fullmatch(r'\d+',n) for n in [due,circumference,height,crown,score]), cells
                identity = '|'.join([scientific,county,common,year])
                record = dict(id='al-'+hashlib.sha256(identity.encode()).hexdigest()[:12],state='AL',sourcePage=page_number,sourceRow=row_number,
                    scientificName=scientific,commonName=common,county=county,town='',location=None,measured=None,mapPrecision='county',
                    yearCrowned=year,remeasureDue=due,sourceUrl=SOURCE+f'#page={page_number}',status='Listed in Alabama 2025 champion register',
                    circumference=int(circumference),height=int(height),crown=int(crown),points=int(score),notes=None)
                if scientific == 'Magnolia viginiana':
                    record['sourceReviewNotes'] = ['Scientific name is printed as Magnolia viginiana in the register; spelling retained as published.']
                records.append(record)
                points[county] = counties[county]
    assert len(records) == 145 and len({t['id'] for t in records}) == 145
    audit = dict(sourceUrl=SOURCE,edition='2025',retrieved='October 8, 2026',sourceSha256=hashlib.sha256(Path(pdf).read_bytes()).hexdigest(),included=len(records),counties=len(points),scientificCategories=len({t['scientificName'] for t in records}),sourcePages=[3,4,5,6,7,8,9],
        identity='SHA256 of published scientific name, county, common name and year crowned; first 12 hex digits. Reconcile name changes on refresh.',
        geography='2025 Census county internal points; approximate county markers, not tree coordinates',
        notes=['All table rows retained, including multiple trees for the same species; no score-based selection or inferred co-champion labels.', 'Year crowned and remeasurement due are not measurement dates. Ownership does not establish visiting permission.', 'PDF line breaks collapsed; hyphenated scientific names rejoined. Published names and scores retained.'])
    return records,points,audit
if __name__ == '__main__':
    records,points,audit=build(*sys.argv[1:])
    for name,data in [('alabama-champion-trees',records),('alabama-county-points',points),('alabama-import-audit',audit)]:
        (OUT/(name+'.json')).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
    print(json.dumps(audit))
