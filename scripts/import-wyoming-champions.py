#!/usr/bin/env python3
"""Import and reconcile Wyoming's official register with all individual records.
Usage: python scripts/import-wyoming-champions.py REGISTER.html DETAILS_DIR COUNTIES.zip
Published values and county labels control; measurement dates/access remain unknown.
"""
import csv,hashlib,html,io,json,re,sys,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE='https://wsfd.wyo.gov/forestry/wyoming-state-champion-tree-register/'
GEOGRAPHY='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'
def clean(s):return ' '.join(html.unescape(re.sub('<[^>]*>','',s)).split())
def listing(s):
 rows=[]
 for card in re.findall(r'<li\s+class="wsfd-ct-card"(.*?)</li>',s,re.S):
  def field(name):
   m=re.search(r'<span class="wsfd-ct-card__'+name+r'">(.*?)</span>',card,re.S);assert m,name
   return clean(m[1])
  u=re.search(r'<a class="wsfd-ct-card__link" href="([^"]+)"',card);assert u
  full=re.findall(r'<span class="wsfd-ct-card__stat-full">(.*?)</span>',card,re.S);assert len(full)==4
  vals=[clean(v).split(': ',1)[1] for v in full]
  rows.append(dict(sourceUrl=u[1],commonName=field('title'),scientificName=field('latin'),sourceCounty=field('county'),values=vals))
 assert len(rows)==57 and len({r['sourceUrl'] for r in rows})==57
 return rows
def detail(s):
 m=re.search(r'<h1 class="wsfd-page-hero__title">(.*?)</h1>',s,re.S);assert m
 sci=re.search(r'<p class="wsfd-page-hero__subtitle">\s*<em>(.*?)</em>',s,re.S);assert sci
 data={}
 for k,v in re.findall(r'<div class="wsfd-ct-single__dl-row" data-stat="([^"]+)">.*?<dd>(.*?)</dd>',s,re.S):data[k]=clean(v)
 return dict(commonName=clean(m[1]),scientificName=clean(sci[1]),sourceCounty=data['county'],values=[data[k] for k in ('circumference','height','spread','points')])
def build(register,details,geography):
 raw=Path(register).read_bytes();rows=listing(raw.decode())
 assert rows==json.loads((ROOT/'scripts/fixtures/wyoming-champions.json').read_text()),'Changed source rows require review'
 with zipfile.ZipFile(geography) as z:county_text=z.read(z.namelist()[0]).decode('utf-8-sig')
 counties={}
 for row in csv.DictReader(io.StringIO(county_text),delimiter='|'):
  r={k.strip():v.strip() for k,v in row.items()}
  if r['USPS']=='WY':counties[r['NAME']]={'lat':float(r['INTPTLAT']),'lng':float(r['INTPTLONG'])}
 records=[];points={};checks=[]
 for i,r in enumerate(rows,1):
  slug=r['sourceUrl'].rstrip('/').split('/')[-1];p=Path(details)/(slug+'.html');d=detail(p.read_text())
  assert d=={k:r[k] for k in d},('Listing/detail mismatch',slug)
  c,h,w,score=r['values'];assert c.endswith('"') and h.endswith("'") and w.endswith("'")
  numbers=[float(v.rstrip('"\'')) for v in (c,h,w,score)]
  county=r['sourceCounty'];assert county in counties
  county=county.removesuffix(' County');points[county]=counties[r['sourceCounty']]
  reviews=['Measurements and published points agree between the register card and individual record. No measurement date or public-access classification is supplied.']
  if slug=='eastern-cottonwood':reviews.append('Published circumference 497 inches, height 70 feet and crown spread 100 feet calculate to 592 points; the source lists 388 points. Both listing and detail page give these values, which remain unchanged.')
  records.append(dict(id='wy-'+slug,state='WY',sourceTreeId=slug,sourceRow=i,sourceUrl=r['sourceUrl'],commonName=r['commonName'],scientificName=r['scientificName'],sourceCounty=r['sourceCounty'],county=county,town='',location=None,measured=None,circumference=numbers[0],height=numbers[1],crown=numbers[2],points=numbers[3],status='Listed in Wyoming State Champion Tree Register',accessDetails='Visiting access unclassified',notes='Official Wyoming register retrieved October 11, 2026; edition and measurement dates are not stated. County markers are approximate and do not locate individual trees or grant visiting permission.',sourceReviewNotes=reviews))
  checks.append(dict(id='wy-'+slug,sourceUrl=r['sourceUrl'],detailSha256=hashlib.sha256(p.read_bytes()).hexdigest(),listingMatchesDetail=True))
 audit=dict(sourceUrl=SOURCE,retrieved='2026-10-11',sourceRecords=57,includedRecords=57,mappedRecords=57,countyPoints=len(points),registerSha256=hashlib.sha256(raw).hexdigest(),geographyUrl=GEOGRAPHY,geographySha256=hashlib.sha256(Path(geography).read_bytes()).hexdigest(),detailChecks=checks,measurementDatesSupplied=False,publicAccessSupplied=False)
 return records,points,audit
if __name__=='__main__':
 records,points,audit=build(*sys.argv[1:])
 for name,data in [('wyoming-champion-trees',records),('wyoming-county-points',points),('wyoming-import-audit',audit)]:
  (ROOT/'lib/data'/f'{name}.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
 print(f'{len(records)} records; {len(points)} counties; all detail pages reconciled')
