"""Offline import of all six reviewed LFA table pages and Census parish points.
Usage: python scripts/import-louisiana-champions.py COUNTIES.zip
Source fixture retains all nine published fields, including excluded deceased rows.
"""
import csv, hashlib, io, json, re, sys, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://www.laforestry.com/champion-trees-in-louisiana'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'

def length(raw, inches=False):
    value = raw.strip()
    if "'" in value:
        feet, tail = value.split("'", 1)
        nums = re.findall(r'\d+(?:\.\d+)?', tail)
        result = float(feet) * 12 + (float(nums[0]) if nums else 0)
    else:
        result = float(re.findall(r'\d+(?:\.\d+)?', value)[0]) * (1 if '"' in value or inches else 12)
    return result if inches else result / 12

def run(gaz):
    path = ROOT/'scripts/fixtures/louisiana-champions-2026-10-10.json'
    rows = json.loads(path.read_text())
    assert len(rows) == 116 and all(len(r) == 9 for r in rows)
    records, excluded = [], []
    for i, r in enumerate(rows, 1):
        parish, common, national, co, new, circ, height, crown, score = r
        if parish == 'East Feliciana' and common in ['Winged Elm', 'Sassafras']:
            excluded.append({'sourceRow': i, 'values': r, 'reason': 'Reported deceased on the official register page.'})
            continue
        identity = json.dumps(r, ensure_ascii=False, separators=(',', ':'))
        notes = ['Older Louisiana Forestry Association register; page displays “2021 listing”. Later 2025 and 2026 champion announcements are absent. Current championship and survival are unverified.', 'Scientific names, measurement dates, exact tree locations and visiting access are not supplied. Only an approximate parish point is mapped.', 'Source measurements: circumference '+circ+'; height '+height+'; spread '+crown+'. Published points retained unchanged.']
        if parish == 'DeSoto': notes.append('Source DeSoto matched to Census De Soto Parish; source spelling retained.')
        spread = length(crown)
        if parish == 'Beauregard' and common == 'Tallowtree':
            spread = 71
            notes.append('Source spread is written 71 inches, but 71 feet agrees with the published score. Interpreted as 71 feet; original text retained above.')
        record = dict(id='la-'+hashlib.sha256(identity.encode()).hexdigest()[:12], state='LA', sourceRow=i, sourcePage=(i-1)//20+1, sourceUrl=SOURCE, commonName=common, scientificName='Not supplied by source', town='', county='De Soto' if parish == 'DeSoto' else parish, sourceCounty=parish, location=None, measured=None, circumference=length(circ, True), height=length(height), crown=spread, points=float(score), status=('Co-champion' if co == 'Yes' else 'Champion')+' · older Louisiana register', nationalFlag='National champion in older source; current status unverified' if national == 'Yes' else None, notes='Older register; current tree conditions unverified.', sourceReviewNotes=notes)
        records.append(record)
    assert len(records) == 115 and len(excluded) == 1
    assert len({r['id'] for r in records}) == 115
    parishes = {r['county'] for r in records}
    with zipfile.ZipFile(gaz) as z:
        content = z.read(z.namelist()[0]).decode('utf-8-sig')
    points = {}
    for raw in csv.DictReader(io.StringIO(content), delimiter='|'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        parish = r['NAME'].removesuffix(' Parish')
        if r['USPS'] == 'LA' and parish in parishes:
            points[parish] = dict(lat=float(r['INTPTLAT']), lng=float(r['INTPTLONG']))
    assert set(points) == parishes, parishes-set(points)
    audit = dict(registerUrl=SOURCE, retrieved='October 10, 2026', sourceLabel='2021 listing; exact register edition unconfirmed', sourcePages=[20,20,20,20,20,16], publishedRows=116, includedRecords=115, mappedRecords=115, parishCount=len(points), excluded=excluded, fixtureSha256=hashlib.sha256(path.read_bytes()).hexdigest(), browserTransportCheck=dict(fields=864, characters=6663, fnv1a=713304292, coverage='Pages 2–6; first 20 rows extracted from official SSR JSON'), coChampions=sum('Co-champion' in r['status'] for r in records), nationalFlags=sum(bool(r['nationalFlag']) for r in records), freshness='2025 seven new champions and 2026 Hercules Club are missing from table; do not present as current 2026 register.', deceasedNotice='Sassafras and Winged Elm in East Feliciana reported deceased. Winged Elm excluded; Sassafras already absent.', names='Source common names retained verbatim, including Catapla. Scientific names not inferred.', units='Feet/inches circumference converted to inches; height/spread to feet. Tallowtree 71-inch spread interpreted as 71 feet based on score; original wording retained. All other values and published points preserved without correction.', geographyUrl=GEOGRAPHY, privacy='No owner/contact data or individual-tree coordinates imported. Access unclassified.', laterAnnouncements=['https://www.laforestry.com/single-post/new-red-maple-champion-in-caldwell','https://www.laforestry.com/single-post/toothache-tree-added-to-champion-tree-list'])
    for name, value in [('louisiana-champion-trees',records), ('louisiana-parish-points',points), ('louisiana-import-audit',audit)]:
        (ROOT/'lib/data'/(name+'.json')).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'records':len(records),'parishes':len(points),'coChampions':audit['coChampions']}))

if __name__ == '__main__': run(sys.argv[1])
