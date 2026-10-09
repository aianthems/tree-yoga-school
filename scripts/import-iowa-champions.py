"""Import active Iowa DNR web-map champions. Offline inputs: query JSON and Census county ZIP.
Usage: python scripts/import-iowa-champions.py QUERY_JSON COUNTY_ZIP
The official web map labels Champion_Status=1 'Champion Tree' and excludes Depricated_on.
"""
import csv,hashlib,io,json,pathlib,re,sys,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
URL='https://services2.arcgis.com/r6iFVcMJeA4kB4GC/arcgis/rest/services/The_Big_Tree_Program/FeatureServer/0'
REGISTER='https://experience.arcgis.com/experience/db8a533a6ca34fc89a3df0603b6b2cb4/'
def number(v):
 if v is None or str(v).strip()=='':return None
 return float(v)
def crown(v):
 if not v:return None
 v=v.strip()
 # Retain explicit source averages, including inconsistent ones; do not repair them.
 if '=' in v:return number(v.rsplit('=',1)[1].strip())
 if v=='88, 87.5- 87.75':return 87.75
 if re.fullmatch(r'\d+(?:\.\d+)?',v):return number(v)
 # Two source crown diameters without an average remain unparsed.
 return None
def run(src,gaz):
 raw=pathlib.Path(src).read_bytes();j=json.loads(raw);assert not j.get('exceededTransferLimit');rows=[f['attributes'] for f in j['features']];records=[]
 for t in rows:
  if t['Champion_Status']!='1' or t['Depricated_on'] is not None:continue
  county=(t['County'] or '').strip();cf=number(t['Circumference__in_']);cr=t['Avg_Crown_Spread__ft_TXT'];private='private' in (t['Owner'] or '').lower()
  notes=['Iowa DNR map labels this record Champion Tree (status 1).','Source circumference: '+str(t['Circumference__in_TXT'] or cf)+' feet; converted to inches using the official web-map display unit. The service field name incorrectly says inches.','Source crown measurements: '+str(cr or 'not listed')+' feet.','Source last update: '+str(t['Last_Update'] or 'not supplied')+'. This is not a confirmed measurement date.']
  if t['Condition_of_Tree']:notes.append('Published condition: '+t['Condition_of_Tree'])
  if t['Comments']:notes.append('Published comments: '+t['Comments'])
  records.append(dict(id='ia-'+str(t['OBJECTID']),state='IA',sourceRow=t['OBJECTID'],sourceTreeId=t['Unique_Tree_Id'],commonName=t['Common_Name'],scientificName=t['Scientific_Name'],county=county,sourceCounty=t['County'] or '',town='',location=None,measured=None,circumference=None if cf is None else round(cf*12,6),height=number(t['Height__ft_']),crown=crown(cr),points=number(t['Total_Points']),status='Champion Tree · Iowa DNR map',nationalFlag='',notes=' '.join(notes),sourceUrl=URL+'/'+str(t['OBJECTID'])+'?f=pjson',mapPrecision='county',**({'publicAccess':False} if private else {})))
 assert len(records)==67
 z=zipfile.ZipFile(gaz);counties={t['county'] for t in records if t['county']};geo=csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode('utf-8-sig')),delimiter='|');points={t['NAME'].removesuffix(' County'):{'lat':float(t['INTPTLAT']),'lng':float(t['INTPTLONG'])} for t in geo if t['USPS']=='IA' and t['NAME'].removesuffix(' County') in counties};assert set(points)==counties
 audit=dict(retrieved='2026-10-09',registerUrl=REGISTER,dataUrl=URL,sourceSha256=hashlib.sha256(raw).hexdigest(),activeSourceRecords=len(rows),includedRecords=len(records),mappedRecords=sum(bool(t['county']) for t in records),mappedCounties=len(points),unmappedIds=[t['id'] for t in records if not t['county']],selection="Current web map layer, Depricated_on IS NULL; Champion_Status='1', explicitly rendered as Champion Tree. Status 2 and 3 are Big Tree runners-up. Older separate spreadsheet is not merged.",circumference='Official web-map field configuration labels Circumference__in_ as Circumference (ft). Values converted feet × 12, original text preserved. Published scores never recalculated.',crown='Explicit source averages preserved even if inconsistent. Unaveraged diameter pairs retained as text with null numeric crown.',privacy='No owner identities, contact details, addresses, directions or exact coordinates included. Explicit private ownership marked false; other access unclassified.',dates='Last update retained in notes, not treated as a measurement date. Map service data last edited July 9, 2026.',geography='2025 Census national county Gazetteer; whitespace trimmed in county names; missing county remains unmapped.')
 for n,o in [('iowa-champion-trees',records),('iowa-county-points',points),('iowa-import-audit',audit)]: (ROOT/'lib/data'/(n+'.json')).write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(audit,indent=2))
if __name__=='__main__':run(sys.argv[1],sys.argv[2])
