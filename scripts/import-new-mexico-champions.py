#!/usr/bin/env python3
"""Import explicitly designated state champions from NM's 2020 PDF.
Usage: python scripts/import-new-mexico-champions.py REGISTER.pdf COUNTIES.zip
Requires pdfplumber. Reviewed fixtures exclude names, addresses and tree coordinates.
"""
import csv, hashlib, io, json, re, sys, zipfile
from pathlib import Path
import pdfplumber
ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://www.emnrd.nm.gov/sfd/wp-content/uploads/sites/4/NMBigTreeDatabase_2020.pdf'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'
def extract(path):
    out=[]
    with pdfplumber.open(path) as pdf:
        assert len(pdf.pages)==12
        for page_number,page in enumerate(pdf.pages,1):
            tables=page.extract_tables(); assert len(tables)==1
            for row_number,row in enumerate(tables[0][1:],1):
                assert len(row)==13
                r=[' '.join((v or '').split()) for v in row]
                notes=r[12]; place=r[11]
                out.append(dict(page=page_number,row=row_number,values=r[:8]+r[9:11],privateProperty='private property' in place.lower(),reportedDead='dead' in notes.lower(),notFormallyNominated='not agreed to formally nominate' in notes.lower(),trunkNote='Double-trunked' if 'double-trunked' in notes.lower() else 'Multi-trunked' if 'multi-trunked' in notes.lower() else '',remeasured='2012-04-20' if '4/20/12' in notes and 'remeasured' in notes.lower() else None,placeConflict=page_number==11 and row_number==9 and 'Socorro' in place))
    assert len(out)==144
    return out

def number(value):
    cleaned=value.strip().rstrip('\"\u2032\u2033\'')
    assert re.fullmatch(r'\d+(?:\.\d+)?',cleaned),value
    return float(cleaned) if '.' in cleaned else int(cleaned)

def build(register,geography):
    fixture=extract(register)
    assert fixture==json.loads((ROOT/'scripts/fixtures/new-mexico-champions-2020.json').read_text()),'Review changed source before importing'
    with zipfile.ZipFile(geography) as z: content=z.read(z.namelist()[0]).decode('utf-8-sig')
    counties={}
    for raw in csv.DictReader(io.StringIO(content),delimiter='|'):
        r={k.strip():v.strip() for k,v in raw.items()}
        if r['USPS']=='NM': counties[r['NAME'].removesuffix(' County')]=dict(lat=float(r['INTPTLAT']),lng=float(r['INTPTLONG']))
    records=[]; points={}
    for f in fixture:
        common,status,national,scientific,height,circ,crown,score,submitted,county=f['values']
        if status!='STATE CHAMPION': continue
        assert not f['reportedDead']
        mapped='Doña Ana' if county=='Dona Ana' else county
        assert mapped in counties,county
        points[mapped]=counties[mapped]
        reviews=[]
        if f['placeConflict']: reviews.append('The published county is Catron, but the additional location field says Socorro. This marker follows the county field; the location conflict requires program confirmation.')
        if f['notFormallyNominated']: reviews.append('The source marks this tree STATE CHAMPION but says the landowner has not agreed to formally nominate. The designation is retained as published; consent and current status are unconfirmed.')
        if national=='NATIONAL CHAMPION - DECERT': reviews.append('The 2020 source explicitly labels the national designation DECERT; this is not a verified current national title.')
        notes=['Explicit STATE CHAMPION designation in the database last updated April 14, 2020.','Date Submitted: '+submitted+'; this is not a measurement date.']
        if f['trunkNote']: notes.append('Source note: '+f['trunkNote']+'.')
        if f['remeasured']: notes.append('Source explicitly reports remeasured April 20, 2012.')
        record=dict(id=f"nm-p{f['page']}-r{f['row']}",state='NM',sourcePage=f['page'],sourceRow=f['row'],sourceUrl=SOURCE+'#page='+str(f['page']),sourceCounty=county,scientificName=scientific,commonName=common,town='',county=mapped,location=None,measured=f['remeasured'],nominated=submitted,circumference=number(circ),height=number(height),crown=number(crown),points=number(score),status='State champion · 2020 source designation',notes=' '.join(notes),sourceReviewNotes=reviews,accessDetails='Source labels private property' if f['privateProperty'] else 'Visiting access unclassified')
        if national: record['nationalFlag']=national
        if f['privateProperty']: record['publicAccess']=False
        records.append(record)
    assert len(records)==37
    audit=dict(edition='April 14, 2020',retrieved='October 10, 2026',registerUrl=SOURCE,geographyUrl=GEOGRAPHY,expectedRecords=37,mappedRecords=37,sourceRows=144,excludedRows=107,countyCount=len(points),nationalLabels={v:sum(r.get('nationalFlag')==v for r in records) for v in ['NATIONAL CHAMPION','NOMINEE','NATIONAL CHAMPION - DECERT']},sourceHashes={Path(p).name:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in [register,geography]},review='Only explicit STATE CHAMPION rows included. Past national and undesignated entries excluded. Published spelling, measurements and points retained. Submission dates are not measurement dates. Two formal nomination consent notes and a Catron/Socorro conflict retained. Dona Ana matched to Census Doña Ana.',privacy='No names, addresses or exact tree coordinates. County points do not establish visiting permission.',units='Circumference in inches; height and crown spread in feet.')
    for filename,value in [('new-mexico-champion-trees.json',records),('new-mexico-county-points.json',points),('new-mexico-import-audit.json',audit)]: (ROOT/'lib/data'/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'records':len(records),'counties':len(points),'remeasured':sum(bool(r['measured']) for r in records)}))
if __name__=='__main__': build(*sys.argv[1:])
