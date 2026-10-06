"""Import the March 24, 2026 RI Tree Council table. Python standard library only.
Usage: python3 scripts/import-rhode-island-champions.py [saved-page.html] [gazetteer.txt]
Unexpected table changes fail before writing. The malformed final row is quarantined.
"""
import csv
import io
import json
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://ritree.org/champion-tree/'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_44.txt'
COUNTIES = {'001': 'Bristol', '003': 'Kent', '005': 'Newport', '007': 'Providence', '009': 'Washington'}

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell = [], None, None
    def handle_starttag(self, tag, attrs):
        if tag == 'tr': self.row = []
        if tag in ('td', 'th'): self.cell = ''
    def handle_data(self, data):
        if self.cell is not None: self.cell += data
    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self.cell is not None:
            self.row.append(' '.join(self.cell.split()))
            self.cell = None
        if tag == 'tr' and self.row:
            self.rows.append(self.row)
            self.row = None

def read(path, url):
    if path: return Path(path).read_text()
    with urllib.request.urlopen(url) as response: return response.read().decode()

def main():
    html = read(sys.argv[1] if len(sys.argv) > 1 else None, SOURCE)
    assert 'March 24, 2026' in html
    parser = TableParser()
    parser.feed(html)
    rows = parser.rows
    assert rows[0] == ['GENUS','SPECIES','COMMON NAME','CITY/TOWN','ADDRESS','TR','HT','CR','PTS','RK']
    assert len(rows) == 157, 'Review changed source count'
    assert rows[-1] == ['Zelkova','3051','2746','2441','2136','1526','1221','916','306','1'], 'Review final row'
    gaz = list(csv.DictReader(io.StringIO(read(sys.argv[2] if len(sys.argv) > 2 else None, GEOGRAPHY)), delimiter='|'))
    records, points = [], {}
    for row_number, row in enumerate(rows[1:-1], 1):
        assert len(row) == 10 and row[-1] == '1', row
        genus, species, common, town, address, trunk, height, crown, score, rank = row
        assert genus.isalpha() and not species.isnumeric() and common and address
        map_town = 'Providence' if town == 'Swan Point Cemetery' else town
        matches = [g for g in gaz if g['NAME'] in (map_town+' town', map_town+' city')]
        assert len(matches) == 1, (town, matches)
        g = matches[0]
        point = dict(lat=float(g['INTPTLAT']), lng=float(g['INTPTLONG']), geoid=g['GEOID'])
        assert 41 < point['lat'] < 42.1 and -72 < point['lng'] < -71
        points[map_town] = point
        record = dict(id=f'ri-2026-{row_number}', state='RI', sourceRow=row_number,
                      scientificName=f'{genus} {species}', commonName=common, town=town,
                      county=COUNTIES[g['GEOID'][2:5]], location=address, measured=None,
                      circumference=float(trunk), height=float(height), crown=float(crown), points=float(score),
                      status=f'Rank {rank}', sourceUrl=SOURCE, notes=None)
        if town != map_town:
            record['mapTown'] = map_town
            record['notes'] = 'The city/town column says Swan Point Cemetery and the address column says Forest Street. The original fields are retained; the cemetery’s own website places it in Providence (https://swanpointcemetery.com/).'
        records.append(record)
    assert len(records) == 155 and len({r['id'] for r in records}) == 155
    excluded = dict(edition='March 24, 2026', retrieved='October 6, 2026', sourceUrl=SOURCE,
                    excludedRows=[dict(sourceRow=156, values=rows[-1], reason='Malformed species, name and place fields; no tree identity or location inferred.')])
    for name, value in [('rhode-island-champion-trees.json', records), ('rhode-island-town-points.json', dict(sorted(points.items()))), ('rhode-island-excluded-rows.json', excluded)]:
        (ROOT/'lib/data'/name).write_text(json.dumps(value, indent=2, ensure_ascii=False)+'\n')
    print(f'Imported {len(records)} records at {len(points)} municipality points; 1 malformed row excluded.')

if __name__ == '__main__': main()
