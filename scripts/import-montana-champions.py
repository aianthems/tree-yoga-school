#!/usr/bin/env python3
"""Import the reviewed Montana DNRC 2024 printable register and Census county points.
Usage: python scripts/import-montana-champions.py REGISTER.pdf COUNTIES.zip
Requires pdfplumber. Table fixtures omit nominator names and all personal information.
"""
import csv, hashlib, io, json, re, sys, zipfile
from collections import Counter
from pathlib import Path
import pdfplumber
ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://dnrc.mt.gov/Forestry/Forest-Management/_2024_Compiled-Final-Register-_-SPREAD-PRINTABLE.pdf'
ALTERNATE = 'https://dnrc.mt.gov/Forestry/Forest-Management/2024-Big-Tree-Register-_-Compiled-_-Website.pdf'
GEOGRAPHY = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip'

def extract(path):
    out=[]; family=""
    with pdfplumber.open(path) as p:
        for i in range(11,22):
            page=p.pages[i];cols=sorted([r for r in page.rects if r['fill'] and 95<r['top']<140 and r['height']>20],key=lambda r:r['x0']);assert len(cols)==11
            words=page.extract_words(extra_attrs=['fontname','size']);bottom=cols[0]['bottom']
            words=[w for w in words if w['top']>bottom and w['bottom']<735]
            anchors=[w for w in words if cols[2]['x0']<=w['x0']<cols[2]['x1'] and re.fullmatch('[∆Δ]?[UW]',w['text'])];anchors.sort(key=lambda w:w['top'])
            heads=[w for w in words if 'Bold' in w['fontname'] and w['x0']<cols[1]['x0']]
            groups={}
            for w in heads:groups.setdefault(round(w['top'],1),[]).append(w)
            heads=[(top,' '.join(w['text'] for w in sorted(ws,key=lambda w:w['x0']))) for top,ws in groups.items()]
            def rowfor(w):return min(range(len(anchors)),key=lambda k:abs((w['top']+w['bottom'])/2-(anchors[k]['top']+anchors[k]['bottom'])/2))
            for n,a in enumerate(anchors):
                hs=[(y,s) for y,s in heads if y<a['top']]
                if hs:family=hs[-1][1]
                vals=[]
                for c in cols[:10]:
                    ws=[w for w in words if c['x0']-0.1<=(w['x0']+w['x1'])/2<c['x1']+0.1 and 'Bold' not in w['fontname'] and rowfor(w)==n]
                    ws.sort(key=lambda w:(round(w['top']/2)*2,w['x0']))
                    vals.append(' '.join(w['text'] for w in ws))
                flags=any(w['x1']<cols[0]['x0'] and rowfor(w)==n for w in words)
                out.append(dict(page=i+1,row=n+1,category=family,native=i<16,values=vals,national=flags))
        
    return out

def unwrap(value):
    # Remove only typeset line-break hyphens, retaining ordinary name hyphens.
    return re.sub(r'-\s+(?=[a-z])', '', value).strip()

def number(value):
    assert re.fullmatch(r'\d+(?:\.\d+)?', value), ('Unexpected measurement', value)
    return float(value) if '.' in value else int(value)

def build(register, geography):
    fixture = extract(register)
    reviewed = json.loads((ROOT/'scripts/fixtures/montana-champions-2024.json').read_text())
    assert fixture == reviewed and len(fixture) == 174, 'Source changed; review the table fixture before refreshing'
    counties = {}
    with zipfile.ZipFile(geography) as archive:
        content = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    for raw in csv.DictReader(io.StringIO(content), delimiter='|'):
        r = {k.strip(): v.strip() for k, v in raw.items()}
        if r['USPS'] == 'MT':
            counties[r['NAME'].removesuffix(' County')] = dict(lat=float(r['INTPTLAT']), lng=float(r['INTPTLONG']))
    records=[]; points={}
    for f in fixture:
        common, scientific, setting, score, diameter, circ, height, crown, county, years = f['values']
        common=unwrap(common); category=f['category'].title()
        if f['category'] == 'KENTUCKY': category='Kentucky Coffeetree'
        comparable = lambda value: re.sub(r'[-\s]', '', value.casefold())
        if common == 'Bunya': common = category
        elif common != 'Black Cherry' and comparable(category) not in comparable(common): common += ' ' + category
        cochamp='*' in scientific
        scientific=unwrap(scientific.replace('*',''))
        mapped=unwrap(county).replace('Ravvalli','Ravalli')
        assert mapped in counties, county
        points[mapped]=counties[mapped]
        measured_years=re.findall(r'\b\d{4}\b',years)
        assert measured_years and measured_years == sorted(measured_years), years
        notes=[]
        if county != mapped: notes.append('Published county field “'+county+'” is matched to Census '+mapped+' County; source text is retained.')
        if crown == '7.': notes.append('The source crown-spread cell reads “7.” and is ambiguous. No numeric crown spread is inferred; the published score remains unchanged.')
        if common == 'Scarlet Oak': notes.append('The source calls this tree Scarlet Oak but lists Quercus rubra. Both published names are retained; botanical identification requires confirmation from DNRC.')
        score_match=re.fullmatch(r'(\d+)\s+\((.+)\)',score); assert score_match, score
        national_comparison=score_match[2]
        record_notes=['2024 register: '+('native' if f['native'] else 'non-native')+' table; '+('urban (U)' if setting.endswith('U') else 'wildland (W)')+'.', 'Published year history: '+years+'.', 'Parenthesized national comparison: '+national_comparison+'; this is not a national designation.']
        if '∆' in setting or 'Δ' in setting: record_notes.append('The source delta symbol designates naturalized.')
        if cochamp: record_notes.append('The source asterisk designates co-champion.')
        records.append(dict(id=f"mt-p{f['page']}-r{f['row']}", state='MT', sourcePage=f['page'], sourceRow=f['row'], sourceUrl=SOURCE+'#page='+str(f['page']), sourceCounty=county, scientificName=scientific, commonName=common, town='', county=mapped, location=None, measured=measured_years[-1], diameter=number(diameter), circumference=number(circ), height=number(height), crown=None if crown=='7.' else number(crown), points=int(score_match[1]), status='Montana '+('co-champion' if cochamp else 'champion')+' · '+('Urban' if setting.endswith('U') else 'Wildland'), nationalFlag='National Champ badge in the 2024 register' if f['national'] else None, notes=' '.join(record_notes), sourceReviewNotes=notes))
    audit=dict(edition='2024', retrieved='October 10, 2026', registerUrl=SOURCE, alternateUrl=ALTERNATE, geographyUrl=GEOGRAPHY, sourceHashes={Path(p).name:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in [register,geography]}, expectedRecords=174, mappedRecords=174, nativeRecords=81, nonNativeRecords=93, countyCount=len(points), tablePages=list(range(12,23)), nationalBadges=sum(f['national'] for f in fixture), coChampionEntries=sum('*' in f['values'][1] for f in fixture), units='Circumference and DBH in inches; height and crown spread in feet. Published points preserved. Parenthesized scores are national comparisons, not titles.', review='Both official PDF layouts reconcile across all 174 entries. Typeset line breaks are joined; botanical source spellings retained. Ravvalli matched to Ravalli. Ambiguous crown cell 7. left null. Scarlet Oak / Quercus rubra mismatch flagged.', privacy='Nominator names omitted. Only approximate county points are mapped; visiting access and current tree condition are unverified.')
    for filename,value in [('montana-champion-trees.json',records),('montana-county-points.json',points),('montana-import-audit.json',audit)]:
        (ROOT/'lib/data'/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'records':len(records),'counties':len(points)}))

if __name__ == '__main__': build(*sys.argv[1:])
