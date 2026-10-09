"""Import MDC register records without deriving current champions or exposing private locations.
Usage: python scripts/import-missouri-champions.py QUERY_JSON LAYER_JSON COUNTY_ZIP
"""
import csv, hashlib, io, json, pathlib, sys, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[1]
URL = 'https://gisblue.mdc.mo.gov/arcgis/rest/services/Land_Cover/Champion_Trees_List/MapServer/0'
def run(src, layer, gaz):
 raw = pathlib.Path(src).read_bytes(); data = json.loads(raw)
 assert not data.get('exceededTransferLimit') and 'features' in data
 fields = json.loads(pathlib.Path(layer).read_text())['fields']
 names = {v['code']: v['name'] for f in fields if f['name'] == 'Species' for v in f['domain']['codedValues']}
 records = []
 for feature in data['features']:
  t = feature['attributes']; access = t['Public_Access']; county = t['County'].strip()
  county = {'St_Louis': 'St. Louis'}.get(county, county)
  records.append(dict(id='mo-'+str(t['OBJECTID']), state='MO', sourceRow=t['OBJECTID'],
   scientificName=t['Species'], commonName=names.get(t['Species'], 'Common name not listed'),
   county=county, sourceCounty=t['County'], town='', location=t['Public_Loc'] if access=='YES' else None,
   measured=None, circumference=t['Circumference'], height=t['Height'], crown=t['Spread'], points=t['MO_Points'],
   status='Missouri Champion Tree Register record', publicAccess=access=='YES',
   accessDetails='Public access listed by MDC' if access=='YES' else 'No public access listed by MDC',
   nationalFlag='National champion · MDC designation' if t['National_Champ']=='YES' else '',
   sourceUrl=URL+'/'+str(t['OBJECTID'])+'?f=pjson', mapPrecision='county',
   notes='MDC includes trees that are, or were, qualified champions. Current title and condition are unconfirmed. Measurement dates and latest record-update date are not supplied. Published measurements and scores are retained unchanged.'))
 assert len(records)==151 and len({r['id'] for r in records})==151
 z=zipfile.ZipFile(gaz); counties={r['county'] for r in records}
 geo=csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode('utf-8-sig')), delimiter='|')
 points={}
 for t in geo:
  if t['USPS']!='MO': continue
  name=t['NAME'].removesuffix(' County').replace(' city', ' City')
  if name in counties: points[name]={'lat':float(t['INTPTLAT']), 'lng':float(t['INTPTLONG'])}
 assert set(points)==counties, counties-set(points)
 audit=dict(retrieved='2026-10-09', dataUrl=URL, sourceSha256=hashlib.sha256(raw).hexdigest(),
  layerSha256=hashlib.sha256(pathlib.Path(layer).read_bytes()).hexdigest(), sourceRecords=len(data['features']),
  includedRecords=len(records), mappedRecords=len(records), mappedCounties=len(points), publicAccessRecords=sum(r['publicAccess'] for r in records),
  selection='All MDC Champion Trees layer records retained, including repeated species. No derived ranking or current-title assumption.',
  names='Common names use the official Species coded-value domain. Sideroxylon lanuginosum has no domain entry and retains its scientific name with Common name not listed.',
  units='Circumference in inches; height and average crown spread in feet, following MDC measuring guidance. Published scores never recalculated.',
  measuringUrl='https://mdc.mo.gov/magazines/xplor/2021-09/big-tree-hunters',
  dates='Service metadata created December 2, 2021; this is not a list edition or record-update date. No measurement or latest record-update dates supplied.',
  privacy='County/city points only; public site labels retained only for YES access. Personal owner names, private location labels and exact tree coordinates excluded.',
  geography='2025 Census national county Gazetteer. County whitespace trimmed; St_Louis normalized to St. Louis. St. Louis City retained separately from St. Louis County.')
 for name, obj in [('missouri-champion-trees', records), ('missouri-county-points', points), ('missouri-import-audit', audit)]:
  (ROOT/'lib/data'/(name+'.json')).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(audit,indent=2))
if __name__=='__main__': run(*sys.argv[1:])
