"""Import the species array powering Minnesota DNR's current champions page.
Usage: python3 scripts/import-minnesota-champions.py PAGE_HTML COUNTY_GAZETTEER_ZIP
"""
import csv,hashlib,io,json,pathlib,re,sys,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
URL='https://www.dnr.state.mn.us/trees/bigtree/big-tree-champions.html'
def run(page,gaz):
 text=pathlib.Path(page).read_text();species=json.loads(re.search(r'var species\s*=\s*(\[.*?\])</script>',text,re.S)[1]);assert len(species)==53
 records=[];aliases={'St Louis':'St. Louis','St.Louis':'St. Louis','Fairibault':'Faribault'}
 for s in species:
  for t in s['trees']:
   original=t['county'];county=aliases.get(original,original);own=t['ownership'].strip();identity='|'.join(str(v) for v in [s['scientific_name'],original,t['location'],t['year'],t['circumference'],t['height'],t['crown_spread']]);year=str(t['year'])
   records.append(dict(id='mn-'+hashlib.sha256(identity.encode()).hexdigest()[:16],state='MN',sourceRow=len(records)+1,scientificName=s['scientific_name'],commonName=s['name'],county=county,sourceCounty=original,town='',location=t['location'],measured=None,yearListed=year,mapPrecision='county',circumference=t['circumference'],height=t['height'],crown=t['crown_spread'],points=t['circumference']+t['height']+t['crown_spread']/4,status='Co-champion' if len(s['trees'])>1 else 'State champion',nationalFlag='National champion · Minnesota DNR label' if t['national_champion'] else '',notes='Ownership: '+own+'. Source year: '+year+' (shown beside nominator; not asserted as measurement date). Total points calculated using the official page formula.',sourceUrl=URL,**({'publicAccess':False} if own=='Private' else {})))
 assert len(records)==62 and len({r['id'] for r in records})==62
 z=zipfile.ZipFile(gaz);rows=csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode('utf-8-sig')),delimiter='|');counties={r['county'] for r in records};points={r['NAME'].removesuffix(' County'):{'lat':float(r['INTPTLAT']),'lng':float(r['INTPTLONG'])} for r in rows if r['USPS']=='MN' and r['NAME'].removesuffix(' County') in counties};assert set(points)==counties
 audit=dict(retrieved='2026-10-09',sourceUrl=URL,speciesSlots=53,populatedSpecies=51,includedRecords=62,emptySpecies=[s['name'] for s in species if not s['trees']],mappedRecords=62,mappedCounties=len(points),completeRegisterRetrieved=True,sourceSha256=hashlib.sha256(text.encode()).hexdigest(),selection='Every tree in the official current-champions species array; multiple trees in a species are labelled co-champions by the official page template. Empty species slots are excluded.',countyAliases=aliases,points='Calculated exactly as the official getTotalPoints function: circumference + height + crown_spread / 4. No ranking changes.',year='Source year appears beside the nominator; retained separately, not assumed to be a measurement date.',ownership='24 Private records marked publicAccess=false; Public, Federal and Tribal ownership do not establish public visiting permission.',omittedFields=['nominator'],geography='2025 Census national county Gazetteer; approximate county points')
 for name,obj in [('minnesota-champion-trees',records),('minnesota-county-points',points),('minnesota-import-audit',audit)]: (ROOT/'lib/data'/(name+'.json')).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
 print(len(records),'trees;',len(points),'counties;',sum(r['status']=='Co-champion' for r in records),'co-champions')
if __name__=='__main__':run(sys.argv[1],sys.argv[2])
