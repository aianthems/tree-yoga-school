"""Import the public Maryland State Champion Trees DOM snapshot and Census counties.
Usage: python3 scripts/import-maryland-champions.py ROWS.json COUNTIES.txt
ROWS maps public Airtable record IDs to href and cells keyed by published column index.
Only explicit State designations are included. Never infer champions from scores.
"""
import collections
import csv
import json
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parents[1]
rows = json.loads(pathlib.Path(sys.argv[1]).read_text())
with open(sys.argv[2]) as f:
    counties = {r['NAME'].removesuffix(' County').replace('Baltimore city', 'Baltimore City'): {'lat': float(r['INTPTLAT']), 'lng': float(r['INTPTLONG'])} for r in csv.DictReader(f, delimiter='|') if r['USPS'] == 'MD'}
def clean(v):
    return ' '.join(v.split())
def number(v):
    return float(v) if v.strip() else None
records = []
for source_row, row in enumerate(rows.values(), 1):
    c = {k: clean(v) for k, v in row['cells'].items()}
    assert all(str(k) in c for k in [0,1,2,3,4,5,6,7,8,12,13,14,20,21]), c.get('0')
    assert 'State' in c['7'].split(' | '), c['0']
    assert c['8'] in ('Yes', 'No') and c['5'] in counties
    national = 'National' in c['7'].split(' | ')
    records.append({
        'id': 'md-' + c['0'].lower(), 'sourceRow': source_row,
        'scientificName': c['3'] + ' ' + c['4'], 'commonName': c['1'],
        'town': c['6'], 'county': c['5'], 'mapPrecision': 'county',
        'location': c.get('11') or None, 'measured': c['21'] or None,
        'nominated': c['20'], 'circumference': number(c['12']), 'height': number(c['13']),
        'crown': number(c['14']), 'points': number(c['2']),
        'publicAccess': c['8'] == 'Yes',
        'status': 'State champion · Maryland register',
        'nationalFlag': 'National · Maryland register label' if national else '',
        'sourceUrl': 'https://airtable.com' + row.get('href', '/embed/appBM8V2qpazMLbD9/shrbGFnPDFdz8pL6i/tblES36NZkCeEl0Gd/viwUPdtaaaM43FtG0/' + row['id']),
        'notes': f"Maryland tree ID: {c['0']}. Published champion labels: {c['7']}." + (' National status is reported by the Maryland register, not independently confirmed.' if national else ''),
    })
records.sort(key=lambda r: (r['scientificName'], -(r['points'] or 0), r['id']))
assert len(records) == 274 and len({r['id'] for r in records}) == 274
assert sum(r['publicAccess'] for r in records) == 127
for name,data in [('maryland-champion-trees.json',records),('maryland-county-points.json',counties)]:
    (root/'lib/data'/name).write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({'records':len(records),'categories':len({r['scientificName'] for r in records}),'public':sum(r['publicAccess'] for r in records),'nationalLabels':sum(bool(r['nationalFlag']) for r in records),'points':len(counties)}))
