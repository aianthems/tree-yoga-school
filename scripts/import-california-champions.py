#!/usr/bin/env python3
"""Import Cal Poly's public California Big Trees listings.
Usage: python scripts/import-california-champions.py LISTINGS.json COUNTIES.zip
Standard library only. Reviews source fields against a redacted fixture.
"""
import csv, hashlib, io, json, sys, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
PROGRAM = 'https://californiabigtrees.calpoly.edu/'
SOURCE = 'https://www.selectree.calpoly.edu/api/bigtrees/getAllBt'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'
FIELDS = ['bt_id','accepted_scientific','common','name_unformatted','tree_county','height','circumference','crown_width','points','date_measured','state_champion','national_champion','co_champion','dead','approval_status','hidden']

def extract(path):
    return [{k:r[k] for k in FIELDS} for r in json.loads(Path(path).read_text())]

def build(source, counties):
    fixture = extract(source)
    assert fixture == json.loads((ROOT/'scripts/fixtures/california-champions-2026-10-11.json').read_text()), 'Source changed: review the listings before updating the fixture'
    assert len(fixture)==264 and len({r['bt_id'] for r in fixture})==264
    with zipfile.ZipFile(counties) as archive: content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    geography={}
    for raw in csv.DictReader(io.StringIO(content),delimiter='|'):
        r={k.strip():v.strip() for k,v in raw.items()}
        if r['USPS']=='CA': geography[r['NAME'].removesuffix(' County')]=dict(lat=float(r['INTPTLAT']),lng=float(r['INTPTLONG']))
    records=[];points={};corrections=[]
    for n,r in enumerate(fixture,1):
        assert r['approval_status']==1 and r['dead']==0
        assert any(r[k]==1 for k in ['state_champion','national_champion','co_champion'])
        county='' if r['tree_county']=='None' or not r['tree_county'] else r['tree_county']
        warnings=[]
        if county=='Toulumne':
            county='Tuolumne';corrections.append(r['bt_id'])
            warnings.append('Source county “Toulumne” is matched to Tuolumne County for approximate geography; original spelling retained.')
        if county:
            assert county in geography,county
            points[county]=geography[county]
        labels=[]
        if r['state_champion']:labels.append('State champion')
        if r['national_champion']:labels.append('National champion (source designation)')
        if r['co_champion']:labels.append('Co-champion')
        if not r['state_champion'] and not r['national_champion']:
            warnings.append('The source marks this Fremont cottonwood only as co-champion; state- and national-champion flags are both unset. No additional title is inferred.')
        measured=r['date_measured']
        if not measured or measured=='0000-00-00':measured=None
        date_note=' January 1 dates may represent year-only legacy records; exact day precision is unconfirmed.' if measured and measured.endswith('-01-01') else ''
        records.append(dict(id='ca-'+str(r['bt_id']),state='CA',sourceRow=n,sourceTreeId=str(r['bt_id']),
            sourceUrl=PROGRAM+'bt-tree-detail/'+str(r['bt_id']),scientificName=r['accepted_scientific'],commonName=r['common'],
            town='',county=county,sourceCounty=r['tree_county'] or '',location=None,measured=measured,
            circumference=r['circumference'],height=r['height'],crown=r['crown_width'],points=r['points'],
            stateChampionCode=r['state_champion'],nationalChampionCode=r['national_champion'],status=' · '.join(labels),sourceReviewNotes=warnings,
            notes='Cal Poly California Big Trees snapshot retrieved October 11, 2026. Published scientific label: '+r['name_unformatted']+'. Source accepted scientific name used for species grouping; common label and values retained. Source co-champion flag: '+str(r['co_champion'])+'. Current condition and national titles unverified. County markers do not locate trees or establish visiting permission.'+date_note))
    unmapped=[r['id'] for r in records if not r['county']]
    discrepancies=[r['id'] for r in records if abs(r['circumference']+r['height']+r['crown']/4-r['points'])>1]
    audit=dict(registerUrl=PROGRAM,dataUrl=SOURCE,geographyUrl=GEOGRAPHY,retrieved='October 11, 2026',edition=None,
        expectedRecords=len(records),mappedRecords=len(records)-len(unmapped),countyCount=len(points),unmappedIds=unmapped,
        stateChampionFlags=sum(r['state_champion'] for r in fixture),nationalChampionFlags=sum(r['national_champion'] for r in fixture),
        coChampionFlags=sum(r['co_champion'] for r in fixture),coChampionOnlyIds=[r['bt_id'] for r in fixture if r['co_champion'] and not r['state_champion'] and not r['national_champion']],
        countySpellingCorrections=corrections,scoreDiscrepancyIds=discrepancies,
        sourceHashes={Path(p).name:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in (source,counties)},
        review='All 264 distinct IDs returned by the public listing endpoint included: 263 state champion flags and one co-champion-only record. Includes 178 national and 36 co-champion flags as source labels, without deriving titles or re-ranking. Endpoint counter reports 247 listings and 181 national champions; actual listing data take precedence. All rows approved and not marked dead, which does not independently confirm current condition. No edition stated.',
        geography='Six counties are the literal string None and remain undisclosed. Two Toulumne labels matched to Tuolumne. All other published counties matched exactly to Census 2025 points. Source hidden-location flags respected: no individual coordinates imported for any record.',
        units='Circumference inches; height and average crown width feet. Published decimal measurements and scores preserved.',
        privacy='No latitude/longitude, nominator/measurer names, contact IDs, addresses, photographs or public-access permissions imported. Reviewed fixture retains only public identity, measurement, status and county fields.')
    for name,data in [('california-champion-trees.json',records),('california-county-points.json',dict(sorted(points.items()))),('california-import-audit.json',audit)]:
        (ROOT/'lib/data'/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(records=len(records),mapped=audit['mappedRecords'],counties=len(points),unmapped=unmapped,scoreDiscrepancies=discrepancies)))
if __name__=='__main__':
    if len(sys.argv)!=3:sys.exit(__doc__)
    build(sys.argv[1],sys.argv[2])
