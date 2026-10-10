#!/usr/bin/env python3
"""Import the Washington registry's literal Google Charts table without running its JS.
Usage: python scripts/import-washington-champions.py REGISTRY.html COUNTIES.zip
Reviewed fixtures omit nominators. One historical county match is separately sourced.
"""
import ast,csv,hashlib,io,json,re,sys,zipfile
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE='https://www.championtreeregistry.com/washington-registry/'
HISTORY='https://nationalchampiontree.org/wp-content/uploads/sites/270/2025/09/Finalized-American-Forests-2020-National-Register-of-Champion-Trees.pdf#page=1'
GEOGRAPHY='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'
def extract(path):
    html=Path(path).read_text()
    chunks=re.findall(r'data\.addRows\(\[(.*?)\]\);',html,re.S);assert len(chunks)==1
    out=[]
    for n,line in enumerate(chunks[0].strip().splitlines(),1):
        row=ast.literal_eval(line.strip().lstrip(','));assert len(row)==8
        assert all(isinstance(x,str) for x in row[:3]) and all(isinstance(x,(int,float)) for x in row[3:7])
        out.append(dict(row=n,values=row[:7]))
    assert len(out)==292
    return out

def build(register,geography):
    fixture=extract(register)
    assert fixture==json.loads((ROOT/'scripts/fixtures/washington-champions.json').read_text()),'Source changed; review the fixture before refreshing'
    records=[]
    labels={'SC':'State champion','SC-C':'State co-champion','NC':'National champion','NC-C':'National co-champion'}
    for f in fixture:
        scientific,common,status,circ,height,crown,score=f['values']
        if status=='PV':continue
        assert status in labels,status
        matched=scientific=='Abies amabilis' and [circ,height,crown,score]==[212,222,38,444]
        reviews=[]
        if matched: reviews.append('Clallam County is matched from the 2020 National Register of Champion Trees, PDF page 1, record 2915: the scientific name, Washington state, circumference 212 inches, height 222 feet, crown 38 feet and 444 points all match. This historical county attribution does not confirm current condition, national status or access. Washington measurements remain unchanged.')
        records.append(dict(id=f"wa-r{f['row']}",state='WA',sourceRow=f['row'],sourceUrl=SOURCE,scientificName=scientific,commonName=common,town='',county='Clallam' if matched else '',location=None,measured=None,circumference=circ,height=height,crown=crown,points=score,status=labels[status]+' · Washington source designation ('+status+')',nationalFlag=status if status.startswith('NC') else None,notes='Published Washington registry status: '+status+'. Register edition and measurement dates are not stated. Current tree condition, champion status and visiting access are unconfirmed.',sourceReviewNotes=reviews,accessDetails='Visiting access unclassified'))
    assert len(records)==279 and sum(bool(r['county']) for r in records)==1
    with zipfile.ZipFile(geography) as z: content=z.read(z.namelist()[0]).decode('utf-8-sig')
    points={}
    for raw in csv.DictReader(io.StringIO(content),delimiter='|'):
        r={k.strip():v.strip() for k,v in raw.items()}
        if r['USPS']=='WA' and r['NAME']=='Clallam County':points['Clallam']=dict(lat=float(r['INTPTLAT']),lng=float(r['INTPTLONG']))
    assert len(points)==1
    audit=dict(retrieved='October 10, 2026',registerUrl=SOURCE,historicalCountyUrl=HISTORY,geographyUrl=GEOGRAPHY,sourceRows=292,expectedRecords=279,mappedRecords=1,unmappedRecords=278,pendingExcluded=13,statusCounts=dict(Counter(f['values'][2] for f in fixture)),edition='Not stated',sourceHashes={Path(p).name:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in [register,geography]},review='All SC, SC-C, NC and NC-C entries retained. PV excluded without score-based promotion. Source national labels unverified. One exact historical county match: Abies amabilis, WA, 212/222/38/444, Clallam, 2020 register PDF page 1, record 2915. Other counties remain unknown. Names and measurements preserved as published.',privacy='Nominators omitted. No names, addresses, exact tree positions or inferred visiting permissions.',units='Circumference in inches; height and average crown spread in feet. Points preserved.')
    for filename,value in [('washington-champion-trees.json',records),('washington-county-points.json',points),('washington-import-audit.json',audit)]: (ROOT/'lib/data'/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'records':len(records),'mapped':1,'unmapped':278,'statuses':audit['statusCounts']}))
if __name__=='__main__':build(*sys.argv[1:])
