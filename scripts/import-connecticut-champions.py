"""Import CT champions from saved common/scientific lists, detail pages and Census data.
Usage: python3 scripts/import-connecticut-champions.py COMMON.html SCIENTIFIC.html DETAILS_DIR GAZETTEER.txt
Or: python3 scripts/import-connecticut-champions.py --download NEW_SNAPSHOT_DIRECTORY
Cached inputs are reused; use a new directory for a fresh snapshot.
Source HTML uses ISO-8859-1. Only explicit CT champion/co-champion rows qualify.
"""
import csv
import datetime
import html
import json
import re
import sys
import concurrent.futures
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://oak.conncoll.edu/notabletrees/'
REGIONS = dict(zip(range(110,200,10), ['Capitol','Greater Bridgeport','Lower Connecticut River Valley','Naugatuck Valley','Northeastern Connecticut','Northwest Hills','South Central Connecticut','Southeastern Connecticut','Western Connecticut']))

def clean(value):
    value = re.sub(r'<div class="mobilesub">.*?</div>', '', value, flags=re.S)
    value = re.sub(r'<br\s*/?>', ', ', value)
    return ' '.join(html.unescape(re.sub('<[^>]*>', '', value)).split())

def parse_list(path):
    source = Path(path).read_text(encoding='latin1')
    records = {}
    for row in re.findall(r'<tr class="trlink".*?</tr>', source, re.S):
        id = int(re.search(r'selected=(\d+)', row)[1])
        cells = re.findall(r'<td\b[^>]*>(.*?)</td>', row, re.S)
        assert len(cells) == 9
        statuses = re.findall(r'title="(Connecticut (?:Co-)?Champion)"', cells[1])
        assert len(statuses) == 1, id
        assert id not in records
        records[id] = dict(name=clean(cells[3]), points=float(clean(cells[4])), circumference=float(clean(cells[5])), height=float(clean(cells[6])), crown=float(clean(cells[7])), town=clean(cells[8]), status=statuses[0])
    assert len(records) == 504, 'Review changed champion count'
    return records

def parse_detail(path):
    text = path.read_text(encoding='latin1')
    pairs = re.findall(r"<td class='treedatalabelcell'[^>]*>(.*?)</td>\s*<td class='treedatadatacell'[^>]*>(.*?)</td>", text, re.S)
    result = {clean(k).rstrip(':'): clean(v) for k,v in pairs}
    assert 'ID' in result and 'Scientific Name' in result, path
    return result

def download_sources(directory):
    cache = Path(directory)
    cache.mkdir(parents=True, exist_ok=True)
    details = cache/'details'
    details.mkdir(exist_ok=True)
    def download(url, path):
        if not path.exists():
            with urllib.request.urlopen(url, timeout=40) as response:
                data = response.read()
            path.write_bytes(data)
    common = cache/'common.html'
    scientific = cache/'scientific.html'
    geography = cache/'geography.txt'
    download(BASE+'ChampsByCommonName.jsp', common)
    download(BASE+'ChampsByScientificName.jsp', scientific)
    download('https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_cousubs_09.txt', geography)
    ids = parse_list(common)
    def detail(id):
        download(BASE+f'ViewTreeData.jsp?selected={id}', details/f'{id}.html')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(detail, ids))
    return [str(common), str(scientific), str(details), str(geography)]

def main():
    if len(sys.argv) == 3 and sys.argv[1] == '--download':
        sys.argv[1:] = download_sources(sys.argv[2])
    common, scientific = parse_list(sys.argv[1]), parse_list(sys.argv[2])
    assert common.keys() == scientific.keys()
    gaz = list(csv.DictReader(Path(sys.argv[4]).open(), delimiter='|'))
    records, points = [], {}
    for id, c in common.items():
        s = scientific[id]
        assert {k:v for k,v in c.items() if k!='name'} == {k:v for k,v in s.items() if k!='name'}, id
        d = parse_detail(Path(sys.argv[3])/f'{id}.html')
        assert int(d['ID']) == id and d['Scientific Name'] == s['name'] and d['Town'] == c['town'], (id,d,c,s)
        for field, detail in [('points','Points'),('circumference','Circumference'),('height','Height'),('crown','Average Spread')]:
            assert float(d[detail].split()[0]) == c[field], (id,field,d[detail],c[field])
        assert ('Connecticut co-champion' if c['status']=='Connecticut Co-Champion' else 'Connecticut champion') in d['Notes'], (id,d['Notes'])
        matches = [g for g in gaz if g['NAME'] in (c['town']+' town', c['town']+' city')]
        assert len(matches) == 1, (c['town'],matches)
        g=matches[0]
        point=dict(lat=float(g['INTPTLAT']),lng=float(g['INTPTLONG']),geoid=g['GEOID'])
        assert 40.9 < point['lat'] < 42.1 and -73.8 < point['lng'] < -71.7
        points[c['town']]=point
        measured = None
        if 'Measured by' in d:
            dates = re.findall(r'\((\w+ \d{1,2}, \d{4})\)',d['Measured by'])
            assert len(dates)<=1, (id,d['Measured by'])
            if dates:
                measured=datetime.datetime.strptime(dates[0],'%b %d, %Y').date().isoformat()
            else:
                assert not re.search(r'\d', d['Measured by']), (id, d['Measured by'])
        record=dict(id=f'ct-{id}',state='CT',sourceRow=id,scientificName=s['name'],commonName=d['Common Name'],town=c['town'],county=REGIONS[int(g['GEOID'][2:5])],measured=measured,location=d.get('Tree Address') or None,status=c['status'],sourceUrl=BASE+f'ViewTreeData.jsp?selected={id}',notes=' '.join(([('Named tree: '+d[''])] if d.get('') else []) + ([('Common-name list label: '+c['name']+'.')] if c['name'] != d['Common Name'] else [])) or None)
        record.update({k:c[k] for k in ('points','circumference','height','crown')})
        # Publication of a location is not an access classification. No coordinates inferred or copied.
        records.append(record)
    assert sum(r['status']=='Connecticut Co-Champion' for r in records)==104
    for filename,data in [('connecticut-champion-trees.json',records),('connecticut-town-points.json',dict(sorted(points.items())))]:
        (ROOT/'lib/data'/filename).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
    print(f'{len(records)} champions at {len(points)} municipalities; {sum(bool(r["location"]) for r in records)} published addresses; {sum(bool(r["measured"]) for r in records)} measurement dates.')

if __name__=='__main__':main()
