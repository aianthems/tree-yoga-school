#!/usr/bin/env python3
"""Import the complete Kansas Forest Service HTML register and Census 2025 KS places.
Usage: python scripts/import-kansas-champions.py REGISTER.html PLACES.txt
No source nominator names, private addresses, or tree coordinates are imported.
"""
import csv, datetime, hashlib, io, json, re, sys
from html.parser import HTMLParser
from pathlib import Path
OUT = Path(__file__).resolve().parents[1] / "lib/data"
SOURCE = "https://www.kansasforests.org/programs/championtreelist.html"
GEOGRAPHY = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_20.txt"
HEADER = ["Common Name (Year Nominated)", "Scientific Name", "Circumference (in.)", "Height (ft)", "Crown Spread", "Total Points", "Location", "Nominator(s)", "Last Measured"]
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

def build(html_path, places_path):
    html = Path(html_path).read_bytes(); geography = Path(places_path).read_bytes()
    parser=TableParser(); parser.feed(html.decode("utf-8"))
    tables=[t for t in parser.tables if t and t[0] == HEADER]
    assert len(tables)==1, "Expected one register with the reviewed headers"
    rows=tables[0][1:]; assert len(rows)==148, "Source count changed; review before importing"
    text=geography.decode("utf-8-sig")
    places={}
    for raw in csv.DictReader(io.StringIO(text), delimiter="|"):
        r={k.strip():v.strip() for k,v in raw.items()}
        assert r["USPS"] == "KS"
        name=re.sub(r" (city|CDP)$", "", r["NAME"])
        assert name.casefold() not in places
        places[name.casefold()]={"lat":float(r["INTPTLAT"]), "lng":float(r["INTPTLONG"])}
    records=[]; points={}; unmapped=[]
    for index,cells in enumerate(rows,1):
        assert len(cells)==9, (index,cells)
        published, scientific, circumference,height,crown,score,town,_nominator,measured=cells
        assert all(re.fullmatch(r"\d+(?:\.\d+)?",v) for v in [circumference,height,crown,score])
        year=re.search(r"\((\d{4})\)",published)
        common=re.sub(r"\s*\(\d{4}\)\s*", " ", published)
        co="Co-Champion" in common
        common=" ".join(common.replace("Co-Champion", "").split())
        identity="|".join([scientific,town,common])
        tree_id="ks-"+hashlib.sha256(identity.encode()).hexdigest()[:12]
        notes=["Names and scores are retained as published, including source spelling. No champion titles are inferred from scores."]
        if town.casefold() in places: points[town]=places[town.casefold()]
        else:
            unmapped.append({"id":tree_id,"sourceRow":index,"place":town})
            notes.append(f"Published place {town} does not exactly match a 2025 Census Kansas place. This record remains searchable without a marker; no location is inferred.")
        records.append(dict(id=tree_id,state="KS",sourceRow=index,sourceTreeId=None,sourceUrl=SOURCE,
            scientificName=scientific,commonName=common,town=town,county="",location=None,
            measured=datetime.datetime.strptime(measured,"%m/%d/%Y").date().isoformat(),
            nominated=year.group(1) if year else "Not listed",
            circumference=float(circumference),height=float(height),crown=float(crown),points=float(score),
            status="State co-champion" if co else "Listed in Kansas champion register",
            notes=f"Published common-name field: {published}. Nomination year is separate from the last-measured date.",
            sourceReviewNotes=notes))
    assert len({r["id"] for r in records})==148, "Duplicate identities require source review"
    assert sum(r["status"]=="State co-champion" for r in records)==4
    audit=dict(sourceUrl=SOURCE,retrieved="October 9, 2026",sourceSHA256=hashlib.sha256(html).hexdigest(),
        geographyUrl=GEOGRAPHY,geographySHA256=hashlib.sha256(geography).hexdigest(),sourceRows=148,included=148,
        mapped=148-len(unmapped),places=len(points),coChampions=4,unmapped=unmapped,
        identity="SHA256 of source scientific name, place and common name without nomination year or co-champion label; first 12 hex digits. Names/place changes require reconciliation on refresh.",
        geography="Exact case-insensitive name matches to approximate Census place internal points. Unmatched names remain unmapped. Counties are not supplied or inferred. Markers do not locate trees or establish visiting access.")
    return records,points,audit
if __name__ == "__main__":
    records,points,audit=build(*sys.argv[1:])
    for name,data in [("kansas-champion-trees",records),("kansas-place-points",points),("kansas-import-audit",audit)]:
        (OUT/(name+".json")).write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({k:audit[k] for k in ["included","mapped","places","coChampions"]}))
