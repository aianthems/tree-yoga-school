#!/usr/bin/env python3
"""Import GFC's register, saved individual detail pages and Census county ZIP.

Usage: python scripts/import-georgia-champions.py REGISTER.html DETAILS_DIR COUNTIES.zip
Requires beautifulsoup4. Detail pages are named by their URL slug.
Every unique ID in the official register is retained. Use the first published
row's detail page when available, otherwise that summary row; audit all variants. No title, public access or exact position is inferred.
"""
import csv
import datetime
import io
import json
import re
import sys
import zipfile
from pathlib import Path
from bs4 import BeautifulSoup

OUT = Path(__file__).resolve().parents[1] / 'lib/data'
SOURCE = 'https://gatrees.org/learn-explore/champion-trees/'

def fields(element):
    result = {}
    for label in element.select('strong'):
        value = []
        for sibling in label.next_siblings:
            if getattr(sibling, 'name', None) in ('br', 'strong'):
                break
            value.append(sibling.get_text(' ', strip=True) if hasattr(sibling, 'get_text') else str(sibling))
        result[label.get_text(' ', strip=True).rstrip(':')] = ' '.join(' '.join(value).split())
    return result

def number(value):
    if not value:
        return None
    assert re.fullmatch(r'\d+(?:\.\d+)?', value), value
    return float(value)

def build(register, details, county_zip):
    soup = BeautifulSoup(Path(register).read_text(), 'html.parser')
    listed = {}
    rows = 0
    for card in soup.select('article'):
        tags = card.select_one('.tags')
        if not tags or 'Common Name:' not in tags.get_text():
            continue
        row = fields(tags)
        row['Species'] = card.select_one('.entry-title').get_text(' ', strip=True)
        tree_id = row['ID']
        assert tree_id.isdigit()
        link = card.select_one('a[href*="/champion_tree/"]')['href']
        assert link.startswith('https://gatrees.org/champion_tree/')
        row['sourceUrl'] = link
        listed.setdefault(tree_id, []).append(row)
        rows += 1
    assert rows == 407 and len(listed) == 403, 'Source counts changed; review before importing'
    with zipfile.ZipFile(county_zip) as archive:
        text = archive.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter='|' if '|' in text.splitlines()[0] else '\t'):
        row = {k.strip(): v.strip() for k, v in raw.items()}
        if row['USPS'] == 'GA':
            counties[row['NAME'].removesuffix(' County')] = {'lat': float(row['INTPTLAT']), 'lng': float(row['INTPTLONG'])}
    assert len(counties) == 159
    canonical_counties = {name.casefold(): name for name in counties}
    records, points, audit = [], {}, {'sourceUrl': SOURCE, 'retrieved': '2026-10-07', 'listRows': rows, 'uniqueIds': len(listed), 'duplicateIds': {}, 'listDetailDifferences': {}, 'detailUnavailable': []}
    for tree_id, list_rows in listed.items():
        source_url = list_rows[0]['sourceUrl']
        detail_path = Path(details) / (source_url.rstrip('/').split('/')[-1] + '.html')
        row = dict(list_rows[0])
        row['Georgia National'] = row.pop('Georgia or National')
        row['Date Measured'] = ''
        has_detail = detail_path.exists()
        if has_detail:
            page = BeautifulSoup(detail_path.read_text(), 'html.parser')
            heading = page.find('h3', string=lambda s: s and s.strip() == 'Champion Tree Information')
            assert heading, tree_id
            row = fields(heading.parent)
        else:
            audit['detailUnavailable'].append({'id': tree_id, 'url': source_url})
        for key in ('Common Name', 'Genus', 'Species', 'County', 'Circumference', 'Height', 'Crown', 'Score', 'Georgia National', 'Co-Champion', 'Date Measured'):
            assert key in row, (tree_id, key)
        warnings = []
        if not has_detail:
            warnings.append('The individual page was unavailable during this snapshot. Values follow the official summary list; its table does not include a measurement date.')
        if len(list_rows) > 1:
            audit['duplicateIds'][tree_id] = list_rows
            warnings.append(f'The register repeats Tree ID {tree_id} in {len(list_rows)} rows. It is counted once using ' + ('the individual GFC record.' if has_detail else 'the first published summary row.'))
            if len({json.dumps({k: v for k, v in r.items() if k != 'sourceUrl'}, sort_keys=True) for r in list_rows}) > 1:
                warnings.append('Repeated summary rows differ in spelling, county or designation. All variants are retained in the import audit; no additional tree or title is inferred.')
        differences = {key: {'list': list_rows[0].get(key), 'detail': value} for key, value in row.items() if key in list_rows[0] and list_rows[0][key] != value}
        if differences:
            audit['listDetailDifferences'][tree_id] = differences
            warnings.append('Some summary-list fields differ from the individual record. This entry retains the individual GFC record values.')
        source_name = ' '.join((row['Genus'] + ' ' + row['Species']).split())
        # Only normalize the capitalization of a simple species epithet. Keep
        # source spellings, hybrid and variety labels; do not guess taxonomy.
        epithet = row['Species']
        if re.fullmatch(r'[A-Z][a-z-]+', epithet):
            epithet = epithet[0].lower() + epithet[1:]
        scientific = ' '.join((row['Genus'] + ' ' + epithet).split())
        if scientific != source_name:
            warnings.append(f'The source writes the scientific name as {source_name}; only species-epithet capitalization is normalized here.')
        if not row['Species']:
            warnings.append('The source leaves the species field blank. Only its published genus is shown; no species is inferred.')
        county = canonical_counties.get(row['County'].casefold(), row['County'])
        if county in counties:
            points[county] = counties[county]
        else:
            warnings.append('The individual source record does not supply a recognized Georgia county. This entry remains in the list without a map marker.')
        date = row['Date Measured']
        measured = None
        if date:
            try:
                parsed = datetime.date.fromisoformat(date[:10])
                if parsed.year < 1800:
                    raise ValueError('Placeholder date')
                measured = parsed.isoformat()
            except ValueError:
                warnings.append(f'The source measurement date is {date}. It is retained in this note rather than interpreted as a measurement date.')
        designation, co = row['Georgia National'], row['Co-Champion']
        status = 'GFC designation: ' + (designation or 'not stated')
        if co:
            status += ' · Co-champion: ' + co
        if designation not in ('Georgia', 'National'):
            warnings.append('The Georgia/National designation is blank or ambiguous in the source. Inclusion follows the official register; no additional champion title is inferred.')
        record = dict(id=f'ga-{tree_id}', state='GA', sourceRow=int(tree_id), sourceTreeId=tree_id,
            scientificName=scientific, commonName=row['Common Name'], town='', county=county,
            sourceCounty=row['County'], location=None, measured=measured, mapPrecision='county',
            sourceUrl=source_url, status=status,
            circumference=number(row['Circumference']), height=number(row['Height']), crown=number(row['Crown']), points=number(row['Score']),
            notes=f'Georgia/National field: {designation or "not stated"}. Co-champion field: {co or "not stated"}.',
            sourceReviewNotes=warnings)
        if designation == 'National':
            record['nationalFlag'] = 'National · GFC source label; current national status not independently verified'
        records.append(record)
    assert len({record['id'] for record in records}) == 403
    audit['mapped'] = sum(record['county'] in points for record in records)
    audit['counties'] = len(points)
    audit['measurementDates'] = sum(record['measured'] is not None for record in records)
    return records, points, audit

if __name__ == '__main__':
    records, points, audit = build(*sys.argv[1:])
    for name, data in [('georgia-champion-trees', records), ('georgia-county-points', points), ('georgia-import-audit', audit)]:
        (OUT / (name + '.json')).write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({key: value for key, value in audit.items() if key not in ('duplicateIds', 'listDetailDifferences')}))
