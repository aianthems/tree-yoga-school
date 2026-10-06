"""Import the public fields used by Vermont's official Big Tree List.
Run from the repository root. Requires only Python's standard library.
The public ExperienceView intentionally excludes private tree geometry.
"""
import csv
import datetime as dt
import io
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SERVICE = 'https://services5.arcgis.com/Uzks6LSde6r23wwG/arcgis/rest/services/BigTreeSurvey_ExperienceView/FeatureServer/0'
GAZETTEER = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_50.txt'
FIELDS = 'objectid,dateTime,town,county,public_access,common_name,genus,species,breast_height_circ,total_height,crown_spread,big_tree_points,Champion,visibility,location_details,year_listed,location_notes_public'

def query(**params):
    url = SERVICE + '/query?' + urllib.parse.urlencode({'f': 'json', 'where': "Champion = 'yes'", **params})
    with urllib.request.urlopen(url) as response:
        data = json.load(response)
    if 'error' in data:
        raise ValueError(data['error'])
    return data

def clean(value):
    return ' '.join(value.split()) if value else None

def date(value):
    return dt.datetime.fromtimestamp(value / 1000, dt.timezone.utc).date().isoformat() if value is not None else None

def convert(attributes):
    assert attributes['Champion'] == 'yes'
    a = attributes
    public = a['public_access'] == 'yes'
    match = re.search(r'\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)', a['location_details'] or '') if public else None
    point = {'lat': float(match[1]), 'lng': float(match[2])} if match else None
    if point:
        assert 42.7 < point['lat'] < 45.1 and -73.5 < point['lng'] < -71.4
    return dict(id=f"vt-{a['objectid']}", state='VT', sourceRow=a['objectid'],
                commonName=clean(a['common_name']) or 'Common name not listed',
                scientificName=clean(a['genus'] + ' ' + a['species']),
                town=a['town'], county=a['county'].removesuffix(' County'),
                measured=date(a['dateTime']), yearListed=date(a['year_listed'])[:4] if a['year_listed'] is not None else None,
                circumference=a['breast_height_circ'], height=a['total_height'], crown=a['crown_spread'], points=a['big_tree_points'],
                status='Confirmed champion', publicAccess=public, visibleFromPublic=a['visibility'],
                location=clean(a['location_notes_public']), accessDetails=clean(a['location_details']),
                publicCoordinates=point, notes=None,
                sourceUrl=SERVICE + '/' + str(a['objectid']))

def main():
    data = query(outFields=FIELDS, returnGeometry='false', orderByFields='objectid', resultRecordCount=2000)
    assert not data.get('exceededTransferLimit'), 'Pagination required; do not publish a partial register.'
    records = [convert(f['attributes']) for f in data['features']]
    assert len(records) == query(returnCountOnly='true')['count']
    assert len({r['id'] for r in records}) == len(records)
    assert len(records) == 91, 'Review the source count and page copy before importing a new edition.'
    with urllib.request.urlopen(GAZETTEER) as response:
        gaz = list(csv.DictReader(io.StringIO(response.read().decode()), delimiter='|'))
    points = {}
    for town in sorted({r['town'] for r in records}):
        candidates = [g for g in gaz if g['NAME'].lower() == town.lower() or g['NAME'] in (town + ' town', town + ' city')]
        assert len(candidates) == 1, (town, [g['NAME'] for g in candidates])
        g = candidates[0]
        points[town] = dict(lat=float(g['INTPTLAT']), lng=float(g['INTPTLONG']), geoid=g['GEOID'])
    for filename, value in [('vermont-champion-trees.json', records), ('vermont-town-points.json', points)]:
        (ROOT / 'lib/data' / filename).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
    print(f"Imported {len(records)} confirmed champions in {len(points)} municipalities; {sum(r['publicAccess'] for r in records)} source-confirmed public trees.")

if __name__ == '__main__':
    main()
