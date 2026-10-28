"""Reproduce the audited October 2000 Mississippi import from the scan and Census ZIP.

Usage: python scripts/import-mississippi-historical.py SCAN.pdf COUNTIES.zip
The reviewed PSV transcription is versioned; OCR alone is not an import source.
"""
import csv
import hashlib
import io
import json
import sys
import zipfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / 'scripts/fixtures/mississippi-champions-2000.psv'
PDF_URL = '/data/mississippi-champions-2000-transcription.pdf'
PAGE_COUNTS = {3: 20, 4: 23, 5: 19, 6: 25, 7: 25, 8: 20, 9: 11, 10: 20}
PDF_SHA256 = 'c97c5df7e76396763af0b26879542d65fbb3b8eea8f4c0789ae2c5ab1ec58aed'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inches(value):
    feet, remainder = map(int, value.split('-'))
    assert feet >= 0 and 0 <= remainder < 12, value
    return feet * 12 + remainder


def measurement(value):
    feet, remainder = value.split('-')
    return f'{feet} ft {remainder} in'


def main(pdf, geography):
    assert sha(pdf) == PDF_SHA256, 'Changed scan: audit before importing'
    rows = list(csv.DictReader(FIXTURE.open(), delimiter='|'))
    assert Counter(int(r['page']) for r in rows) == PAGE_COUNTS
    assert Counter(r['designation'] for r in rows) == {'': 147, '*': 4, '**': 10, '***': 2}
    with zipfile.ZipFile(geography) as archive:
        content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    delimiter = '|' if '|' in content.splitlines()[0] else '\t'
    counties = {
        r['NAME'].strip().removesuffix(' County'): r
        for r in csv.DictReader(io.StringIO(content), delimiter=delimiter)
        if r['USPS'].strip() == 'MS'
    }
    records, points, ordinals, discrepancies = [], {}, Counter(), []
    for index, row in enumerate(rows, 1):
        page = int(row['page'])
        ordinals[page] += 1
        tree_id = f'ms-2000-p{page:02d}-r{ordinals[page]:02d}'
        county = 'Pearl River' if row['county'] == 'Pearl river' else row['county']
        assert county in counties, county
        geo = counties[county]
        points[county] = {'lat': float(geo['INTPTLAT']), 'lng': float(geo['INTPTLONG'])}
        circumference = inches(row['circumferenceFtIn'])
        crown = inches(row['crownFtIn']) / 12
        height, score = float(row['heightFt']), float(row['points'])
        calculated = circumference + height + crown / 4
        designation = {'': 'State champion', '*': 'State co-champion', '**': 'National champion', '***': 'National co-champion'}[row['designation']]
        warnings = []
        if abs(calculated - score) > 0.015:
            warnings.append(f'The 2000 table prints {score:g} points; its listed measurements calculate to {calculated:g}. The published score is retained.')
            discrepancies.append({'id': tree_id, 'published': score, 'calculated': calculated})
        if row['scientificName'] in ('Crataegus millis', 'Crataegus spatulata', 'Moraceae broussonetia papyrifera', 'Juniperus viriginiana', 'Viburnum raffidulum'):
            warnings.append('The botanical name is retained as printed in the 2000 scan; its spelling or botanical form needs confirmation. No modern identification is inferred.')
        if (page == 3 and ordinals[page] == 11) or (page == 10 and ordinals[page] == 7):
            other = 'ms-2000-p10-r07' if page == 3 else 'ms-2000-p03-r11'
            warnings.append(f'Possible duplicate source listing: {other} has the same county, measurements, score, nominators and owner under a different heading/name. Both source rows are preserved, not counted as confirmed distinct trees.')
        if page == 4 and ordinals[page] == 17:
            warnings.append('This historical Roughleaf Dogwood is listed in Washington County. It is not merged with the 2024 national-register record ms-5821 in Tunica County; shared species does not establish tree identity.')
        if page == 8 and ordinals[page] == 12:
            warnings.append('The table gives Spruce Pine height as 154 feet, although the introduction calls a 152-foot Black Willow the tallest champion. Both published heights are retained; no new title is inferred.')
        if page == 7 and ordinals[page] == 24:
            warnings.append('The table gives White Oak circumference as 19 ft 3 in; the photo caption on the same page says over twenty feet. The table measurement is retained.')
        record = {
            'id': tree_id, 'state': 'MS', 'sourceRow': index, 'sourcePage': page,
            'sourcePosition': f'page {page}, table row {ordinals[page]}',
            'sourceUrl': f'{PDF_URL}#page={page}', 'sourceEdition': 'October 2000', 'historical': True,
            'scientificName': row['scientificName'], 'commonName': row['commonName'],
            'town': '', 'county': county, 'sourceCounty': row['county'], 'location': None,
            'measured': None, 'circumference': circumference, 'height': height, 'crown': round(crown, 8), 'points': score,
            'sourceMeasurements': {'circumference': measurement(row['circumferenceFtIn']), 'crown': measurement(row['crownFtIn']), 'height': f"{row['heightFt']} ft", 'points': row['points']},
            'sourceDesignation': row['designation'],
            'status': 'Historical champion record — October 2000',
            'nationalFlag': f'{designation} in the October 2000 publication',
            'notes': f'Historical champion record from MFC Publication #35, revised October 2000; PDF page {page}, table row {ordinals[page]}. {designation} as published then. Individual measurement date is not supplied; October 2000 is the publication edition. Current survival, condition, champion standing, ownership and visiting access are unverified. Marker represents the county, not the tree. Owner and nominator names are omitted from imported fields.',
        }
        if warnings:
            record['sourceReviewNotes'] = warnings
        records.append(record)
    current = json.loads((ROOT / 'lib/data/mississippi-champion-trees.json').read_text())
    assert len(current) == 1 and current[0]['id'] == 'ms-5821', 'Preserve the separately audited 2024 national dataset'
    with (ROOT / 'lib/data/mississippi-county-points.json').open() as handle:
        existing = json.load(handle)
    assert points['Tunica'] == existing['Tunica'], 'County baseline changed; review geography'
    points.update({'Tunica': existing['Tunica']})
    audit = {
        'publicTranscriptionSha256': sha(ROOT / 'public/data/mississippi-champions-2000-transcription.pdf'),
        'publicTranscription': 'Reviewed species/measurement/county/designation transcription; original scan and personal columns are not published.',
        'sourceEdition': 'October 2000', 'publication': 'MFC Publication #35', 'sourceSha256': sha(pdf),
        'receivedByEmail': '2026-10-21', 'auditedOn': '2026-10-28',
        'transcriptionFile': str(FIXTURE.relative_to(ROOT)), 'transcriptionSha256': sha(FIXTURE),
        'tablePages': list(PAGE_COUNTS), 'rowsByPage': PAGE_COUNTS,
        'introductoryChampionCount': 164, 'transcribedTableRows': len(rows),
        'countDiscrepancy': 'The introduction reports 164 champions; the supplied scan contains 163 table rows. No missing record is invented.',
        'excludedPages': {'1': 'Cover', '2': 'Introduction; no extra tree records', '11': 'Species without a champion; not records', '12': 'Nomination and measurement guidance'},
        'designationCounts': {'unstarredStateChampion': 147, 'stateCoChampion': 4, 'nationalChampion': 10, 'nationalCoChampion': 2},
        'possibleDuplicateRows': ['ms-2000-p03-r11', 'ms-2000-p10-r07'],
        'duplicateHandling': 'Preserve both source listings with cross-references; counts describe records, not confirmed distinct living trees.',
        'scoreDiscrepancies': discrepancies, 'countyCount': len(points),
        'countySource': 'Census 2025 national county Gazetteer', 'geographySha256': sha(geography),
        'countyGeoids': {name: counties[name]['GEOID'].strip() for name in sorted(points)},
        'countyNormalizations': {'Pearl river': 'Pearl River'},
        'measurementConversion': 'Circumference feet/inches to inches; crown feet/inches to decimal feet. Original strings and published scores retained. Publication date is not used as a measurement date.',
        'omittedFields': ['Nominator', 'Owner'],
        'newRegister': {'reportedBy': 'Loren Erickson', 'reportedOn': '2026-10-21', 'expected': 'After the start of 2027; no firm release date', 'programUrl': 'https://www.mfc.ms.gov/programs/urban-community-forestry/'},
        'newerNationalRecord': {'id': 'ms-5821', 'edition': 2024, 'county': 'Tunica', 'unchanged': True},
    }
    for filename, data in [('mississippi-historical-champion-trees.json', records), ('mississippi-historical-import-audit.json', audit), ('mississippi-county-points.json', dict(sorted(points.items())))]:
        (ROOT / 'lib/data' / filename).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(f'MS: {len(records)} historical rows + 1 preserved national record at {len(points)} approximate county points')


if __name__ == '__main__':
    main(*map(Path, sys.argv[1:3]))
