#!/usr/bin/env python3
"""Import South Dakota's published table without correcting source values.
Usage: python scripts/import-south-dakota-champions.py CURRENT.html COUNTIES.zip
Uses only Python's standard library; checks the reviewed 60-row fixture.
"""
import csv, hashlib, io, json, re, sys, zipfile
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://danr.sd.gov/Conservation/Forestry/ForestWoodlandTrees/BigTreeRegister/CurrentList.aspx'
PROGRAM = 'https://danr.sd.gov/Conservation/Forestry/ForestWoodlandTrees/BigTreeRegister/default.aspx'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'

class RegisterParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.rows = []; self.row = None; self.cell = None; self.em = False
    def handle_starttag(self, tag, attrs):
        if tag == 'tr': self.row = []
        if tag == 'td' and self.row is not None: self.cell = {'text': '', 'scientific': '', 'common': ''}
        if tag == 'em': self.em = True
        if tag == 'br' and self.cell is not None:
            self.cell['text'] += '\x1f'; self.cell['common'] += ' '
    def handle_data(self, data):
        if self.cell is not None:
            self.cell['text'] += data
            self.cell['scientific' if self.em else 'common'] += data
    def handle_endtag(self, tag):
        if tag == 'em': self.em = False
        if tag == 'td' and self.cell is not None:
            self.row.append({k: '\n'.join(' '.join(part.split()) for part in v.split('\x1f')) for k, v in self.cell.items()}); self.cell = None
        if tag == 'tr' and self.row is not None:
            if len(self.row) == 8 and self.row[0]['scientific']: self.rows.append(self.row)
            self.row = None

def extract(path):
    parser = RegisterParser(); parser.feed(Path(path).read_text())
    return [dict(commonName=r[0]['text'].split('\n')[0], scientificName=' '.join(r[0]['text'].split('\n')[1:]).strip(),
                 measurements=[c['text'] for c in r[1:5]], town=r[5]['text'], county=r[6]['text']) for r in parser.rows]

def circumference(text):
    m = re.fullmatch(r"(?:(\d+)'\s*)?(?:(\d+)\")?", text.strip())
    assert m and any(m.groups()), text
    return int(m[1] or 0) * 12 + int(m[2] or 0)

def geography(path):
    with zipfile.ZipFile(path) as archive:
        content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    points = {}
    for raw in csv.DictReader(io.StringIO(content), delimiter='|'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        if r['USPS'] == 'SD': points[r['NAME'].removesuffix(' County')] = dict(lat=float(r['INTPTLAT']), lng=float(r['INTPTLONG']))
    return points

def build(register, counties):
    fixture = extract(register)
    reviewed = json.loads((ROOT / 'scripts/fixtures/south-dakota-champions.json').read_text())
    assert fixture == reviewed, 'Source changed: review every row before updating the fixture'
    assert len(fixture) == 60
    geography_points = geography(counties); records = []; points = {}; discrepancies = []
    for row, f in enumerate(fixture, 1):
        assert f['county'] in geography_points
        points[f['county']] = geography_points[f['county']]
        circ = circumference(f['measurements'][0])
        height, crown, score = [float(v.rstrip("'")) for v in f['measurements'][1:]]
        warnings = []
        if abs(circ + height + crown / 4 - score) > 1: discrepancies.append(row)
        if f['commonName'] == 'Sycamore, American':
            warnings.append('The table prints circumference as 11 inches, despite a published score of 253. The original 11-inch value is retained; no feet mark or replacement measurement is inferred.')
        records.append(dict(id=f'sd-r{row}', state='SD', sourceRow=row, sourceUrl=SOURCE,
            scientificName=f['scientificName'], commonName=f['commonName'], town=f['town'], county=f['county'],
            location=None, measured=None, circumference=circ, height=height, crown=crown, points=score,
            status='South Dakota published Big Tree Register',
            sourceReviewNotes=warnings,
            notes=f"Source circumference: {f['measurements'][0]} (feet and inches). Names, measurements and scores retained as published. No edition or measurement dates supplied. The program overview counts differ from this 60-row table; it includes no row-level champion/challenger designation. Current condition, title and visiting access are unverified."))
    audit = dict(registerUrl=SOURCE, programUrl=PROGRAM, geographyUrl=GEOGRAPHY,
        retrieved='October 11, 2026', edition=None, expectedRecords=60, mappedRecords=60, countyCount=len(points),
        sourceHashes={Path(p).name: hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in (register, counties)},
        scoreDiscrepancyRows=discrepancies,
        review='All 60 published table rows retained. Program overview says 57 champion species and 234 champions/challengers; neither count matches this table. No absent rows, co-champion or national designations inferred. Row-level champion/challenger status is not supplied. Scientific labels including Fraxius, triancanthos, genus-only sp. labels and botanical authority retained without identity corrections. Sycamore circumference remains the printed 11 inches. Program overview cottonwood differs from the table; table values used.',
        geography='All counties matched exactly to Census 2025 SD county points. Nearest community retained, but marker represents the county, not the community or individual tree.',
        units='Circumference converted from explicit feet and inches to inches. Height and crown spread in feet; original decimal scores retained.',
        privacy='No exact tree coordinates, addresses, owners, contact details or visiting permissions inferred.')
    for name, data in [('south-dakota-champion-trees.json', records), ('south-dakota-county-points.json', dict(sorted(points.items()))), ('south-dakota-import-audit.json', audit)]:
        (ROOT / 'lib/data' / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(records=len(records), counties=len(points), scoreDiscrepancyRows=discrepancies)))

if __name__ == '__main__':
    if len(sys.argv) != 3: sys.exit(__doc__)
    build(sys.argv[1], sys.argv[2])
