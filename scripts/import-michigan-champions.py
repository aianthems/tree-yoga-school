#!/usr/bin/env python3
"""Import score leaders only from the Michigan Botanical Society public workbook.

Usage: python scripts/import-michigan-champions.py REGISTER.xlsx COUNTIES.zip
No additional five-point co-champions, variety categories, or location permissions
are inferred. County points are used; tree coordinates and addresses are not copied.
"""
import collections
import csv
import datetime
import hashlib
import io
import json
import math
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
import zipfile

OUTPUT = Path(__file__).resolve().parents[1] / 'lib/data'
REGISTER = 'https://docs.google.com/spreadsheets/d/1x0l0BRXxdGzV6kxMLtvNBb88x0jqlTJfNLpQGZtjrB8/edit?usp=sharing'
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def clean(value):
    return ' '.join(str(value).split()) if value is not None else ''


def category(name):
    # One source species is written both Magnolia x soulangeana and Xsoulangeana.
    return clean(name).lower().replace('xsoulangeana', 'x soulangeana')


def number(value):
    if not value:
        return None
    result = float(value)
    assert math.isfinite(result) and result >= 0
    return result


def read_rows(path):
    with zipfile.ZipFile(path) as archive:
        workbook = ET.fromstring(archive.read('xl/workbook.xml'))
        sheets = workbook.findall('m:sheets/m:sheet', NS)
        assert len(sheets) == 1 and sheets[0].get('name') == 'Big_Tree_Data_2026-07-14', 'Re-audit a changed edition'
        strings = [''.join(el.itertext()) for el in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('m:si', NS)]
        rows = []
        for row in ET.fromstring(archive.read('xl/worksheets/sheet1.xml')).findall('m:sheetData/m:row', NS):
            values = {'sourceRow': int(row.get('r'))}
            for cell in row:
                value = cell.find('m:v', NS)
                value = value.text if value is not None else ''
                if cell.get('t') == 's':
                    value = strings[int(value)]
                values[cell.get('r').rstrip('0123456789')] = clean(value)
            if values.get('A') and row.get('r') != '1':
                rows.append(values)
    assert len(rows) == 667 and len({r['A'] for r in rows}) == 667
    return rows


def build(rows, county_zip):
    with zipfile.ZipFile(county_zip) as archive:
        text = archive.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter='|' if '|' in text.splitlines()[0] else '\t'):
        row = {k.strip(): v.strip() for k, v in raw.items()}
        if row['USPS'] == 'MI':
            counties[row['NAME'].removesuffix(' County')] = {'lat': float(row['INTPTLAT']), 'lng': float(row['INTPTLONG'])}
    groups = collections.defaultdict(list)
    for row in rows:
        assert row.get('C') and number(row.get('G')) is not None
        groups[category(row['C'])].append(row)
    records, candidates = [], []
    condition_notes = {
        '1679': 'Source field notes report lost branches affecting height and spread.',
        '1592': 'Source field notes report dead wood in the crown and a hole at the base.',
        '1652': 'Source field notes report a lost large side limb and a hollow trunk.',
        '1874': 'Source field notes report many dead branch ends.',
    }
    for key, group in groups.items():
        highest = max(number(row['G']) for row in group)
        winners = [row for row in group if number(row['G']) == highest]
        for row in group:
            oid = str(int(float(row['A'])))
            included = row in winners
            candidates.append({'sourceTreeId': oid, 'sourceRow': row['sourceRow'], 'scientificName': row['C'], 'category': key, 'points': number(row['G']), 'highestPoints': highest, 'included': included})
            if not included:
                continue
            county = row['N'].removesuffix(' County').replace('Gd. Traverse', 'Grand Traverse')
            assert county in counties, f'Unmatched county: {county}'
            notes = [condition_notes[oid]] if oid in condition_notes else []
            common = row.get('B')
            if not common:
                common = next((r['B'] for r in group if r.get('B')), row['C'])
                notes.append('Common name is absent from this row; the display name comes from another row of the same species, or the scientific name.')
            date = (datetime.date(1899, 12, 30) + datetime.timedelta(days=float(row['L']))).isoformat() if row.get('L') else None
            if date and date < '2016-10-09':
                notes.append('The published verification date is more than ten years before this snapshot. Continued listing does not confirm current condition or recertification.')
            if not date:
                notes.append('Verification date is absent from the source; no date is inferred.')
            if row.get('D') and row['D'].lower() != 'none':
                notes.append('Source variety: ' + row['D'] + '. Selection is by species, not a separate variety category.')
            records.append({
                'id': 'mi-' + oid, 'state': 'MI', 'mapPrecision': 'county',
                'sourceRow': row['sourceRow'], 'sourceTreeId': oid, 'sourceUrl': REGISTER.split('?')[0] + '#range=A' + str(row['sourceRow']) + ':Q' + str(row['sourceRow']),
                'status': 'Michigan score-based tied leader' if len(winners) > 1 else 'Michigan score-based leader',
                'scientificName': row['C'], 'commonName': common, 'county': county, 'sourceCounty': row['N'], 'town': '', 'location': None,
                'measured': date, 'circumference': number(row.get('H')), 'height': number(row.get('I')), 'crown': number(row.get('J')), 'points': number(row['G']),
                'notes': None, **({'nationalFlag': 'National champion marked Y in the Michigan source'} if row.get('K') == 'Y' else {}),
                **({'sourceReviewNotes': notes} if notes else {}),
            })
    records.sort(key=lambda r: r['sourceRow'])
    candidates.sort(key=lambda r: r['sourceRow'])
    used = {r['county'] for r in records}
    assert len(groups) == 120 and len(records) == 122 and len(used) == 38
    return records, {c: counties[c] for c in sorted(used)}, candidates


if __name__ == '__main__':
    source = Path(sys.argv[1])
    records, points, candidates = build(read_rows(source), sys.argv[2])
    audit = {'retrieved': '2026-10-09', 'edition': 'Big_Tree_Data_2026-07-14', 'sourceUrl': REGISTER, 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
             'sourceRows': 667, 'includedRows': 122, 'excludedRows': 545, 'categories': 120,
             'selection': 'Highest published Points per Scientific Name, including exact ties. Variety metadata does not create extra categories. Magnolia Xsoulangeana is grouped with Magnolia x soulangeana. No additional near-score co-champions inferred.',
             'location': 'County-only points from Census. GPS, addresses, owner information, and location field notes are not imported. Public visiting access unclassified.',
             'dates': 'Verification Date retained as measured date; missing dates remain null. Older dates are qualified, not used to replace a higher-scoring listed tree.',
             'candidates': candidates}
    for name, data in [('michigan-champion-trees.json', records), ('michigan-county-points.json', points), ('michigan-import-audit.json', audit)]:
        (OUTPUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(f'Imported {len(records)} leaders in {len(points)} counties; excluded {667 - len(records)} lower-scoring trees')
