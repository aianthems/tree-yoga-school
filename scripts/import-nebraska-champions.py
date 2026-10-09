#!/usr/bin/env python3
"""Import the reviewed 90-row Nebraska register and Census 2025 NE places.
Usage: python scripts/import-nebraska-champions.py REGISTER.html PLACES.txt
Reviewed place labels below refer to source locations; they are not tree coordinates.
"""
import csv, datetime, hashlib, io, json, re, sys
from decimal import Decimal
from html.parser import HTMLParser
from pathlib import Path
OUT = Path(__file__).resolve().parents[1] / "lib/data"
SOURCE = "https://nfs.unl.edu/registry/"
GEOGRAPHY = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_31.txt"
HEADER = ["Common Name", "Scientific Name", "Circumference (feet)*", "Height (feet)", "Average Spread (feet)", "Total Points", "Date Nominated", "Date Measured", "Tree Steward"]
# One reviewed source place per row. Blank means no unambiguous municipality is supplied.
TOWNS = """Nemaha|Nebraska City|Ponca|Geneva|South Sioux City|Lincoln|Beemer|Sparks|Long Pine|Gretna|Pierce|Weeping Water|Peru|Nebraska City|Lincoln|Lincoln||Omaha|Auburn|Lincoln|Ponca|Cozad|Morse Bluff|Tekamah|Omaha|Falls City|Nebraska City|Nebraska City|Plattsmouth|Syracuse|Talmage|Tekamah|Beemer|Nebraska City|Nebraska City|Lincoln|Wymore|West Point|Minatare|Omaha||Grand Island|Falls City|Genoa|Blair|Nebraska City|Harrison|Lincoln|Auburn|Wahoo|Barada|Peru|Omaha|Salem|Omaha|Fremont|Lincoln|Lincoln|Omaha|Johnson|Table Rock|Nebraska City|Bellevue|Brownville||Bellevue|Falls City|Peru|Peru|Peru|Kimball|Sidney||Omaha|Arthur|Peru|Peru|Marsland|Chadron|Plattsmouth|Chadron|Nebraska City|Brownville|Nebraska City|O'Neill|Chadron||Oakland|Falls City|Nebraska City""".split("|")
class TableParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.tables=[]; self.table=self.row=self.cell=None
    def handle_starttag(self, tag, attrs):
        if tag == "table": self.table=[]
        if tag == "tr" and self.table is not None: self.row=[]
        if tag in ("td", "th") and self.row is not None: self.cell=[]
        if tag == "br" and self.cell is not None: self.cell.append(" ")
    def handle_data(self, data):
        if self.cell is not None: self.cell.append(data)
    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.cell is not None:
            self.row.append(" ".join("".join(self.cell).split())); self.cell=None
        if tag == "tr" and self.row is not None:
            self.table.append(self.row); self.row=None
        if tag == "table" and self.table is not None:
            self.tables.append(self.table); self.table=None

def date(value):
    if re.fullmatch(r"\d{4}", value): return value
    return datetime.datetime.strptime(value, "%m/%d/%Y").date().isoformat()

def build(html_path, places_path):
    html=Path(html_path).read_bytes(); geography=Path(places_path).read_bytes()
    parser=TableParser(); parser.feed(html.decode("utf-8"))
    tables=[t for t in parser.tables if t and t[0]==HEADER]
    assert len(tables)==1, "Register headers changed; review required"
    rows=tables[0][1:]
    assert len(rows)==len(TOWNS)==90, "Source count changed; review required"
    reviewed=json.loads((OUT.parents[1]/"scripts/fixtures/nebraska-champions-2026-10-09.json").read_text())
    assert [r[:8] for r in rows]==reviewed, "Names or measurements changed; review fixture and place assignments before refreshing"
    places={}
    for raw in csv.DictReader(io.StringIO(geography.decode("utf-8-sig")),delimiter="|"):
        r={k.strip():v.strip() for k,v in raw.items()}; assert r["USPS"]=="NE"
        name=re.sub(r" (city|village|CDP)$","",r["NAME"])
        assert name.casefold() not in places
        places[name.casefold()]={"lat":float(r["INTPTLAT"]),"lng":float(r["INTPTLONG"])}
    records=[]; points={}; unmapped=[]
    for index,(cells,town) in enumerate(zip(rows,TOWNS),1):
        assert len(cells)==9
        common,scientific,circ,height,crown,score,nominated,measured,location=cells
        # Validate each reviewed town against the published location before using it.
        assert not town or town.casefold() in location.casefold(), (index,town,location)
        inches=circ.endswith('"')
        assert inches == (index==86), "Unit exception changed; review required"
        circumference=float(Decimal(circ.rstrip('"')) * (1 if inches else 12))
        assert all(re.fullmatch(r"\d+(?:\.\d+)?",v) for v in [height,crown,score])
        tree_id="ne-"+hashlib.sha256((common+"|"+scientific).encode()).hexdigest()[:12]
        notes=["Names, numbered entries and scores remain as published. Repeated species do not receive inferred co-champion titles. Year-only dates retain their original precision."]
        notes.append(f"Published circumference: {circ}; " + ("explicit inch mark takes precedence over the column's feet heading." if inches else "feet converted to inches for this map."))
        if town.casefold() in places: points[town]=places[town.casefold()]
        else:
            unmapped.append({"id":tree_id,"sourceRow":index,"place":town})
            notes.append("No unambiguous Census place match; retained without a map marker.")
        # No exact tree coordinates or personal steward names are copied.
        if index==17: location="Pibel Lake SRA (source publishes coordinates; not used on this map)"
        if index==28: location="Property in Nebraska City (personal steward name omitted)"
        if index==33: location="2 miles south and west of Beemer (personal steward name omitted)"
        if index==65: location=None
        records.append(dict(id=tree_id,state="NE",sourceRow=index,sourceTreeId=None,sourceUrl=SOURCE,
            commonName=common,scientificName=scientific,town=town,county="",location=location,
            measured=date(measured),nominated=date(nominated),circumference=circumference,
            circumferenceFeet=None if inches else float(circ),height=float(height),crown=float(crown),points=float(score),
            status="Listed in Nebraska champion register",notes=None,sourceReviewNotes=notes))
    assert len({r["id"] for r in records})==90
    audit=dict(sourceUrl=SOURCE,retrieved="October 9, 2026",sourceSHA256=hashlib.sha256(html).hexdigest(),
        geographyUrl=GEOGRAPHY,geographySHA256=hashlib.sha256(geography).hexdigest(),sourceRows=90,included=90,
        mapped=90-len(unmapped),places=len(points),unmapped=unmapped,
        unitExceptions=[{"sourceRow":86,"published":'124"',"circumferenceInches":124}],
        reviewedPlaces=TOWNS,identity="SHA256 of published common and scientific names, first 12 hex digits. Changed names require reconciliation.",
        geography="Reviewed place names from published locations, matched exactly to Census place names. Nearby/directional descriptions map only to the named place, not the tree. Counties are not inferred. No visiting access is inferred.")
    return records,points,audit
if __name__=="__main__":
    records,points,audit=build(*sys.argv[1:])
    for name,data in [("nebraska-champion-trees",records),("nebraska-place-points",points),("nebraska-import-audit",audit)]:
        (OUT/(name+".json")).write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({k:audit[k] for k in ["included","mapped","places","unmapped"]}))
