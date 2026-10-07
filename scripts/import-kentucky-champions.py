#!/usr/bin/env python3
"""Import Kentucky Forestry register HTML and Census 2025 county ZIP.
Usage: python scripts/import-kentucky-champions.py REGISTER.html COUNTIES.zip
Requires beautifulsoup4. Import one card per source ID, not its repeated modal.
Published coordinates are not used as map points or proof of visiting access.
"""
import csv, io, json, re, sys, zipfile
from datetime import datetime
from pathlib import Path
from bs4 import BeautifulSoup
OUT = Path(__file__).resolve().parents[1] / 'lib/data'
SOURCE = 'https://eec.ky.gov/Natural-Resources/Forestry/ky-champion-trees/Pages/default.aspx'

def build(html, county_zip):
    soup = BeautifulSoup(Path(html).read_text(), 'html.parser')
    cards = [x.find_parent('li') for x in soup.select('.species')]
    assert len(cards) == 107, 'Source count changed; review before importing'
    with zipfile.ZipFile(county_zip) as z:
        text = z.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter='|' if '|' in text.splitlines()[0] else '\t'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        if r['USPS'] == 'KY':
            counties[r['NAME'].removesuffix(' County')] = {'lat': float(r['INTPTLAT']), 'lng': float(r['INTPTLONG'])}
    assert len(counties) == 120
    records, points = [], {}
    for row, card in enumerate(cards, 1):
        def field(selector):
            element = card.select_one(selector)
            return element.get_text(' ', strip=True) if element else ''
        source_id = card.select_one('.card-modal')['id']
        source_county = field('.counties')
        county = source_county.split('/')[0].strip().removesuffix(' Co')
        assert county in counties, (source_id, source_county)
        site = field('.location')
        location_label = field('.latlong').removeprefix('Location:').strip()
        measured = field('.measured').removeprefix('Date Measured:').strip()
        raw_measured = measured
        if '/' in measured:
            measured = datetime.strptime(measured, '%m/%d/%Y').date().isoformat()
        elif measured == 'pdf':
            measured = ''
        else:
            assert not measured or re.fullmatch(r'\d{4}', measured), measured
        details = card.select_one('.modal-body p.description')
        values = {label.get_text(strip=True).rstrip(':'): str(label.next_sibling).strip() for label in details.select('strong')}
        metrics = {}
        for label, key in [('Circum (in.)','circumference'), ('Height (ft.)','height'), ('Crown (ft.)','crown'), ('Index Score','points')]:
            value = values[label]
            assert re.fullmatch(r'\d+(?:\.\d+)?', value), (source_id,label,value)
            metrics[key] = float(value)
        private = 'private' in (site + ' ' + location_label).lower()
        cochamp = bool(re.search(r'co[- ](?:state[- ]|champion)|co-champion', site + ' ' + source_county, re.I))
        notes = []
        if raw_measured == 'pdf':
            notes.append('The source measurement-date field contains “pdf” rather than a date. No measurement date has been inferred.')
        if source_county != county:
            notes.append(f'Published county field: {source_county}. County marker matched to {county} County.')
        if source_id == '21':
            notes.append('The page also lists swamp cottonwood among species without state champions. This published card is retained; current champion status needs confirmation from Kentucky Forestry.')
        record = dict(id='ky-' + source_id, state='KY', sourceRow=row, sourceTreeId=source_id,
            scientificName=field('.scientific'), commonName=field('.species'), county=county, sourceCounty=source_county,
            town='', location=site or ('Private' if private else None), measured=measured or None,
            nominated=values.get('Original Date Nominated', ''), mapPrecision='county', sourceUrl=SOURCE,
            status='State co-champion' if cochamp else 'Listed in Kentucky Champion Trees',
            nationalFlag=field('.champion'), accessDetails='Private — as labelled by the source' if private else 'Public visiting access unclassified',
            notes=None, **metrics)
        if private:
            record['publicAccess'] = False
        if notes:
            record['sourceReviewNotes'] = notes
        records.append(record)
        points[county] = counties[county]
    assert len({r['id'] for r in records}) == len(records)
    return records, points

if __name__ == '__main__':
    records, points = build(*sys.argv[1:])
    for name, data in [('kentucky-champion-trees', records), ('kentucky-county-points', points)]:
        (OUT / (name + '.json')).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'listed': len(records), 'counties': len(points), 'private':sum(r.get('publicAccess') is False for r in records), 'cochampions':sum(r['status']=='State co-champion' for r in records)}))
