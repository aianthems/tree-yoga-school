"""Import Virginia Tech's StateChamp HTML list, downloaded detail pages, and Census geography.
Usage: python scripts/import-virginia-champions.py SNAPSHOT_DIR
SNAPSHOT_DIR contains list.html, <Virginia database ID>.html, counties.zip.
Requires beautifulsoup4. Only the explicitly designated live champion list is imported.
Tree GPS, personal owner/contact information, and visiting permission are not imported.
"""
from bs4 import BeautifulSoup
from pathlib import Path
import csv,io,json,re,sys,zipfile
root=Path(__file__).resolve().parents[1]
snapshot=Path(sys.argv[1])
clean=lambda text:' '.join(text.split())
def number(text):
    match=re.fullmatch(r'([\d,.]+)(?:\s*(?:in\.|ft\.))?',text.strip())
    if not text.strip():return None
    assert match,repr(text)
    return float(match[1].replace(',',''))
with zipfile.ZipFile(snapshot/'counties.zip') as z:
    rows=csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode()),delimiter='|')
    geography={r['NAME'].removesuffix(' County').replace(' city',' City'):{'lat':float(r['INTPTLAT']),'lng':float(r['INTPTLONG'])} for r in rows if r['USPS']=='VA'}
soup=BeautifulSoup((snapshot/'list.html').read_text(),'html.parser')
records=[]
for row in soup.select('tr'):
    a=row.select_one('a[href*="detail.cfm?AutofieldforPrimaryKey="]')
    if not a:continue
    cells=[clean(c.get_text(' ',strip=True)) for c in row.find_all('td')]
    ident=int(re.search(r'Key=(\d+)',a['href'])[1])
    detail=BeautifulSoup((snapshot/f'{ident}.html').read_text(),'html.parser')
    fields={}
    for para in detail.select('p'):
        text=clean(para.get_text(' ',strip=True))
        if ':' in text:
            key,value=text.split(':',1);fields[key.strip()]=value.strip()
    assert fields['Status']=='alive',(ident,fields['Status'])
    assert fields['Virginia Champion']=='yes',(ident,fields['Virginia Champion'])
    assert fields['Scientific Name']==cells[1],ident
    assert fields['Common Name']==clean(a.get_text()),ident
    county=cells[2].replace('City of ','')+' City' if cells[2].startswith('City of ') else cells[2]
    assert county in geography,(ident,county)
    assert fields['Tree is located in']==cells[2],(ident,fields.get('Tree is located in'),cells[2])
    points=number(fields['Points'])
    assert points==number(cells[3]),ident
    assert re.fullmatch(r'\d{4}',fields['Date Last Measured']),ident
    national=fields['National Champion']=='yes'
    records.append({'id':f'va-{ident}','state':'VA','sourceRow':ident,'scientificName':cells[1],'commonName':fields['Common Name'],'town':cells[2],'county':county,'mapPrecision':'county','location':None,'measured':fields['Date Last Measured'],'circumference':number(fields['Trunk Girth']),'height':number(fields['Tree Height']),'crown':number(fields['Crown Spread']),'points':points,'status':'State champion · Virginia Tech register','nationalFlag':'National champion · Virginia Tech register label' if national else '', 'sourceUrl':f'https://bigtree.cnre.vt.edu/detail.cfm?AutofieldforPrimaryKey={ident}','notes':None})
assert len(records)==369 and len({r['id'] for r in records})==369
used={r['county']:geography[r['county']] for r in records}
for filename,data in [('virginia-champion-trees.json',records),('virginia-county-points.json',dict(sorted(used.items())))]:
    (root/'lib/data'/filename).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'records':len(records),'categories':len({r['scientificName'] for r in records}),'places':len(used),'nationalLabels':sum(bool(r['nationalFlag']) for r in records)}))
