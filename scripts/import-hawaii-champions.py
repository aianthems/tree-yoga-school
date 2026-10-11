"""Import the HI selection from the official 2024 NCTP CSV and Census counties ZIP.

Usage: python scripts/import-hawaii-champions.py REGISTER.csv COUNTIES.zip
The checked fixture records the independent PDF comparison, not personal fields.
"""
import csv, hashlib, io, json, sys, zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source, geography = map(Path, sys.argv[1:3])
raw = source.read_bytes()
rows = list(csv.DictReader(io.StringIO(raw.decode("cp1252"))))
selected = [(i, row) for i, row in enumerate(rows, 1) if row["State"].strip() == "HI"]
fixture = json.loads((root / "scripts/fixtures/hawaii-champions.json").read_text())
assert len(selected) == 11, "Review changed coverage before importing"
assert [r["NCTP Tree Id"].strip() for _, r in selected] == [r["id"] for r in fixture]
with zipfile.ZipFile(geography) as z:
    text = z.read(z.namelist()[0]).decode("utf-8-sig")
counties = list(csv.DictReader(io.StringIO(text), delimiter="|" if "|" in text.splitlines()[0] else "\t"))
county_ids = {"Hawaii": "15001", "Honolulu": "15003"}
points = {}
for name, geoid in county_ids.items():
    row = next(r for r in counties if r["GEOID"].strip() == geoid)
    assert row["USPS"].strip() == "HI" and row["NAME"].strip() == name + " County"
    points[name] = {"lat": float(row["INTPTLAT"].strip()), "lng": float(row["INTPTLONG"].strip())}
records = []
for (source_row, row), checked in zip(selected, fixture):
    number = lambda key: float(row[key]) if row[key].strip() else None
    values = [number(key) for key in ["Circ. (in)", "Height (ft)", "Crown Spread (ft)", "Total Points"]]
    assert values == checked["measurements"] == checked["pdfMeasurements"]
    assert [row[k].strip() for k in ["Scientific Name", "Common Name", "County", "Year Last Measured", "Year Nominated"]] == checked["sourceFields"]
    assert row["Status"].strip() == "Champion" and not row["NCTME Verified?"].strip()
    source_county = row["County"].strip()
    county = {"Hawai?i": "Hawaii", "Hawai'i": "Hawaii", "Honolulu": "Honolulu", "O‘ahu": "Honolulu"}[source_county]
    review = []
    if source_county == "O‘ahu":
        review.append("The CSV lists O‘ahu in the county field, and the PDF calls it O‘ahu County. The marker uses Honolulu County’s approximate Census point, which represents O‘ahu for this record. The original location label is retained; no individual-tree location is inferred.")
    elif source_county == "Hawai?i":
        review.append("The CSV renders the county name as Hawai?i. The accompanying PDF identifies Hawaiʻi County; the marker uses the Census Hawaii County point. The original CSV field is retained.")
    if "?" in row["Common Name"]:
        review.append("The CSV renders the common name as K?lea Lau Nui. The accompanying PDF spells it Kōlea Lau Nui; the displayed name follows the PDF, and the original CSV name is retained in this note.")
    records.append({"id": "hi-" + row["NCTP Tree Id"].strip(), "state": "HI", "sourceTreeId": row["NCTP Tree Id"].strip(), "sourceRow": source_row,
        "sourceUrl": "https://nationalchampiontree.org/champion-tree-registry/", "scientificName": row["Scientific Name"].strip(),
        "commonName": "Kōlea Lau Nui" if "?" in row["Common Name"] else row["Common Name"].strip(),
        "sourceCounty": source_county, "town": "", "county": county, "location": None,
        "measured": row["Year Last Measured"].strip(), "nominated": row["Year Nominated"].strip(), "diameter": number("DBH (in)"),
        "circumference": values[0], "height": values[1], "crown": values[2], "points": values[3],
        "status": "National champion · 2024 register", "nationalFlag": "Champion in the 2024 National Register", "sourceReviewNotes": review,
        "notes": "Listed as Champion in the 2024 National Register, retrieved October 11, 2026. This is a limited national-register selection, not a complete Hawaiʻi state register. Register edition, nomination year and last-measured year are distinct. Current condition and champion status are unverified. The blank NCTME verification field does not establish verification. County marker is approximate, not the tree location; visiting access is unclassified. Personal measurer information is omitted."})
audit = {"sourceUrl": "https://nationalchampiontree.org/wp-content/uploads/sites/270/2025/02/NCTP-2024-Register-downloadable-measurement-data.csv",
    "pdfUrl": "https://nationalchampiontree.org/wp-content/uploads/sites/270/2025/01/2024-Register-final-web-version-1-15-25-compressed.pdf",
    "sourceEdition": 2024, "retrieved": "2026-10-11", "sourceSha256": hashlib.sha256(raw).hexdigest(), "sourceRows": len(rows), "stateFilter": "State == HI",
    "includedRecords": len(records), "includedIds": [r["sourceTreeId"] for r in records], "pdfMeasurementChecks": 11,
    "countyGeoids": county_ids, "countyCounts": {name: sum(r["county"] == name for r in records) for name in county_ids},
    "geographySha256": hashlib.sha256(geography.read_bytes()).hexdigest(), "coverage": "Limited national-register coverage; not a complete state register",
    "locationNormalizations": {"Hawai?i": "Hawaii", "Hawai'i": "Hawaii", "O‘ahu": "Honolulu"}, "omittedFields": ["Measurer(s)"]}
for name, data in [("hawaii-champion-trees.json", records), ("hawaii-county-points.json", points), ("hawaii-import-audit.json", audit)]:
    (root / "lib/data" / name).write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
print("HI: 11 national-register champions, 2 approximate county points; access unclassified")
