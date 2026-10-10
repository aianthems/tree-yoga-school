#!/usr/bin/env python3
"""Import the Oregon registry's literal Google Charts table without running its JS.
Usage: python scripts/import-oregon-champions.py REGISTRY.html COUNTIES.zip
Reviewed fixtures omit nominators. One historical county match is separately sourced.
"""
import ast,csv,hashlib,io,json,re,sys,zipfile
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE='https://www.championtreeregistry.com/oregon-registry/'
HISTORY='https://nationalchampiontree.org/wp-content/uploads/sites/270/2025/09/National-Register-of-Big-Trees-2012.pdf#page=58'
GEOGRAPHY='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'
def extract(path):
    html=Path(path).read_text()
    chunks=re.findall(r'data\.addRows\(\[(.*?)\]\);',html,re.S);assert len(chunks)==1
    out=[]
    for n,line in enumerate(chunks[0].strip().splitlines(),1):
        row=ast.literal_eval(line.strip().lstrip(','));assert len(row)==8
        assert all(isinstance(x,str) for x in row[:3]) and all(isinstance(x,(int,float)) for x in row[3:7])
        out.append(dict(row=n,values=row[:7]))
    assert len(out)==167
    return out

def build(register,geography):
    fixture=extract(register)
    assert fixture==json.loads((ROOT/'scripts/fixtures/oregon-champions.json').read_text()),'Source changed; review the fixture before refreshing'
    records=[]
    labels={'SC':'State champion','SC-C':'State co-champion','NC':'National champion','NC-C':'National co-champion'}
    for f in fixture:
        scientific,common,status,circ,height,crown,score=f['values']
        if status=='PV':continue
        assert status in labels,status
        matched=scientific=='Chamaecyparis lawsoniana' and [circ,height,crown,score]==[522,242,35,773]
        reviews=[]
        if matched: reviews.append('Coos County is matched from the 2012 National Register of Big Trees, PDF page 58 (printed page 56): the scientific name, Oregon state, circumference 522 inches, height 242 feet, crown 35 feet and 773 points all match. This historical county attribution does not confirm current condition, national status or access. Oregon measurements remain unchanged.')
        records.append(dict(id=f"or-r{f['row']}",state='OR',sourceRow=f['row'],sourceUrl=SOURCE,scientificName=scientific,commonName=common,town='',county='Coos' if matched else '',location=None,measured=None,circumference=circ,height=height,crown=crown,points=score,status=labels[status]+' · Oregon source designation ('+status+')',nationalFlag=status if status.startswith('NC') else None,notes='Published Oregon registry status: '+status+'. Register edition and measurement dates are not stated. Current tree condition, champion status and visiting access are unconfirmed.',sourceReviewNotes=reviews,accessDetails='Visiting access unclassified'))
    assert len(records)==132 and sum(bool(r['county']) for r in records)==1
    with zipfile.ZipFile(geography) as z: content=z.read(z.namelist()[0]).decode('utf-8-sig')
    points={}
    for raw in csv.DictReader(io.StringIO(content),delimiter='|'):
        r={k.strip():v.strip() for k,v in raw.items()}
        if r['USPS']=='OR' and r['NAME']=='Coos County':points['Coos']=dict(lat=float(r['INTPTLAT']),lng=float(r['INTPTLONG']))
    assert len(points)==1
    audit=dict(retrieved='October 10, 2026',registerUrl=SOURCE,historicalCountyUrl=HISTORY,geographyUrl=GEOGRAPHY,sourceRows=167,expectedRecords=132,mappedRecords=1,unmappedRecords=131,pendingExcluded=35,statusCounts=dict(Counter(f['values'][2] for f in fixture)),edition='Not stated',sourceHashes={Path(p).name:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in [register,geography]},review='All SC, SC-C, NC and NC-C entries retained. PV excluded without score-based promotion. Source national labels unverified. One exact historical county match: Chamaecyparis lawsoniana, OR, 522/242/35/773, Coos, 2012 register PDF page 58. Other counties remain unknown. Names and measurements preserved as published.',privacy='Nominators omitted. No names, addresses, exact tree positions or inferred visiting permissions.',units='Circumference in inches; height and average crown spread in feet. Points preserved.')
    for filename,value in [('oregon-champion-trees.json',records),('oregon-county-points.json',points),('oregon-import-audit.json',audit)]: (ROOT/'lib/data'/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'records':len(records),'mapped':1,'unmapped':131,'statuses':audit['statusCounts']}))
if __name__=='__main__':build(*sys.argv[1:])
