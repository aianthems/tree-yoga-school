#!/usr/bin/env python3
"""Import a reviewed public OFS feature snapshot and Census county points.
Usage: python scripts/import-oklahoma-champions.py SNAPSHOT.json COUNTIES.zip
Snapshot excludes landowner details, addresses, and individual tree coordinates.
"""
import csv, io, json, sys, zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://storymaps.arcgis.com/stories/05009ef918c34590b5ba5d9fb4ec6334'
API = 'https://services3.arcgis.com/yrIZ0Nv0mSGTWJsH/arcgis/rest/services/Champion_Tree_Map_View/FeatureServer/0'

def build(snapshot, geography):
    payload = json.loads(Path(snapshot).read_text())
    assert not payload.get('exceededTransferLimit') and not payload.get('error')
    rows = [f['attributes'] for f in payload['features']]
    reviewed = json.loads((ROOT/'scripts/fixtures/oklahoma-champions-2026-10-10.json').read_text())
    assert rows == reviewed, 'Source changed; review status and measurements before refreshing'
    assert len(rows) == 213
    counties = {}
    with zipfile.ZipFile(geography) as archive:
        content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    for raw in csv.DictReader(io.StringIO(content), delimiter='|'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        if r['USPS'] == 'OK':
            counties[r['NAME'].removesuffix(' County')] = {'lat': float(r['INTPTLAT']), 'lng': float(r['INTPTLONG'])}
    records, points, excluded = [], {}, []
    for r in rows:
        if r['Champion_Status'] != 'Yes':
            continue
        if r['DDR'] is not None or r['Dead_NF'] == 'Dead':
            excluded.append({'objectId': r['OBJECTID'], 'commonName': r['Common_Name'].strip(), 'reason': 'Date reported dead or explicit dead status'})
            continue
        county = r['County'].strip()
        assert county in counties, ('No Census county match', county)
        points[county] = counties[county]
        notes = ['Names and published scores are retained as supplied, including spelling inconsistencies. Current condition has not been independently checked.']
        if not r['Genus_Species']:
            notes.append('Scientific name is not supplied by the source; search this record by its common name.')
        if r['Pts'] is None:
            notes.append('Published points are missing; no replacement score has been calculated.')
        measured = datetime.fromtimestamp(r['DateMeasured']/1000, timezone.utc).date().isoformat() if r['DateMeasured'] is not None else None
        if measured is None:
            notes.append('Date Measured is blank. The separate source Year field is not treated as a verified measurement date.')
        access = {'Yes': 'Public access listed by Oklahoma Forestry Services; confirm current visiting arrangements', 'No': 'No public access listed by Oklahoma Forestry Services'}.get(r['PublicAccess'], 'Visiting access is unclassified')
        record = {
            'id': f"ok-{r['OBJECTID']}", 'state': 'OK', 'sourceRow': r['OBJECTID'], 'sourceTreeId': r['ID'],
            'sourceUrl': SOURCE, 'commonName': r['Common_Name'].strip(), 'scientificName': (r['Genus_Species'] or 'Not supplied by source').strip(),
            'town': '', 'county': county, 'location': None, 'measured': measured, 'yearListed': r['Year'],
            'circumference': r['Circ'], 'height': r['Ht'], 'crown': r['Cr'], 'points': r['Pts'],
            'status': 'Champion · Oklahoma source designation', 'accessDetails': access, 'notes': None, 'sourceReviewNotes': notes,
        }
        if r['PublicAccess'] in ('Yes', 'No'):
            record['publicAccess'] = r['PublicAccess'] == 'Yes'
        records.append(record)
    assert len(records) == 79 and len(points) == 27 and len(excluded) == 4
    audit = {'sourceUrl': SOURCE, 'dataUrl': API, 'retrieved': '2026-10-10', 'sourceDataUpdated': '2026-06-10',
             'sourceRows': len(rows), 'statusCounts': dict(Counter(r['Champion_Status'] for r in rows)),
             'included': len(records), 'countyPoints': len(points), 'excludedDeadChampions': excluded,
             'missingScores': [r['id'] for r in records if r['points'] is None],
             'geographyUrl': 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip',
             'selection': 'Champion_Status=Yes, with no reported death. No inferred champions from No/Undefined rows; both River Birch records retained.',
             'dates': 'Only DateMeasured is used as a measurement date. Year is preserved separately; data update date is not a measurement date.',
             'privacy': 'County points only. Landowner contact details, addresses and individual tree coordinates omitted.'}
    for filename, data in [('oklahoma-champion-trees.json', records), ('oklahoma-county-points.json', points), ('oklahoma-import-audit.json', audit)]:
        (ROOT/'lib/data'/filename).write_text(json.dumps(data, indent=2, ensure_ascii=False)+'\n')
    print(f'Imported {len(records)} Oklahoma records at {len(points)} county points; excluded {len(excluded)} deceased champions.')

if __name__ == '__main__':
    build(*sys.argv[1:])
