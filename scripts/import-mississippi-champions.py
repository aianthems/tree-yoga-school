"""Import Mississippi records from the supplied 2024 NCTP CSV and Census counties ZIP."""
import csv, hashlib, io, json, sys, zipfile
from pathlib import Path
root = Path(__file__).resolve().parents[1]
source, geography = map(Path, sys.argv[1:3])
raw = source.read_bytes()
rows = list(csv.DictReader(io.StringIO(raw.decode("cp1252"))))
selected = [(i, row) for i, row in enumerate(rows, 1) if row["State"].strip() == "MS"]
assert len(selected) == 1 and selected[0][1]["NCTP Tree Id"] == "5821", "Review changed source coverage before importing"
with zipfile.ZipFile(geography) as z:
    county_bytes = z.read(z.namelist()[0])
text = county_bytes.decode("utf-8-sig")
delimiter = "|" if "|" in text.splitlines()[0] else "\t"
counties = list(csv.DictReader(io.StringIO(text), delimiter=delimiter))
county = next(row for row in counties if row["USPS"].strip() == "MS" and row["GEOID"].strip() == "28143")
assert county["NAME"].strip() == "Tunica County"
records = []
for source_row, row in selected:
    number = lambda key: float(row[key]) if row[key].strip() else None
    assert row["Status"].strip() == "Champion" and row["County"].strip() == "Tunica"
    records.append({"id": "ms-" + row["NCTP Tree Id"].strip(), "state": "MS", "sourceTreeId": row["NCTP Tree Id"].strip(), "sourceRow": source_row,
        "sourceUrl": "https://nationalchampiontree.org/champion-tree-registry/", "scientificName": row["Scientific Name"].strip(), "commonName": row["Common Name"].strip(),
        "town": "", "county": row["County"].strip(), "location": None, "measured": row["Year Last Measured"].strip() or None,
        "nominated": row["Year Nominated"].strip(), "diameter": number("DBH (in)"), "circumference": number("Circ. (in)"), "height": number("Height (ft)"), "crown": number("Crown Spread (ft)"), "points": number("Total Points"),
        "status": "National champion · 2024 register", "nationalFlag": "Champion in the 2024 National Register",
        "sourceReviewNotes": ["The downloadable CSV lists height as 30 feet; the accompanying 2024 PDF lists 28 feet. This record follows the supplied CSV and preserves the published 78 points."],
        "notes": "One Mississippi record in the user-supplied 2024 National Register CSV, supplied October 11, 2026. This is limited national-register coverage, not a complete Mississippi state register. Current condition and champion status are unverified. Nominated and last measured in 2016. NCTME verification is blank in the CSV and is not inferred. County marker is approximate, not the tree location; visiting access is unclassified. Personal measurer information is omitted."})
points_path = root / "lib/data/mississippi-county-points.json"
points = json.loads(points_path.read_text()) if points_path.exists() else {}
points["Tunica"] = {"lat": float(county["INTPTLAT"].strip()), "lng": float(county["INTPTLONG"].strip())}
audit = {"sourceFile": source.name, "sourceEdition": 2024, "supplied": "2026-10-11", "sourceSha256": hashlib.sha256(raw).hexdigest(), "sourceRows": len(rows), "stateFilter": "State == MS", "includedRecords": len(records), "includedIds": [r["sourceTreeId"] for r in records], "countyGeoid": "28143", "countySource": "Census 2025 national county Gazetteer", "geographySha256": hashlib.sha256(geography.read_bytes()).hexdigest(), "coverage": "Limited national-register coverage; not a complete state register", "heightDiscrepancy": {"csvFeet": 30, "pdfFeet": 28, "displayFollows": "CSV"}, "omittedFields": ["Measurer(s)"]}
for name, data in [("mississippi-champion-trees.json", records), ("mississippi-county-points.json", points), ("mississippi-import-audit.json", audit)]:
    (root / "lib/data" / name).write_text(json.dumps(data, indent=2) + "\n")
print("MS: 1 national-register record, 1 approximate county marker")
