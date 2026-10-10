#!/usr/bin/env python3
"""Import/reconcile both CTC 2026 workbooks and approximate Census county points.
Usage: python scripts/import-colorado-champions.py COUNTY.xlsx ALPHABETICAL.xlsx COUNTIES.zip
Requires openpyxl. The reviewed fixture omits the one published street address.
"""
import csv, hashlib, io, json, re, sys, zipfile
from collections import Counter
from pathlib import Path
import openpyxl
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'lib/data'
SOURCE = 'https://www.coloradotrees.org/s/2026-Website-County-champ-list.xlsx'
ALPHA = 'https://www.coloradotrees.org/s/2026-Website-Champ-Trees.xlsx'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'
HEADER = ['County', 'Common Name', 'Genus', 'Species', 'Variety', 'DBH', 'Cir', 'Ht', 'CS', "Nat'l Pts.", 'Pos', 'General Location']

def rows(path, county):
    sheet = openpyxl.load_workbook(path, data_only=True).active
    values = list(sheet.values)
    assert list(values[0][:12 if county else 11]) == (HEADER if county else HEADER[1:]), 'Source headers changed; review required'
    return [(i, list(r[:12 if county else 11])) for i, r in enumerate(values[1:], 2) if r[1 if county else 0]]

def clean(v):
    return v.strip() if isinstance(v, str) else v

def safe_location(value):
    # General Location contains one street address; do not put it in public data.
    return '[street address omitted]' if value and re.search(r'\d', str(value)) else clean(value)

def reconciled_key(r):
    # Variety is the only reviewed difference across the two arrangements.
    return tuple(clean(v) for i, v in enumerate(r) if i != 3)

def build(county_path, alpha_path, geography_path):
    county_rows = rows(county_path, True)
    alpha_rows = rows(alpha_path, False)
    assert len(county_rows) == len(alpha_rows) == 846, 'Record count changed; review required'
    assert Counter(reconciled_key(r[1:]) for _, r in county_rows) == Counter(reconciled_key(r) for _, r in alpha_rows), 'Workbook identities/measurements/positions differ; review required'
    alpha_lookup = {reconciled_key(r): (i, clean(r[3])) for i, r in alpha_rows}
    assert len(alpha_lookup) == 846, 'Ambiguous record identity'
    fixture = []
    for i, raw in county_rows:
        r = [clean(v) for v in raw]; r[11] = safe_location(r[11])
        ai, av = alpha_lookup[reconciled_key(raw[1:])]
        fixture.append({'countyRow': i, 'alphabeticalRow': ai, 'values': r, 'alphabeticalVariety': av})
    reviewed = json.loads((ROOT/'scripts/fixtures/colorado-champions-2026-10-10.json').read_text())
    assert fixture == reviewed, 'Source fields changed; review fixture before refreshing'
    counties = {}
    with zipfile.ZipFile(geography_path) as archive:
        content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    for raw in csv.DictReader(io.StringIO(content), delimiter='|'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        if r['USPS'] == 'CO':
            counties[r['NAME'].removesuffix(' County')] = {'lat': float(r['INTPTLAT']), 'lng': float(r['INTPTLONG'])}
    records = []; points = {}; differences = []
    for f in fixture:
        county, common, genus, species, variety, dbh, circ, height, crown, score, position, location = f['values']
        scientific = genus + ' ' + species
        mapped_county = 'Moffat' if county == 'Moffatt' else county
        assert mapped_county in counties, (county, 'No Census match')
        points[mapped_county] = counties[mapped_county]
        pos = str(position) if position is not None else None
        assert pos is None or re.fullmatch(r'[1-7]T?', pos), 'Position changed; review required'
        for value in [dbh, circ, height, crown, score]:
            assert value is None or isinstance(value, (float, int))
        # No published tree IDs: fingerprint the full reviewed row to retain every distinct entry.
        identity = json.dumps(f['values'], ensure_ascii=False, separators=(',', ':'))
        tree_id = 'co-' + hashlib.sha256(identity.encode()).hexdigest()[:12]
        notes = ['2026 register position is shown exactly as published, including any T suffix. Entries beyond third place and the unranked entry remain included. No rank or national title is inferred from points.', 'Approximate Census county point only. The register does not establish visiting access or supply measurement dates.']
        if not re.fullmatch(r'[A-Z][a-z]+', genus): notes.append('The source genus field is unusual or incomplete and is preserved verbatim; botanical identification requires source review.')
        if variety: notes.append('Published variety/cultivar: ' + variety + '. Botanical name uses the source genus and species; no variety rank is invented.')
        if f['alphabeticalVariety'] != variety:
            notes.append('The alphabetical workbook lists variety/cultivar ' + str(f['alphabeticalVariety']) + '; the county workbook lists ' + str(variety) + '. All other record fields reconcile.')
            differences.append({'id': tree_id, 'countyRow': f['countyRow'], 'alphabeticalRow': f['alphabeticalRow'], 'countyVariety': variety, 'alphabeticalVariety': f['alphabeticalVariety']})
        if county != mapped_county: notes.append('Source county Moffatt is matched to Census Moffat County; source spelling is retained.')
        if location == '[street address omitted]': notes.append('The source publishes a street address, omitted here. Only the county area is mapped.'); location = None
        if pos is None: status = 'Colorado register · position not supplied'
        elif re.fullmatch(r'1T?', pos): status = 'Colorado first-place listing · Position ' + pos
        else: status = 'Colorado register · Position ' + pos
        records.append(dict(id=tree_id, state='CO', sourceRow=f['countyRow'], sourceAlphabeticalRow=f['alphabeticalRow'], sourceUrl=SOURCE, sourceTreeId=None, commonName=common, scientificName=scientific, sourceVariety=variety, sourcePosition=pos, diameter=dbh, town='', county=mapped_county, sourceCounty=county, location=location, measured=None, circumference=circ, height=height, crown=crown, points=score, status=status, notes=None, sourceReviewNotes=notes))
    assert len({r['id'] for r in records}) == 846, 'Duplicate IDs; review identity'
    assert len(differences) == 1
    counts = Counter(r['sourcePosition'] or 'unranked' for r in records)
    audit = dict(edition='2026', retrieved='October 10, 2026', registerUrl=SOURCE, alphabeticalUrl=ALPHA, geographyUrl=GEOGRAPHY, sourceHashes={Path(p).name: hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in [county_path, alpha_path, geography_path]}, expectedRecords=846, mappedRecords=846, countyCount=len(points), positions=dict(sorted(counts.items())), workbookDifferences=differences, privacy='One published street address omitted; no individual-tree coordinates or personal information imported.', units='Circumference and DBH in inches; height and average crown spread in feet, following CTC measuring guidance and the published scoring relationships. Published scores remain unchanged. Nat\'l Pts. is the scoring column, not evidence of national champion designation.', unrankedIds=[r['id'] for r in records if not r['sourcePosition']])
    for filename, value in [('colorado-champion-trees.json', records), ('colorado-county-points.json', points), ('colorado-import-audit.json', audit)]:
        (OUT/filename).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'records':len(records),'counties':len(points),'positions':counts}))

if __name__ == '__main__': build(*sys.argv[1:])
