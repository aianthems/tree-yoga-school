"""Import the official 2020 Maine PDF, retaining its spellings, scores and symbols.
Usage: python3 scripts/import-maine-champions.py /path/to/maine.pdf
Requires Poppler's pdftotext and Python's standard library. Geography is public.
"""
import csv
import io
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF_URL = 'https://www.maine.gov/tools/whatsnew/attach.php?an=1&id=3332272'
GAZ_URL = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_23.txt'
GIS_URL = 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/arcgis/rest/services/Maine_Town_and_Townships_Boundary_Polygons/FeatureServer/0'
COUNTIES = dict(zip(range(1,32,2), ['Androscoggin','Aroostook','Cumberland','Franklin','Hancock','Kennebec','Knox','Lincoln','Oxford','Penobscot','Piscataquis','Sagadahoc','Somerset','Waldo','Washington','York']))
ALIASES = {'South Paris': 'Paris', 'Milton Plantation': 'Milton', 'Bradstreet Twp.': 'Bradstreet Twp'}

def parse_pdf(path):
    text = subprocess.check_output(['pdftotext', '-layout', str(path), '-'], text=True)
    assert 'Maine Register of Big Trees' in text and '2020' in text
    records = []
    for page_number, page in enumerate(text.split('\f'), 1):
        page_rows = 0
        for line in page.splitlines():
            if not re.search(r'\s\d+\s+\d+\s+\d+\s+\d+\s+20\d\d\s', line):
                continue
            columns = re.split(r'\s{2,}', line.strip())
            if columns[0] == 'Chamaecyparis pisifera':
                assert 'Falsecypress, Japanese; "Plume' in page and 'Sawara"' in page
                columns.insert(0, 'Falsecypress, Japanese; "Plume Sawara"')
            assert len(columns) == 9, columns
            common, scientific, town, circumference, height, crown, points, year, _ = columns
            page_rows += 1
            row = len(records) + 1
            record = dict(id=f'me-2020-{row}', state='ME', sourceRow=row, sourcePage=page_number,
                          commonName=common, scientificName=scientific, town=town,
                          county='', measured=year, location=None, notes=None,
                          circumference=int(circumference), height=int(height), crown=int(crown), points=int(points),
                          sourceUrl=PDF_URL + f'#page={page_number}')
            if town in ALIASES:
                record['mapTown'] = ALIASES[town]
            if '*' in common:
                record['notes'] = 'Asterisks are retained from the published name. This PDF does not include a legend explaining them.'
            records.append(record)
        if page_number in [2,3,4,5]:
            assert page_rows == {2:42,3:41,4:42,5:21}[page_number], (page_number,page_rows)
    assert len(records) == 146
    return records

def main():
    records = parse_pdf(sys.argv[1])
    with urllib.request.urlopen(GAZ_URL) as response:
        gaz = list(csv.DictReader(io.StringIO(response.read().decode()), delimiter='|'))
    params = dict(f='json', where="TOWN LIKE 'Bradstreet%' OR TOWN LIKE 'Moosehead%'",
                  outFields='TOWN,COUNTY,GEOCODE', returnGeometry='false', returnCentroid='true', outSR=4326)
    with urllib.request.urlopen(GIS_URL + '/query?' + urllib.parse.urlencode(params)) as response:
        gis = json.load(response)
    assert not gis.get('error') and not gis.get('exceededTransferLimit')
    points = {}
    for record in records:
        town = record.get('mapTown',record['town'])
        candidates = [g for g in gaz if g['NAME'] in [town+' town',town+' city',town+' UT']]
        if town in ['Bradstreet Twp','Moosehead Junction Twp']:
            matches = [f for f in gis['features'] if f['attributes']['TOWN'] == town]
            assert len(matches) == 1, town
            feature = matches[0]
            county = feature['attributes']['COUNTY']
            point = dict(lat=feature['centroid']['y'],lng=feature['centroid']['x'],geocode=feature['attributes']['GEOCODE'],source='Maine GIS township centroid')
        else:
            assert len(candidates) == 1, (town,candidates)
            g = candidates[0]
            county = COUNTIES[int(g['GEOID'][2:5])]
            point = dict(lat=float(g['INTPTLAT']),lng=float(g['INTPTLONG']),geoid=g['GEOID'],source='2025 Census county subdivision')
        assert 43 < point['lat'] < 48 and -71.2 < point['lng'] < -66.8
        record['county'] = county
        points[town] = point
    for filename,value in [('maine-champion-trees.json',records),('maine-town-points.json',dict(sorted(points.items())))]:
        (ROOT/'lib/data'/filename).write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n')
    print(f'Imported {len(records)} records at {len(points)} town/township points.')

if __name__ == '__main__':
    main()
