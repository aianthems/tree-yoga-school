#!/usr/bin/env python3
"""Import UT's public Current Champion Trees HTML and Census 2025 county ZIP.
Usage: python scripts/import-tennessee-champions.py TREES.html COUNTIES.zip
Requires beautifulsoup4. Retains all published entries, including repeated species.
No championship, access, measurement date, or exact tree location is inferred.
"""
import csv, hashlib, io, json, re, sys, zipfile
from pathlib import Path
from bs4 import BeautifulSoup

OUT = Path(__file__).resolve().parents[1] / 'lib/data'
SOURCE = 'https://naturalresources.tennessee.edu/trees/'

def build(html, county_zip):
    soup = BeautifulSoup(Path(html).read_text(), 'html.parser')
    cards = soup.select('.res-item')
    assert len(cards) == 183, 'Changed source total: review before importing'
    with zipfile.ZipFile(county_zip) as z:
        text = z.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter='|' if '|' in text.splitlines()[0] else '\t'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        if r['USPS'] == 'TN':
            counties[r['NAME'].removesuffix(' County')] = {'lat': float(r['INTPTLAT']), 'lng': float(r['INTPTLONG'])}
    assert len(counties) == 95
    records, points = [], {}
    for row, card in enumerate(cards, 1):
        title = card.select_one('.card-title').get_text(' ', strip=True)
        common, scientific = re.split(r'\s+[–—]\s+', title, maxsplit=1)
        footer = card.select_one('.card-footer').get_text(' ', strip=True)
        region, county = re.fullmatch(r'Region:\s*(.*?)\s*[–—]\s*County:\s*(.+)', footer).groups()
        fields = [p.get_text(' ', strip=True) for p in card.select('p') if not p.find('script')]
        values = {}
        for label, key, unit in [('Points', 'points', ''), ('Circumference', 'circumference', 'inches'), ('Tree Height', 'height', 'feet'), ('Crown Spread', 'crown', 'feet')]:
            matches = [v for v in fields if v.startswith(label + ':')]
            assert len(matches) == 1, (row, label)
            m = re.fullmatch(re.escape(label) + r':\s*(\d+(?:\.\d+)?)' + (r'\s*\(' + unit + r'\)' if unit else '') + r'\s*', matches[0])
            assert m, (row, matches)
            values[key] = float(m[1])
        # UT provides no record IDs. Name + published place + source image is a
        # reproducible identity independent of row order and measurement changes.
        img = card.find('img')
        image = (img.get('data-src') or img.get('src')).split('?')[0]
        identity = '|'.join([common, scientific, region, county, image])
        record = dict(id='tn-' + hashlib.sha256(identity.encode()).hexdigest()[:12], state='TN', sourceRow=row,
            scientificName=scientific, commonName=common, town='', county=county,
            location=None, measured=None, mapPrecision='county', sourceUrl=SOURCE,
            status='Listed in Tennessee Current Champion Trees', notes='Published region: ' + region + '.', **values)
        if county in counties:
            points[county] = counties[county]
        else:
            record['sourceReviewNotes'] = [f'The source lists {county} as the county, but it does not match a Tennessee county in the Census Gazetteer. The original value is retained; no map location has been inferred.']
        records.append(record)
    assert len({r['id'] for r in records}) == len(records), 'Ambiguous source identities'
    return records, points

if __name__ == '__main__':
    records, points = build(*sys.argv[1:])
    for name, data in [('tennessee-champion-trees', records), ('tennessee-county-points', points)]:
        (OUT / (name + '.json')).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'listed': len(records), 'mapped': sum(r['county'] in points for r in records), 'counties': len(points), 'species': len(set(r['scientificName'] for r in records))}))
