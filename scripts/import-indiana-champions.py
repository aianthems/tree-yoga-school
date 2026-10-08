#!/usr/bin/env python3
"""Import Indiana DNR's current champion table and Census 2025 county ZIP.
Usage: python scripts/import-indiana-champions.py REGISTER.html COUNTIES.zip
Uses the Python standard library. Published values are never recalculated.
"""
import csv
import hashlib
import io
import json
import re
import sys
import zipfile
from html.parser import HTMLParser
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / 'lib/data'
SOURCE = 'https://www.in.gov/dnr/forestry/forestry-publications-and-presentations/indiana-big-tree-register/'
HEADER = ['Species', 'Scientific Name', 'County', 'Circumference (inches)', 'Height (feet)', 'Crown (feet)', 'Points']

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables, self.table, self.row, self.cell = [], None, None, None

    def handle_starttag(self, tag, attrs):
        if tag == 'table': self.table = []
        if tag == 'tr' and self.table is not None: self.row = []
        if tag in ('td', 'th') and self.row is not None: self.cell = []
        if tag == 'br' and self.cell is not None: self.cell.append(' ')

    def handle_data(self, data):
        if self.cell is not None: self.cell.append(data)

    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self.cell is not None:
            self.row.append(' '.join(''.join(self.cell).split()))
            self.cell = None
        if tag == 'tr' and self.row is not None:
            self.table.append(self.row)
            self.row = None
        if tag == 'table' and self.table is not None:
            self.tables.append(self.table)
            self.table = None

def build(html, county_zip):
    parser = TableParser()
    parser.feed(Path(html).read_text())
    tables = [t for t in parser.tables if t and t[0] == HEADER]
    assert len(tables) == 1, 'Expected one current champion table with known measurement units'
    rows = tables[0][1:]
    assert len(rows) == 95, 'Source count changed; review before importing'
    with zipfile.ZipFile(county_zip) as archive:
        text = archive.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter='|' if '|' in text.splitlines()[0] else '\t'):
        row = {k.strip(): v.strip() for k, v in raw.items()}
        if row['USPS'] == 'IN':
            counties[row['NAME'].removesuffix(' County')] = {'lat': float(row['INTPTLAT']), 'lng': float(row['INTPTLONG'])}
    assert len(counties) == 92
    aliases = {'St Joseph': 'St. Joseph', 'Laporte': 'LaPorte'}
    records, points, excluded = [], {}, []
    for source_row, cells in enumerate(rows, 1):
        assert len(cells) == 7, (source_row, cells)
        published_name, scientific, source_county, *values = cells
        if source_county == '-' and values == ['-'] * 4:
            excluded.append({'sourceRow': source_row, 'commonName': published_name, 'scientificName': scientific, 'reason': 'Empty species row; no tree, county, or measurements supplied'})
            continue
        assert all(re.fullmatch(r'\d+(?:\.\d+)?', v) for v in values), (source_row, values)
        county = aliases.get(source_county, source_county)
        assert county in counties, (source_row, source_county)
        common = re.sub(r'\s*\|\s*co-champion\s*$', '', published_name, flags=re.I)
        cochampion = common != published_name
        identity = '|'.join([scientific, county, common])
        notes = []
        if cochampion: notes.append(f'Published species field: {published_name}. Co-champion status retained from this label.')
        if county != source_county: notes.append(f'Published county: {source_county}. Marker matched to {county} County.')
        if scientific == 'Magnolia tripetala':
            notes.append('The page also names umbrella magnolia among species without a current champion. Its populated co-champion rows are retained as listed; current status needs confirmation from Indiana DNR.')
        record = dict(id='in-' + hashlib.sha256(identity.encode()).hexdigest()[:12], state='IN', sourceRow=source_row,
            sourceTreeId=None, scientificName=scientific, commonName=common, sourceCounty=source_county, county=county,
            town='', location=None, measured=None, mapPrecision='county', sourceUrl=SOURCE,
            status='State co-champion' if cochampion else 'Listed in Indiana current champion list', notes=None,
            **dict(zip(['circumference', 'height', 'crown', 'points'], map(float, values))))
        if notes: record['sourceReviewNotes'] = notes
        records.append(record)
        points[county] = counties[county]
    assert len(records) == 93 and len(excluded) == 2
    assert len({r['id'] for r in records}) == len(records), 'Duplicate identity; review before import'
    audit = {'sourceUrl': SOURCE, 'retrieved': 'October 8, 2026', 'sourceRows': len(rows), 'included': len(records),
        'coChampions': sum(r['status'] == 'State co-champion' for r in records), 'excludedRows': excluded,
        'identity': 'SHA256 of scientific name, canonical county, and common name without co-champion suffix; first 12 hex digits. Source supplies no tree IDs. Changes to names or county require reconciliation on refresh.',
        'geography': '2025 Census county internal points; approximate county markers, not tree coordinates'}
    return records, points, audit

if __name__ == '__main__':
    records, points, audit = build(*sys.argv[1:])
    for name, data in [('indiana-champion-trees', records), ('indiana-county-points', points), ('indiana-import-audit', audit)]:
        (OUT / (name + '.json')).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'listed': len(records), 'counties': len(points), 'coChampions': audit['coChampions'], 'excluded': len(audit['excludedRows'])}))
