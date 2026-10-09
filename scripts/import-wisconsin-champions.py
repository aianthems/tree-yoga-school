"""Import both public views behind Wisconsin DNR's official Champion Tree map.
Usage: python3 scripts/import-wisconsin-champions.py /path/to/2025_Gaz_counties_national.zip
Only public register fields are queried; geometry, names of owners, and GPS are omitted.
"""
import csv,datetime,hashlib,io,json,pathlib,sys,urllib.parse,urllib.request,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE='https://services5.arcgis.com/Ul9AyFFeFTjf08DW/arcgis/rest/services/'
LAYERS=[('pub','CT_Nomination_PUB_TREE_MAP_View',"Map_Display = 'Exact location'",47),('pvt','CT_Nomination_PVT_TREE_MAP_TWN_View',"Map_Display = 'Township'",10)]
FIELDS='globalid,county,privateProperty,commonName_verified,trunkCircumference_verified,verticalHeight_verified,diameter_verified,diameter2_verified,calcPoints_verified,genus_verified,species_verified,Map_Display,PLSS_TWN'
def query(url,**params):
 with urllib.request.urlopen(url+'?'+urllib.parse.urlencode({'f':'json',**params})) as response: data=json.load(response)
 if 'error' in data: raise ValueError(data['error'])
 return data
def write(name,obj): (ROOT/'lib/data'/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def run(gazetteer,cache=None):
 records=[];layers=[]
 for kind,name,where,expected in LAYERS:
  url=BASE+name+'/FeatureServer/0';oid='objectid' if kind=='pub' else 'OBJECTID'
  if cache:
   payload=json.load(open(str(cache)+'/wi-'+kind+'-rows.json'));meta=json.load(open(str(cache)+'/wi-'+kind+'-meta.json'));count=expected
  else:
   count=query(url+'/query',where=where,returnCountOnly='true')['count'];meta=query(url)
   payload=query(url+'/query',where=where,outFields=FIELDS+','+oid,returnGeometry='false',orderByFields=oid)
  assert count==expected, 'Register count changed; review before updating'
  assert len(payload['features'])==count and not payload.get('exceededTransferLimit')
  attrs=[f['attributes'] for f in payload['features']]
  layers.append(dict(url=url,filter=where,count=count,dataLastEditDate=meta['editingInfo']['dataLastEditDate'],fields=FIELDS+','+oid,sha256=hashlib.sha256(json.dumps(attrs,sort_keys=True).encode()).hexdigest()))
  for a in attrs:
   assert a['Map_Display'].lower()==('exact location' if kind=='pub' else 'township')
   county=a['county'].strip() if a['county']!='milwaukee' else 'Milwaukee';private=(a['privateProperty'] or '').lower();d1=a['diameter_verified'];d2=a['diameter2_verified']
   records.append(dict(id='wi-'+a['globalid'].lower(),state='WI',sourceRow=a[oid],sourceTreeId=a['globalid'],scientificName=' '.join((a['genus_verified']+' '+a['species_verified']).split()),commonName=a['commonName_verified'],county=county,sourceCounty=a['county'],town='',location=None,measured=None,mapPrecision='county',circumference=a['trunkCircumference_verified'],height=a['verticalHeight_verified'],crown=(d1+d2)/2 if d1 is not None and d2 is not None else None,points=a['calcPoints_verified'],notes=f"DNR map display: {a['Map_Display']}. Crown diameters: {d1} and {d2} ft; average follows the official map. Private property: {a['privateProperty'] or 'not supplied'}.",status='Wisconsin DNR champion map',sourceUrl=url+'/'+str(a[oid]),**({'publicAccess':False} if private=='yes' else {})))
 assert len(records)==57 and len({r['id'] for r in records})==57
 z=zipfile.ZipFile(gazetteer);rows=csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode('utf-8-sig')),delimiter='|');counties={r['county'] for r in records};points={r['NAME'].removesuffix(' County'):{'lat':float(r['INTPTLAT']),'lng':float(r['INTPTLONG'])} for r in rows if r['USPS']=='WI' and r['NAME'].removesuffix(' County') in counties};assert set(points)==counties
 audit=dict(retrieved='2026-10-09',programUrl='https://dnr.wisconsin.gov/topic/forests/championtrees',tableUrl='https://experience.arcgis.com/experience/0f303a8067c1493aa62eb764375f64fe',mapUrl='https://experience.arcgis.com/experience/3baffe32b8c246dc8848bde36e583d73',webMap='ffca45f2133140ef99e718681d424ed5',layers=layers,includedRecords=57,mappedRecords=57,mappedCounties=len(points),privatePropertyRecords=sum(r.get('publicAccess') is False for r in records),unclassifiedAccessRecords=sum('publicAccess' not in r for r in records),completePublicRegisterRetrieved=True,selection='Every record from both official champion map layers using their published filters. Repeated botanical names remain separate. No score-based selection.',crownCalculation='Average(diameter_verified,diameter2_verified), matching the official web-map popup. Circumference in inches; height and crown width in feet.',countyNormalization={'milwaukee':'Milwaukee'},programStatus='DNR reports staffing-related pause; nominations and information requests are not currently answered.',omittedFields=['geometry','latitude','longitude','ownerFirstName','ownerLastName','treeAccess','historicalFacts'],geography='2025 Census national county Gazetteer; approximate county markers',access='Private-property yes maps to publicAccess=false; no or blank stays unclassified. Exact-location sharing does not establish visiting permission.')
 write('wisconsin-champion-trees.json',records);write('wisconsin-county-points.json',points);write('wisconsin-import-audit.json',audit)
 print(len(records),'records;',len(points),'counties')
if __name__=='__main__': run(sys.argv[1])
