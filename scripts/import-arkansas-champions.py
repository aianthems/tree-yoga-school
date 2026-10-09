"""Offline import of reviewed Arkansas browser extraction (9 pages and 125 detail pages).
Usage: python scripts/import-arkansas-champions.py EXTRACT_TSV COUNTY_ZIP
TSV: post ID|source URL slug|common name|scientific name|county|access code|circ|height|crown|points|title designation.
Codes: P private, U public, L public with limited access, V private/viewable from street,
A private/access allowed, O private/public access, ? source field absent.
"""
import csv, hashlib, io, json, pathlib, sys, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
REGISTER='https://agriculture.arkansas.gov/forests/urban-community-forestry/champion-trees/search-champion-trees/'
ACCESS={'P':'Private','U':'Public','L':'Public with limited access','V':'Private, but viewable from street','A':'Private, but access allowed','O':'Private with public access','?':'Access not classified by the source'}
UNITS={'43895':"Circumference: 104'",'43904':'Circumference: 169’','43905':'Circumference: 162’','54870':"Circumference: 180'",'43984':'Crown Width: 12”'}
def run(src,gaz):
 raw=pathlib.Path(src).read_bytes();rows=list(csv.reader(io.StringIO(raw.decode()),delimiter='|'));assert len(rows)==125
 records=[]
 for index,r in enumerate(rows):
  oid,slug,common,sci,county,access,circ,height,crown,points,status=r
  notes=['Arkansas Forestry Division register, retrieved October 9, 2026. No measurement date or list edition is supplied. Published Bigness Index retained unchanged.']
  review=[]
  if oid in UNITS:
   review.append('The source displays '+UNITS[oid]+'. Its unit punctuation conflicts with the program formula. The numeric value is interpreted as '+('crown spread in feet' if oid=='43984' else 'circumference in inches')+' because that interpretation agrees with the published Bigness Index within rounding. No numeric conversion or score recalculation is applied.')
  if oid=='43900':review.append('The list card shows Maidenhair in its scientific-name field; the detail-page title explicitly supplies Ginkgo biloba, which is used here.')
  if oid in ['43881','52547']:review.append('Scientific name is taken from the detail-page title because the list card omits it.')
  if oid=='52388':review.append('Common name is taken from the detail-page title because the list card omits it.')
  if oid in ['43856','43962']:review.append('The source URL contains co-champion, while the detail-page title does not. Both the original URL and its title-based designation are preserved; no ranking is inferred.')
  if oid=='43932':review.append('The source appends a foot mark to its Bigness Index (358’). This is retained as the numeric score 358, not a length.')
  if oid=='43950':review.append('The source appends doubled inch marks to its Bigness Index (195””). This is retained as the numeric score 195, not a length.')
  t=dict(id='ar-'+oid,state='AR',sourceRow=index+1,sourcePage=index//15+1,sourceTreeId=oid,commonName=common,scientificName=sci,town='',county=county,location=None,measured=None,circumference=float(circ),height=float(height),crown=float(crown),points=float(points),status=status+' · Arkansas register',sourceUrl='https://agriculture.arkansas.gov/champion-tree/'+slug+'/',accessDetails=ACCESS[access],mapPrecision='county',notes=' '.join(notes),sourceReviewNotes=review)
  if access!='?':t['publicAccess']=access in ['U','L','A','O']
  if access=='V':t['visibleFromPublic']='yes'
  records.append(t)
 counties={t['county'] for t in records if t['county']};z=zipfile.ZipFile(gaz)
 geo=csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode('utf-8-sig')),delimiter='|')
 points={t['NAME'].removesuffix(' County'):{'lat':float(t['INTPTLAT']),'lng':float(t['INTPTLONG'])} for t in geo if t['USPS']=='AR' and t['NAME'].removesuffix(' County') in counties}
 assert set(points)==counties,counties-set(points)
 audit=dict(retrieved='2026-10-09',registerUrl=REGISTER,extractSha256=hashlib.sha256(raw).hexdigest(),sourcePages=[15]*8+[5],includedRecords=125,detailPagesReviewed=125,mappedRecords=sum(bool(t['county']) for t in records),mappedCounties=len(points),unmappedIds=[t['id'] for t in records if not t['county']],accessCounts={label:sum(r[5]==code for r in rows) for code,label in ACCESS.items()},selection='All nine register pages: 125 unique published post IDs; every detail page read. Co- and tri-champions, repeated species and unequal scores retained. Vacancies and the 133-option species filter are not tree records.',transportCheck='Reviewed extraction matched browser serialization: 125 rows, 13120 characters, FNV-1a 3687991186.',names='Source common-name casing retained, Native/Non-native/Naturalized suffixes removed. Missing names resolved from detail-page titles. Ginkgo detail title overrides erroneous card scientific field Maidenhair.',units='Program formula uses circumference inches, height feet, crown spread feet. Four circumference foot marks and one crown inch mark interpreted using the published formula and scores, with explicit per-record notes. Bigness Index punctuation stripped; scores never recalculated.',unitExceptions=UNITS,dates='No measurement dates or confirmed list edition supplied. Retrieval date is not a measurement date.',privacy='No owner identities, addresses, directions or exact tree coordinates imported. Property/access labels retained verbatim. Private viewable from street remains private.',geography='2025 Census national county Gazetteer. Eastern Cottonwood has no county on list card or detail page and remains searchable without a map point.')
 for name,obj in [('arkansas-champion-trees',records),('arkansas-county-points',points),('arkansas-import-audit',audit)]:
  (ROOT/'lib/data'/(name+'.json')).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(audit,indent=2))
if __name__=='__main__':run(*sys.argv[1:])
