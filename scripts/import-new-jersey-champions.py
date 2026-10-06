"""Import a dated NJDEP public champion snapshot.
Usage: python scripts/import-new-jersey-champions.py source.json nj-cousubs.txt counties.txt
Source query selects PERMISSIONTOLIST=YES and four champion statuses, no geometry.
"""
import collections,csv,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
STATUSES={'Champion','Co-Champion','Heritage_Champion','National_Champion'}
BASE='https://services1.arcgis.com/QWdNfRs7lkPq4g4Q/arcgis/rest/services/NJDEP_Big_and_Heritage_Trees_in_New_Jersey/FeatureServer/19'
def clean(v): return ' '.join(str(v or '').split())
def norm(v): return re.sub(r'\s+(borough|city|township|town)$','',v.lower()).strip()
source=json.load(open(sys.argv[1]));assert not source.get('exceededTransferLimit')
counties={r['GEOID']:r for r in csv.DictReader(open(sys.argv[3]),delimiter='|') if r['USPS']=='NJ'}
bycounty={r['NAME'].removesuffix(' County'):r for r in counties.values()}
towns=collections.defaultdict(list)
for r in csv.DictReader(open(sys.argv[2]),delimiter='|'):
 if r['NAME']=='County subdivisions not defined':continue
 county=counties[r['GEOID'][:5]]['NAME'].removesuffix(' County')
 towns[(norm(r['NAME']),county)].append(r)
records=[];points={}
for f in source['features']:
 a=f['attributes'];assert a['STATUS'] in STATUSES and a['PERMISSIONTOLIST']=='YES'
 town,county=clean(a['MUNICIPALITY']),clean(a['COUNTY']); candidates=towns[(norm(town),county)]
 # Preserve source spelling; never infer a municipality from an ambiguous name.
 exact=[r for r in candidates if r['NAME'].lower()==town.lower()]
 if exact:candidates=exact
 mapped=candidates[0] if len(candidates)==1 else None
 notes=[]
 if a['LOCALNAME']:notes.append('Local name: '+clean(a['LOCALNAME'])+'.')
 notes.append('Published ranking: '+str(a['RANKING'])+'. Original status: '+a['STATUS']+'.')
 if not mapped:notes.append('Published municipality: '+town+'. Municipality could not be matched unambiguously within the published county; marker uses the county representative point.')
 oid=a['OBJECTID'];r=dict(id=f'nj-{oid}',state='NJ',sourceRow=oid,scientificName=clean(a['BOTANICALNAME']).replace('_',' '),commonName=clean(a['COMMONNAME']),location=clean(a['STREETADDRESS']) or None,town=town,county=county,measured=None,circumference=a['CIRCUMFERENCE'],height=a['HEIGHT'],crown=a['CROWNAVG'],crownUnitUncertain=True,points=a['POINT'],notes=' '.join(notes),status=a['STATUS'].replace('_',' '),sourceUrl=f'{BASE}/{oid}?f=pjson')
 if mapped:
  r['mapTown']=mapped['NAME'];key=mapped['NAME'];geo=mapped
 else:
  r['mapPrecision']='county';key='county:'+county;geo=bycounty[county]
 points[key]={'lat':float(geo['INTPTLAT']),'lng':float(geo['INTPTLONG'])}
 records.append(r)
assert len(records)==206 and len({r['id'] for r in records})==206
for name,data in [('new-jersey-champion-trees.json',records),('new-jersey-place-points.json',points)]:
 (ROOT/'lib/data'/name).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
print('records',len(records),'places',len(points),'county-level records',sum(r.get('mapPrecision')=='county' for r in records),'county points',sum(k.startswith('county:') for k in points))
