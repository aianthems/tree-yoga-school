#!/usr/bin/env python3
"""Import reviewed Utah directory detail pages and Census 2025 Utah places.
Usage: python scripts/import-utah-champions.py RAW.json PLACES.txt
RAW is an ordered snapshot of all nine public directory pages and their details.
No personal fields, addresses, photographs or individual coordinates are copied.
"""
import csv, hashlib, io, json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://utahurbanforest.org/amazing-trees/big-tree-directory'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_49.txt'
SAFE_NOTES = {'191': "'Santa Rosa' cultivar", '127': "Ulmus minor 'Alinia'", '32': 'Co-champion - South Tree', '330': 'multi-stem', '109': 'Robina x ambiigua', '289': "'Tower' cultivar", '206': 'Dixie Sweet', '301': 'co-champion', '81': 'Platanus x acerfolia', '266': 'Co-champion - North Tree', '8': 'Aesculus x carnea', '193': 'var. inermis', '35': 'Crataegus x lavallei'}
FIELDS = ['Tree ID','Common Name','Scientific Name','Location','State Champ Status','Measurement Year','Circumference','Height','Spread','Spread/4','Total Points','Public Access','National Champion','Nomination Year','New Entry/Updates']
def snapshot(raw):
    return [{'url':r['url'], **{k:r['fields'].get(k,'') for k in FIELDS}} for r in raw['records']]
def clean(v):return None if not v or v.lower() in ('undefined','null') else v
def number(v):return float(v) if clean(v) is not None else None
def build(raw_path, places_path):
    raw=json.loads(Path(raw_path).read_text()); reviewed=snapshot(raw)
    fixture=json.loads((ROOT/'scripts/fixtures/utah-champions.json').read_text())
    assert reviewed==fixture, 'Source records changed; review labels, measurements and geography before refreshing'
    assert [len(p['links']) for p in raw['pages']]==[30]*8+[10]
    assert [u for p in raw['pages'] for u in p['links']]==[r['url'] for r in raw['records']]
    assert len(set(r['Tree ID'] for r in reviewed))==len(reviewed)==250
    places={}; ambiguous=set()
    geography=Path(places_path).read_bytes()
    for row in csv.DictReader(io.StringIO(geography.decode('utf-8-sig')),delimiter='|'):
        r={k.strip():v.strip() for k,v in row.items()};assert r['USPS']=='UT'
        name=re.sub(r' (city|town|CDP)$','',r['NAME'])
        key=name.casefold()
        if key in places or key in ambiguous:
            places.pop(key,None);ambiguous.add(key)
        else:places[key]={'lat':float(r['INTPTLAT']),'lng':float(r['INTPTLONG'])}
    records=[];points={};excluded=[];matches=[]
    for index,(r,original) in enumerate(zip(reviewed,raw['records']),1):
        if r['State Champ Status']!='1':
            excluded.append({'sourceTreeId':r['Tree ID'],'status':r['State Champ Status']});continue
        town=r['Location'];map_town=town
        # The source explicitly names Provo and its university, so use the city point.
        if town=='Provo - Brigham Young University':map_town='Provo'
        if town=='Ogden, Utah':map_town='Ogden'
        mapped=map_town.casefold() in places
        if mapped:points[map_town]=places[map_town.casefold()]
        if r['Tree ID'] in SAFE_NOTES:assert original['fields']['Special Notes']==SAFE_NOTES[r['Tree ID']]
        reviews=['State Champ Status: 1, as published. Multiple designated records are retained; no co-champion title is inferred from scores.']
        if map_town != town:reviews.append(f'Published location: {town}; marker uses its explicitly named city, {map_town}.')
        if r['Tree ID'] in SAFE_NOTES:reviews.append('Published special notes: '+SAFE_NOTES[r['Tree ID']])
        if mapped:reviews.append('Marker is an approximate Census place point, not the individual tree location.')
        else:reviews.append('No unambiguous Census place match; retained without a map marker.')
        access=clean(r['Public Access']);assert access in ('Yes','No','Y','N',None), access
        national=clean(r['National Champion']);assert national in ('Yes','No','Y','N',None),national
        measured=clean(r['Measurement Year']);assert measured is None or re.fullmatch(r'\d{4}',measured)
        vals={k:number(r[v]) for k,v in [('circumference','Circumference'),('height','Height'),('crown','Spread'),('points','Total Points')]}
        update=clean(r['New Entry/Updates'])
        if update:reviews.append(f'Published entry/update field: {update}; this is not the measurement date.')
        rec=dict(id='ut-'+r['Tree ID'],state='UT',sourceTreeId=r['Tree ID'],sourceRow=index,sourceUrl=r['url'],
            commonName=r['Common Name'],scientificName=r['Scientific Name'],town=town,mapTown=map_town,county='',location=None,
            measured=measured,nominated=clean(r['Nomination Year']),stateChampionCode=1,status='State champion · source also labels co-champion' if 'co-champion' in SAFE_NOTES.get(r['Tree ID'],'').lower() else 'State champion · Utah directory',
            accessDetails='Public access listed by Utah' if access in ('Yes','Y') else 'No public access · Utah directory' if access in ('No','N') else 'Visiting access unclassified',
            nationalFlag='National champion flag in Utah directory; current national standing unverified' if national in ('Yes','Y') else '',
            notes='Directory snapshot retrieved October 11, 2026. Measurement years retain their original precision. Personal fields, addresses, photographs and individual tree coordinates are omitted. Consult the official record for current visiting guidance.',
            sourceReviewNotes=reviews,**vals)
        if access is not None:rec['publicAccess']=access in ('Yes','Y')
        records.append(rec)
        matches.append(dict(id=rec['id'],sourceLocation=town,mapPlace=map_town if mapped else None,detailSha256=original['sha256']))
    audit=dict(sourceUrl=SOURCE,retrieved='2026-10-11',directoryRecords=len(reviewed),includedRecords=len(records),excluded=excluded,
        mappedRecords=sum(r['mapTown'] in points for r in records),unmappedIds=[r['id'] for r in records if r['mapTown'] not in points],
        publicAccessRecords=sum(r.get('publicAccess') is True for r in records),noPublicAccessRecords=sum(r.get('publicAccess') is False for r in records),
        nationalFlagRecords=sum(bool(r['nationalFlag']) for r in records),geographyUrl=GEOGRAPHY,geographySha256=hashlib.sha256(geography).hexdigest(),
        directoryPages=[{k:p[k] for k in ('url','sha256')} for p in raw['pages']],reconciliation=matches)
    return records,points,audit
if __name__=='__main__':
    records,points,audit=build(*sys.argv[1:])
    for name,data in [('utah-champion-trees',records),('utah-place-points',points),('utah-import-audit',audit)]:
        (ROOT/'lib/data'/f'{name}.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
    print(json.dumps({k:v for k,v in audit.items() if k in ('directoryRecords','includedRecords','mappedRecords','unmappedIds','publicAccessRecords','noPublicAccessRecords','nationalFlagRecords','excluded')},indent=2))
