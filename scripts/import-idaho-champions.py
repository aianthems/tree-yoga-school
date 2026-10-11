#!/usr/bin/env python3
"""Import Idaho's June 13, 2019 register; exclude national comparison rows.
Usage: python scripts/import-idaho-champions.py REGISTER.pdf COUNTIES.zip
Requires pdfplumber. The reviewed fixture omits personal names and locations.
"""
import csv, hashlib, io, json, re, sys, zipfile
from collections import defaultdict, Counter
from pathlib import Path
import pdfplumber
ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://sites.stat.washington.edu/jaw/CAW/june-2019-id-registry-big-trees.pdf'
PROGRAM = 'https://www.uidaho.edu/extension/natural-resources/forestry/big-tree'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'

def source_county(location, county_names):
    matches=[name for name in [*county_names, 'Adam'] if re.search(r'\b'+re.escape(name)+r',?\s+Co\.',location)]
    assert len(matches)==1, ('Unresolved source county',matches)
    return matches[0]

def geography(path):
    with zipfile.ZipFile(path) as archive:
        content=archive.read(archive.namelist()[0]).decode('utf-8-sig')
    result={}
    for raw in csv.DictReader(io.StringIO(content),delimiter='|'):
        r={k.strip():v.strip() for k,v in raw.items()}
        if r['USPS']=='ID':result[r['NAME'].removesuffix(' County')]=dict(lat=float(r['INTPTLAT']),lng=float(r['INTPTLONG']))
    return result

def extract(register, county_names):
    rows=[]
    with pdfplumber.open(register) as p:
        for page_no,page in enumerate(p.pages[1:],2):
         ws=page.extract_words(extra_attrs=['fontname']); ws=[w for w in ws if w['top']<580]
         first=[w for w in ws if 40<=w['x0']<145];lines=defaultdict(list)
         for w in first:lines[round(w['top'],1)].append(w)
         heads=[]
         for top,line in sorted(lines.items()):
          line=sorted(line,key=lambda w:w['x0']);text=' '.join(w['text'] for w in line)
          if 'Italic' in line[0]['fontname'] and re.match(r'[A-Z][a-z]+\b',text) and not text.startswith('SCIENTIFIC'):heads.append((top,text))
         anchors=[w for w in ws if 145<=w['x0']<200 and w['text'] in ('STATE','NATIONAL')]
         for rowno,a in enumerate([w for w in anchors if w['text']=='STATE'],1):
          head=max((h for h in heads if h[0]<=a['top']+1),default=None)
          if not head:raise Exception(('head',page_no,a))
          endhead=min((h[0] for h in heads if h[0]>head[0]),default=580)
          namews=[w for w in first if head[0]-.2<=w['top']<endhead-1];science=[w for w in namews if 'Italic' in w['fontname'] or w['text'] in ('var.','var','ssp.','spp.','ssp','spp','X','x','.')];common=[w for w in namews if w not in science]
          science=' '.join(w['text'] for w in science).replace('var .','var.').replace('ssp .','ssp.').replace('spp .','spp.');common=' '.join(w['text'] for w in common)
          nexta=min((w['top'] for w in anchors if w['top']>a['top']+2 and not (w['text']=='NATIONAL' and any(145<=v['x0']<200 and v['text']=='&' and abs(v['top']-a['top'])<2 for v in ws) and not any(200<=v['x0']<430 and abs(v['top']-w['top'])<3 for v in ws))),default=endhead)
          note=min((w['top'] for w in ws if w['text']=='NOTE:' and w['top']>a['top']+2),default=endhead)
          bottom=min(nexta,endhead,note)
          def cell(lo,hi):
           return ' '.join(w['text'] for w in ws if lo<=w['x0']<hi and a['top']-1<=w['top']<bottom-1)
          nums=[]
          for lo,hi in [(200,255),(255,305),(305,345),(345,395),(395,435)]:
           nums.append(' '.join(w['text'] for w in ws if lo<=w['x0']<hi and a['top']-2<=w['top']<bottom-2))
          loc=cell(435,610); nom=cell(610,780)
          # Stop location at unrelated full-width notes (not in this column).
          rows.append(dict(page=page_no,row=rowno,scientificName=science,commonName=common,status=cell(145,200),measurements=nums,sourceCounty=source_county(loc, county_names),nominationYears=re.findall(r'\b(?:19|20)\d{2}\b',nom)))
    return rows

def number(value):
    match=re.fullmatch(r'(\d+(?:\.\d+)?)["”\'’]?',value)
    assert match, ('Unexpected measurement',value)
    return float(match[1]) if '.' in match[1] else int(match[1])

def build(register, counties):
    geography_points=geography(counties)
    fixture=extract(register,list(geography_points))
    reviewed=json.loads((ROOT/'scripts/fixtures/idaho-champions-2019.json').read_text())
    assert fixture==reviewed, 'Source changed; review every source row before refreshing'
    assert len(fixture)==121 and len(set(r['scientificName'] for r in fixture))==117
    records=[];points={}
    for f in fixture:
        diameter,circ,height,quarter,score=map(number,f['measurements'])
        county='Adams' if f['sourceCounty']=='Adam' else f['sourceCounty']
        points[county]=geography_points[county]
        assert len(f['nominationYears'])==1
        warnings=[]
        if f['sourceCounty']=='Adam':warnings.append('Published county “Adam” is matched to Census Adams County; the source spelling is retained.')
        if f['scientificName']=='Salix alba var. tristis':warnings.append('The source lists Cambridge in Idaho County, while another Cambridge entry lists Washington County. The published Idaho County is retained; this location needs confirmation.')
        notes=['June 13, 2019 register; current condition, title and visiting access are unverified.', 'Published quarter-average crown spread: '+str(quarter)+' feet; full average spread is shown as four times that value.', 'The source year is a nomination year, not a measurement date.']
        if 'NATIONAL' in f['status']:notes.append('National co-champion is a historical designation in this 2019 source, not a verified current title.')
        records.append(dict(id=f"id-p{f['page']}-r{f['row']}",state='ID',sourcePage=f['page'],sourceRow=f['row'],sourceUrl=SOURCE+'#page='+str(f['page']),sourceCounty=f['sourceCounty'],scientificName=f['scientificName'],commonName=f['commonName'],town='',county=county,location=None,measured=None,nominated=f['nominationYears'][0],diameter=diameter,circumference=circ,height=height,crown=quarter*4,crownPoints=quarter,points=score,status='Idaho '+('co-champion' if 'Co-Champ' in f['status'] else 'champion')+' · 2019 register',nationalFlag='National co-champion designation in the 2019 register' if 'NATIONAL' in f['status'] else None,notes=' '.join(notes),sourceReviewNotes=warnings))
    audit=dict(edition='June 13, 2019',retrieved='October 11, 2026',registerUrl=SOURCE,programUrl=PROGRAM,geographyUrl=GEOGRAPHY,sourceHashes={Path(p).name:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in [register,counties]},expectedRecords=121,speciesAndVarieties=117,mappedRecords=121,countyCount=len(points),coChampionEntries=sum('Co-Champ' in f['status'] for f in fixture),historicalNationalDesignations=sum('NATIONAL' in f['status'] for f in fixture),tablePages=list(range(2,19)),recordsPerPage=dict(Counter(str(f['page']) for f in fixture)),units='DBH and circumference in inches; height in feet; quarter-average crown spread in feet multiplied by four to display full average crown spread. Published points unchanged.',review='All 121 STATE rows across 117 published taxa retained, including four pairs of co-champions. National comparison rows are excluded, including the Oregon national co-champion beside the Idaho Betula pendula. Nomination years are not measurement dates. Source spellings retained. Adam county mapped to Adams; Cambridge/Idaho County conflict flagged without changing the county.',privacy='Nominator/owner names, street addresses, detailed locations and tree coordinates omitted; county points do not establish visiting permission.')
    for filename,value in [('idaho-champion-trees.json',records),('idaho-county-points.json',points),('idaho-import-audit.json',audit)]:
        (ROOT/'lib/data'/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'records':len(records),'counties':len(points),'coChampions':audit['coChampionEntries']}))

if __name__=='__main__':build(*sys.argv[1:])
