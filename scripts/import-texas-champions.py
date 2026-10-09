#!/usr/bin/env python3
"""Import Texas's unique state/national champions from its official JSON response.
Usage: python scripts/import-texas-champions.py REGISTRY.json COUNTIES.zip
Never import source tree coordinates or private owner names.
"""
import csv,datetime,hashlib,io,json,sys,zipfile
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'lib/data'
SOURCE='https://texasforestinfo.tamu.edu/BigTreeRegistry/'
API=SOURCE+'Home/GetAllTrees'
GEOGRAPHY='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'
FIELDS=['TreeID','LatinName','AlphaSpeciesAKA','Circumference','TreeHeight','Spread','TreeIndex','StateChampion','NationalChampion','CountyName','PublicOrPrivate','Condition','NominationDateString','MeasurementDateString','CertificationDateString']
def projected(r):
    return {**{k:r[k] for k in FIELDS},'OrganizationName':r.get('OrganizationName') if r['PublicOrPrivate']==1 else None}
def month(value):
    return datetime.datetime.strptime(value,'%B %Y').strftime('%Y-%m') if value else None

def build(registry_path,counties_path):
    raw=Path(registry_path).read_bytes();geo=Path(counties_path).read_bytes();all_rows=json.loads(raw)
    assert len(all_rows)==661 and len({r['TreeID'] for r in all_rows})==661, 'Source coverage changed; review required'
    state=[r for r in all_rows if r['StateChampion'] in (1,2)]
    national=[r for r in all_rows if r['NationalChampion'] in (1,2)]
    selected=[(i,r) for i,r in enumerate(all_rows,1) if r['StateChampion'] in (1,2) or r['NationalChampion'] in (1,2)]
    overlap=len({r['TreeID'] for r in state}&{r['TreeID'] for r in national})
    assert (len(state),len(national),overlap,len(selected))==(229,54,51,232),'Champion designations changed; review required'
    reviewed=json.loads((OUT.parents[1]/'scripts/fixtures/texas-champions-2026-10-09.json').read_text())
    assert [projected(r) for _,r in selected]==reviewed,'Champion fields changed; review source before updating fixture'
    counties={}
    with zipfile.ZipFile(io.BytesIO(geo)) as z:
        text=z.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
    for row in csv.DictReader(io.StringIO(text),delimiter='|'):
        r={k.strip():v.strip() for k,v in row.items()}
        if r['USPS']=='TX':
            name=r['NAME'].removesuffix(' County')
            counties[name]={'lat':float(r['INTPTLAT']),'lng':float(r['INTPTLONG'])}
    records=[];points={};unmapped=[]
    for index,r in selected:
        county=r['CountyName'].strip();tid='tx-'+str(r['TreeID'])
        if county in counties:points[county]=counties[county]
        else:unmapped.append(tid)
        owner=r['PublicOrPrivate'];assert owner in (0,1,None)
        access='Private ownership · visiting permission not supplied' if owner==0 else 'Public ownership · confirm visiting arrangements' if owner==1 else 'Ownership and visiting access unclassified'
        state_status={1:'State champion',2:'State co-champion'}.get(r['StateChampion'],'State title not listed')
        national_status={1:'National champion',2:'National co-champion'}.get(r['NationalChampion'],'')
        condition={1:'Excellent',2:'Good',3:'Fair',4:'Declining',5:'Deceased'}.get(r['Condition'],'Not supplied')
        records.append(dict(id=tid,state='TX',sourceRow=index,sourceTreeId=str(r['TreeID']),sourceUrl=SOURCE+'Lists',
            commonName=r['AlphaSpeciesAKA'].strip(),scientificName=r['LatinName'].strip(),county=county,town='',
            location=r.get('OrganizationName') if owner==1 else None,mapPrecision='county',
            circumference=r['Circumference'],height=r['TreeHeight'],crown=r['Spread'],points=r['TreeIndex'],
            measured=month(r['MeasurementDateString']),nominated=r['NominationDateString'],certified=r['CertificationDateString'],
            status=state_status,nationalFlag=national_status,stateChampionCode=r['StateChampion'],nationalChampionCode=r['NationalChampion'],
            sourceCondition=condition,accessDetails=access,
            **({'publicAccess':False} if owner==0 else {}),
            notes='Dates retain the month/year precision displayed by the registry. Certification is not a measurement date.',
            sourceReviewNotes=['Published measurements, Tree Index and champion codes are retained. National titles and condition labels are reported by Texas; current national status and tree condition are not independently verified. County markers do not locate individual trees.']))
    audit=dict(sourceUrl=SOURCE,apiUrl=API,request={'method':'POST','body':{'species':'all'}},retrieved='October 9, 2026',
        sourceSHA256=hashlib.sha256(raw).hexdigest(),geographyUrl=GEOGRAPHY,geographySHA256=hashlib.sha256(geo).hexdigest(),
        totalRegistry=661,stateChampions=229,nationalChampions=54,overlap=51,included=232,mapped=232-len(unmapped),counties=len(points),unmapped=unmapped,
        selection='Union of StateChampion or NationalChampion code 1 (champion) or 2 (co-champion), deduplicated by TreeID. Other registry records excluded.',
        geography='Exact published county name matches to approximate Census county internal points. No tree coordinates, private owner names, or visiting permission inferred.')
    return records,points,audit
if __name__=='__main__':
    records,points,audit=build(*sys.argv[1:])
    for name,data in [('texas-champion-trees',records),('texas-county-points',points),('texas-import-audit',audit)]:
        (OUT/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:audit[k] for k in ['included','mapped','counties','overlap','unmapped']}))
