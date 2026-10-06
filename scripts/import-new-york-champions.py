"""Import NY DEC's January 31, 2025 register.
Usage: python scripts/import-new-york-champions.py scientific.pdf common.pdf counties.txt
County geography: Census 2025_Gaz_counties_national.txt. Requires pdftotext.
"""
import collections, csv, json, re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def rows(pdf):
    text = subprocess.check_output(['pdftotext', '-layout', pdf, '-']).decode()
    result = []
    for page, section in enumerate(text.split('\f'), 1):
        for line in section.splitlines():
            if re.search(r'\s20\d\d\s*$', line) and not line.startswith('As of'):
                values = re.split(r'\s{2,}', line.strip())
                assert len(values) == 10, values
                result.append((page, values))
    return result
scientific, common = rows(sys.argv[1]), rows(sys.argv[2])
# The two PDF layouts clip two scientific labels differently; all other fields agree.
def match(r):
    r = list(r)
    if r[0] in ('soapberry, western', 'basswood, white'): r[1] = r[1][:25]
    return tuple(r)
assert collections.Counter(match(r) for _, r in scientific) == collections.Counter(match(r) for _, r in common)
assert len(scientific) == 210
with open(sys.argv[3]) as f:
    counties = {r['NAME'].removesuffix(' County'): r for r in csv.DictReader(f, delimiter='|') if r['USPS'] == 'NY'}
aliases = {'Montgomer': 'Montgomery', 'St. Lawrenc': 'St. Lawrence', 'Cattaragus': 'Cattaraugus', 'Wyomng': 'Wyoming'}
records, points = [], {}
for i, (page, r) in enumerate(scientific, 1):
    name, latin, circ, height, crown, score, raw_county, region, nominator, year = r
    county = aliases.get(raw_county, raw_county)
    geo = counties[county]
    points[county] = {'lat': float(geo['INTPTLAT']), 'lng': float(geo['INTPTLONG'])}
    status = 'New York Co-Champion' if '*' in name + latin else 'New York Champion'
    notes = f'Nominator: {nominator}. DEC region: {region}.'
    if raw_county != county:
        notes += f' Published county: “{raw_county}”; matched to {county} County for filtering and the approximate county point.'
    if name in ('soapberry, western', 'basswood, white'):
        notes += ' Scientific name is clipped in the scientific-name PDF; its published text is retained.'
    if '*' in name + latin:
        notes += ' The source asterisk denotes co-champion.'
    records.append(dict(id=f'ny-{i:03}', sourceRow=i, sourcePage=page, state='NY', commonName=name.replace('*',''), scientificName=latin.replace('*',''), location=None, town='', county=county, sourceCounty=raw_county, mapPrecision='county', measured=year, circumference=float(circ), height=float(height), crown=None, crownPoints=float(crown), points=float(score), notes=notes, status=status, sourceUrl=f'https://dec.ny.gov/sites/default/files/2025-01/champsscientificname.pdf#page={page}'))
for name, data in [('new-york-champion-trees.json', records), ('new-york-county-points.json', points)]:
    (ROOT/'lib/data'/name).write_text(json.dumps(data, indent=2, ensure_ascii=False)+'\n')
print(len(records), 'records;', len(points), 'counties;', sum(r['status'].endswith('Co-Champion') for r in records), 'co-champions')
