"""Usage: python scripts/import-champion-trees.py source.xlsx (requires openpyxl).
Preserves the May 2026 DCR worksheet values and row references; never geocodes tree addresses.
Town coordinates come from lib/data/massachusetts-town-centroids.json.
"""
import json, sys, shutil
from pathlib import Path
import openpyxl
ROOT = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
sheet = openpyxl.load_workbook(source, data_only=True).active
expected = ['Scientific Name', 'Common Name', 'Location (if Publicly Available)', 'City', 'County', 'Date Measured', 'Circumference', 'Height', 'Average Crown Spread', 'Champion Points', 'Notes']
assert list(next(sheet.values)) == expected, 'Source columns changed; review before importing.'
towns = json.loads((ROOT / 'lib/data/massachusetts-town-centroids.json').read_text())
records = []
for row, values in enumerate(list(sheet.values)[1:], 2):
    if not any(v is not None for v in values): continue
    sci, common, location, town, county, measured, circumference, height, crown, points, notes = values
    assert town in towns, f'Missing town coordinates: {town}'
    records.append(dict(id=f'dcr-2026-{row}', sourceRow=row, scientificName=sci, commonName=common, location=location, town=town, county=county, measured=measured.date().isoformat() if measured else None, circumference=circumference, height=height, crown=crown, points=points, notes=notes))
assert len(records) == 139, 'Record count changed; review before importing.'
(ROOT / 'lib/data/champion-trees.json').write_text(json.dumps(records, indent=2, ensure_ascii=False)+'\n')
shutil.copyfile(source, ROOT / 'public/data/massachusetts-champion-trees-may-2026.xlsx')
print(f'Imported {len(records)} records without changing source values.')
