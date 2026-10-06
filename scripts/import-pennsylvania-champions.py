"""Import the supplied PA score-leader extraction and Census county Gazetteer.

Usage: python3 scripts/import-pennsylvania-champions.py EXTRACTION.json COUNTIES.txt
The selection is derived, not an explicit state designation. No successor is
invented for the record explicitly marked removed in the supplied extraction.
"""
import csv
import json
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parents[1]
source = json.loads(pathlib.Path(sys.argv[1]).read_text())
with open(sys.argv[2]) as f:
    counties = {r["NAME"].removesuffix(" County"): {
        "lat": float(r["INTPTLAT"]), "lng": float(r["INTPTLONG"])
    } for r in csv.DictReader(f, delimiter="|") if r["USPS"] == "PA"}
records = []
excluded = []
for row, item in enumerate(source["namedCategoryLeaders"], 1):
    comments = item.get("sourceComments", "")
    if item["name"] == "Northern Pin Oak" and comments.strip().endswith("removed"):
        excluded.append(item["sourceUrl"])
        continue
    assert item["county"] in counties, item["county"]
    assert item["sourceUrl"].startswith("https://pabigtrees.com/")
    notes = list(item["reviewNotes"])
    if not item["detailPageVerified"]:
        notes = [n for n in notes if n != "Detail page unavailable at extraction."]
        notes.append("The public listing was captured, but the detail page could not be retrieved during extraction. Additional measurements are not available in this snapshot.")
    if item.get("sourceNationalChampionDesignation"):
        notes.append("The source displays National Champion under Legacy Flags. Current national status has not been independently confirmed.")
    flags = ", ".join(item["flags"]) or "None"
    record = {
        "id": "pa-" + item["id"], "sourceRow": row,
        "scientificName": item["speciesLabel"], "commonName": item["name"],
        "location": item["address"] or None, "town": item["county"] + " County",
        "county": item["county"], "mapPrecision": "county",
        "measured": (item.get("dateMeasuredISO") or "")[:10] or None,
        "circumference": item.get("circumferenceInches"), "height": item.get("heightFeet"),
        "crown": (item["spreadOneFeet"] + item["spreadTwoFeet"]) / 2 if "spreadOneFeet" in item and "spreadTwoFeet" in item else None,
        "points": item["points"], "status": "Tied published-score leader" if item["publishedScoreTieCount"] > 1 else "Score-based state leader",
        "sourceUrl": item["sourceUrl"], "sourceReviewNotes": notes,
        "notes": f"Original record ID: {item['id']}. Source flags: {flags}." + (f" Comments: {comments}" if comments and comments != "N/A" else ""),
    }
    records.append(record)
assert len(records) == 445 and len(excluded) == 1
assert len({r["id"] for r in records}) == len(records)
assert sum(r["status"] == "Tied published-score leader" for r in records) == 10
used = {r["county"]: counties[r["county"]] for r in records}
for name, data in [("pennsylvania-champion-trees.json", records), ("pennsylvania-county-points.json", used)]:
    (root / "lib/data" / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"records": len(records), "counties": len(used), "missingHeight": sum(r["height"] is None for r in records), "excludedRemoved": excluded}))
