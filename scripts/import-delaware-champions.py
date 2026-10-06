"""Import FirstMap layer 0 and 2025 Census place/county Gazetteers.
Usage: python3 scripts/import-delaware-champions.py FIRSTMAP.json PLACES.txt COUNTIES.txt
Retain rank 1 plus records within five published points of the species maximum.
The latter are explicitly rule-derived qualifiers, not source rank-one labels.
"""
import collections
import csv
import datetime
import json
import pathlib
import re
import sys

root = pathlib.Path(__file__).resolve().parents[1]
source = json.loads(pathlib.Path(sys.argv[1]).read_text())
assert not source.get('exceededTransferLimit'), 'Incomplete FirstMap response'
rows = [f['attributes'] for f in source['features']]
def clean(s):
    return ' '.join((s or '').split())
def point(r):
    return {'lat': float(r['INTPTLAT']), 'lng': float(r['INTPTLONG'])}
with open(sys.argv[2]) as f:
    places = {re.sub(r' (city|town|village|CDP)$', '', r['NAME']).casefold(): point(r) for r in csv.DictReader(f, delimiter='|') if r['USPS'] == 'DE'}
with open(sys.argv[3]) as f:
    counties = {r['NAME'].removesuffix(' County'): point(r) for r in csv.DictReader(f, delimiter='|') if r['USPS'] == 'DE'}
groups = collections.defaultdict(list)
for r in rows:
    if clean(r['SCIENTIFIC']):
        groups[clean(r['SCIENTIFIC'])].append(r)
records, coordinates = [], {}
base = 'https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Biota/DE_Big_Tree_Champs/FeatureServer/0'
for scientific, species in sorted(groups.items()):
    assert any(r['SPEC_RANK'] == 1 for r in species), scientific
    top = max(r['DDA_OWNER_BIG_TREE_CHAMPS_POIN'] for r in species)
    for r in species:
        score, rank = r['DDA_OWNER_BIG_TREE_CHAMPS_POIN'], r['SPEC_RANK']
        if rank != 1 and top - score > 5:
            continue
        town, county = clean(r['CITY']), clean(r['COUNTY'])
        assert county in counties
        notes = []
        if rank != 1:
            notes.append(f'The official dataset gives this tree species rank {rank}. Its {score} published points are within five of the species maximum ({top}), qualifying under the co-champion rule in the 2019 register (printed page 3). This qualification is derived from that rule; the dataset does not explicitly label it a co-champion.')
        key = town if town.casefold() in places else 'county:' + county
        coordinates[key] = places[town.casefold()] if key == town else counties[county]
        if key != town:
            notes.append(f'The published place, {town}, does not match a 2025 Census place. Its marker represents {county} County; the original place is retained.')
        date = datetime.datetime.fromtimestamp(r['DATE_OF_RANK'] / 1000, datetime.timezone.utc).date().isoformat() if r['DATE_OF_RANK'] else None
        record = {
            'id': f"de-{r['OBJECTID']}", 'sourceRow': r['OBJECTID'],
            'scientificName': scientific, 'commonName': clean(r['NAME']),
            'location': clean(r['ADDRESS']) or None, 'town': town, 'county': county,
            'measured': None, 'rankingDate': date,
            'circumference': r['CIRCUMFERENCE_INCHES'], 'height': r['HEIGHT_FEET'],
            'crown': r['AVE_CROWN_SPREAD_FEET'], 'points': score,
            'status': 'State champion · source rank 1' if rank == 1 else 'Co-champion qualifier · five-point rule',
            'sourceUrl': f"{base}/{r['OBJECTID']}?f=pjson",
            'notes': f"Delaware tree ID: {r['ID']:g}. Published species rank: {rank}. Ranking date: {date or 'Not listed'}; this is not a measurement date.",
            'sourceReviewNotes': notes,
        }
        if key != town:
            record['mapPrecision'] = 'county'
        records.append(record)
assert len(rows) == 207 and len(groups) == 76
assert len(records) == 91 and sum(r['status'].startswith('State champion') for r in records) == 79
assert len({r['id'] for r in records}) == len(records)
for name, data in [('delaware-champion-trees.json', records), ('delaware-place-points.json', coordinates)]:
    (root / 'lib/data' / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'records': len(records), 'species': len(groups), 'places': len(coordinates), 'countyRecords': sum(r.get('mapPrecision') == 'county' for r in records), 'placeKeys': sorted(coordinates)}))
