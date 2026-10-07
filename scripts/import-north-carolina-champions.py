"""Import NC Forestry's September 2026 current champion roster.
Usage: python scripts/import-north-carolina-champions.py SNAPSHOT_DIR
Requires openpyxl; directory contains champions.xlsx and counties.zip (2025
Census national county Gazetteer). Keeps explicit roster/co-champion/access
labels; does not re-rank by score. IDs use edition and source row because the
workbook has reused and missing Tree IDs. Exact locations are withheld.
"""
from pathlib import Path
from collections import Counter
import csv, hashlib, io, json, sys, warnings, zipfile
import openpyxl

root = Path(__file__).resolve().parents[1]
snapshot = Path(sys.argv[1])
warnings.filterwarnings('ignore', message='wmf image format is not supported.*', category=UserWarning)
workbook = openpyxl.load_workbook(snapshot / 'champions.xlsx', data_only=True)
assert workbook['Overview']['B2'].value == 'Last updated September 2026'
sheet = workbook['NC Champion Tree List']
assert sheet['A1'].value == 'Tree ID#' and sheet['J1'].value.strip() == 'Owner Authorized Public Access and Viewing'
rows = [(i, row) for i, row in enumerate(sheet.values, 1) if i > 1 and row[1]]
assert len(rows) == 347
# The same green hawthorn is repeated with a typo in its scientific name.
a = next(row for i, row in rows if i == 40)
b = next(row for i, row in rows if i == 101)
assert a[0] == b[0] == 727 and a[2:] == b[2:]
assert a[1] == 'Carataegus viridis' and b[1] == 'Crataegus viridis'
counts = Counter(row[0] for _, row in rows if row[0] is not None)
with zipfile.ZipFile(snapshot / 'counties.zip') as z:
    census = csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode()), delimiter='|')
    geography = {r['NAME'].removesuffix(' County'): {'lat': float(r['INTPTLAT']), 'lng': float(r['INTPTLONG'])} for r in census if r['USPS'] == 'NC'}
records = []
clean = lambda value: ' '.join(str(value).split()) if value is not None else ''
for source_row, row in rows:
    if source_row == 40:
        continue
    ident, scientific, common, co, circumference, height, crown, points, county, access, national, national_id = row
    assert all(isinstance(n, (int, float)) for n in [circumference, height, crown, points])
    assert county in geography and access in ['Yes', 'No'] and national in ['Yes', 'No', 'TBD']
    notes = []
    if source_row == 101:
        notes.append('This tree also appears in row 40 with the spelling “Carataegus viridis”. Tree ID, common name, measurements, county and access labels match; it is counted once using row 101’s spelling.')
    elif ident is not None and counts[ident] > 1:
        notes.append(f'The workbook also assigns Tree ID {int(ident)} to a different tree. Both distinct records are retained with separate map links and source row numbers.')
    if ident is None:
        notes.append('The workbook leaves Tree ID blank. This record is identified by its source row; no state-issued ID is invented.')
    if national == 'TBD':
        notes.append('The source marks national champion status “TBD”; no national title is assigned.')
    records.append({'id': f'nc-2026-{source_row}', 'state': 'NC', 'sourceRow': source_row,
        'sourceTreeId': str(int(ident)) if ident is not None else None,
        'scientificName': clean(scientific), 'commonName': clean(common),
        'town': '', 'county': county, 'mapPrecision': 'county', 'location': None, 'measured': None,
        'circumference': circumference, 'height': height, 'crown': crown, 'points': points,
        'status': 'State co-champion' if clean(co) == 'Yes' else 'State champion',
        'publicAccess': access == 'Yes',
        'nationalFlag': 'National champion · NC Forest Service label' if national == 'Yes' else '',
        'sourceUrl': 'https://www.ncagr.gov/divisions/nc-forest-service/nc-champion-tree-list',
        'sourceReviewNotes': notes, 'notes': None})
used = dict(sorted({r['county']: geography[r['county']] for r in records}.items()))
audit = {'edition': 'September 2026', 'retrieved': 'October 7, 2026',
    'workbookSha256': hashlib.sha256((snapshot / 'champions.xlsx').read_bytes()).hexdigest(),
    'sourceRows': len(rows), 'importedRecords': len(records), 'duplicateRowsExcluded': [40],
    'duplicateRowRetained': 101, 'reusedSourceIds': [75, 330, 682], 'missingIdRows': [69],
    'categories': len({r['scientificName'] for r in records}), 'counties': len(used),
    'coChampions': sum(r['status'] == 'State co-champion' for r in records),
    'publicAccess': sum(r['publicAccess'] for r in records)}
assert len(records) == 346 and len({r['id'] for r in records}) == 346
for name, data in [('north-carolina-champion-trees.json', [r for r in records if r['status'] == 'State champion']), ('north-carolina-co-champion-trees.json', [r for r in records if r['status'] == 'State co-champion']), ('north-carolina-county-points.json', used), ('north-carolina-import-audit.json', audit)]:
    text = '[\n' + ',\n'.join('  ' + json.dumps(r, ensure_ascii=False, separators=(',', ':')) for r in data) + '\n]\n' if isinstance(data, list) else json.dumps(data, ensure_ascii=False, indent=2) + '\n'
    (root / 'lib/data' / name).write_text(text)
print(json.dumps(audit))
