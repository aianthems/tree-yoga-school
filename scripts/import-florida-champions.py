#!/usr/bin/env python3
"""Import Florida's complete HTML register and 2025 Census county ZIP.
Usage: python scripts/import-florida-champions.py REGISTER.html COUNTIES.zip
Requires lxml. Retains source names and scores; no inferred public access.
"""
import csv, hashlib, io, json, sys, zipfile
from collections import Counter
from pathlib import Path
from lxml import html
OUT=Path(__file__).resolve().parents[1]/'lib/data'
SOURCE='https://ffs.fdacs.gov/ChampionTrees/home.mvc/Index'
INCLUDED={'Florida Champion','Florida Co-Champion','National Champion','National Co-Champion'}
def build(register, county_zip):
 doc=html.fromstring(Path(register).read_bytes())
 tables=[t for t in doc.xpath('//table') if [c.text_content().strip() for c in t.xpath('.//tr[1]/th')] == ['PK','Common Name','Scientific Name','Title','Status','Total Points','Crown Spread','Height','Circumference','County']]
 assert len(tables)==1,'Register structure changed'
 rows=[[ ' '.join(c.text_content().split()) for c in r.xpath('./td')] for r in tables[0].xpath('.//tr')[1:]]
 assert len(rows)==600,'Source count changed; review import'
 with zipfile.ZipFile(county_zip) as z:text=z.read('2025_Gaz_counties_national.txt').decode('utf-8-sig')
 counties={}
 for raw in csv.DictReader(io.StringIO(text),delimiter='|' if '|' in text.splitlines()[0] else '\t'):
  r={k.strip():v.strip() for k,v in raw.items()}
  if r['USPS']=='FL':counties[r['NAME'].removesuffix(' County')]={'lat':float(r['INTPTLAT']),'lng':float(r['INTPTLONG'])}
 assert len(counties)==67
 records=[];points={};excluded=[];seen={};duplicates=[]
 for rownum,c in enumerate(rows,1):
  assert len(c)==10,c
  pk,common,scientific,title,status,score,crown,height,circumference,county=c
  if title not in INCLUDED:
   excluded.append({'sourceTreeId':pk,'designation':title});continue
  if pk in seen:
   assert seen[pk]==c,'Conflicting duplicate tree ID'
   duplicates.append({'sourceRow':rownum,'sourceTreeId':pk});continue
  seen[pk]=c
  assert status=='COMPLETE' and county in counties,c
  records.append(dict(id='fl-'+pk,state='FL',sourceRow=rownum,sourceTreeId=pk,commonName=common,scientificName=scientific,status=title,
   county=county,town='',location=None,measured=None,mapPrecision='county',sourceUrl='https://ffs.fdacs.gov/ChampionTrees/Home.mvc/Detail/'+pk,
   circumference=float(circumference),height=float(height),crown=float(crown),points=float(score),notes=None))
  if all(records[-1][k]==0 for k in ['circumference','height','crown','points']):
   records[-1]['sourceReviewNotes']=['The summary retains a champion designation but reports zero for all measurements and points. Values are preserved as published; confirm current status with Florida Forest Service.']
  points[county]=counties[county]
 assert len(records)==311 and len({r['id'] for r in records})==311
 audit=dict(sourceUrl=SOURCE,retrieved='October 8, 2026',sourceSha256=hashlib.sha256(Path(register).read_bytes()).hexdigest(),sourceRows=len(rows),included=len(records),counties=len(points),designations=dict(Counter(r['status'] for r in records)),excludedRows=excluded,duplicateRows=duplicates,
  policy='Include only Florida Champion, Florida Co-Champion, National Champion and National Co-Champion. Exclude challengers, emeritus, discontinued, nominees and unknown designations. National labels are Florida source designations, not independently verified.',
  geography='2025 Census county internal points. County markers are approximate and do not locate individual trees.',
  fields='Summary-table import: measurement dates, property ownership and individual tree coordinates are not imported. Visiting access remains unclassified; see each linked official record.')
 return records,points,audit
if __name__=='__main__':
 records,points,audit=build(*sys.argv[1:])
 for name,data in [('florida-champion-trees',records),('florida-county-points',points),('florida-import-audit',audit)]:
  (OUT/(name+'.json')).write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
 print(json.dumps({k:v for k,v in audit.items() if k!='excludedRows'}))
