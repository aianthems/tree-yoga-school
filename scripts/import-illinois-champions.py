#!/usr/bin/env python3
"""Import Illinois Extension's October 8, 2026 public map snapshot.

Usage: python scripts/import-illinois-champions.py RECORDS.json COUNTIES.zip
Query the documented field allowlist without geometry; never import owner,
nominator, street-address, photo, or individual-tree coordinate fields.
"""
import csv
import hashlib
import io
import json
import math
from pathlib import Path
import sys
import zipfile

LAYER = "https://services.arcgis.com/GL0fWlNkwysZaKeV/arcgis/rest/services/IBTR_masterfile/FeatureServer/0"
OUTPUT = Path(__file__).resolve().parents[1] / "lib/data"
MEASUREMENTS = ["Circumference__ft__", "Height__ft__", "Spread__ft__", "Total_Points"]


def clean(value):
    return " ".join(str(value).split()) if value is not None else ""


def number(value):
    if value is None:
        return None
    assert isinstance(value, (int, float)) and not isinstance(value, bool)
    assert math.isfinite(value) and value >= 0
    return value


def build(snapshot, county_zip):
    assert not snapshot.get("error") and not snapshot.get("exceededTransferLimit")
    rows = [feature["attributes"] for feature in snapshot["features"]]
    assert len(rows) == 202, "Re-audit changed source totals before refreshing"
    assert len({row["ObjectId"] for row in rows}) == len(rows)
    with zipfile.ZipFile(county_zip) as archive:
        text = archive.read("2025_Gaz_counties_national.txt").decode("utf-8-sig")
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter="|" if "|" in text.splitlines()[0] else "\t"):
        row = {k.strip(): v.strip() for k, v in raw.items()}
        if row["USPS"] == "IL":
            counties[row["NAME"].removesuffix(" County")] = {
                "lat": float(row["INTPTLAT"]), "lng": float(row["INTPTLONG"])
            }
    result, excluded = [], []
    for row in rows:
        oid = row["ObjectId"]
        if not clean(row["County"]) and all(row[key] is None for key in MEASUREMENTS):
            excluded.append({"sourceTreeId": str(oid), "name": clean(row["name"]), "reason": "Unpopulated species slot: no county or measurements"})
            continue
        source_county = clean(row["County"])
        county = "St. Clair" if source_county == "Saint Clair" else source_county
        assert county in counties, f"Unmatched county for {oid}: {county}"
        scientific, common = clean(row["Species"]), clean(row["Common_name"])
        assert scientific and common
        feet = number(row["Circumference__ft__"])
        name = clean(row["name"])
        notes = []
        if "non-typical form" in name:
            notes.append("The Illinois register identifies this tree as non-typical form.")
        if feet is None:
            notes.append("Circumference is absent from the source; it is not inferred from diameter or points.")
        result.append({
            "id": f"il-{oid}", "state": "IL", "mapPrecision": "county",
            "sourceRow": oid, "sourceTreeId": str(oid), "sourceUrl": f"{LAYER}/{oid}",
            "status": "Illinois co-champion" if "co-champion" in name else "Illinois champion register entry",
            "scientificName": scientific, "commonName": common,
            "county": county, "sourceCounty": source_county, "town": "", "location": None,
            "yearListed": clean(row["Year_listed_Last_measured"]) or None, "measured": None,
            "circumferenceFeet": feet,
            "circumference": round(feet * 12, 5) if feet is not None else None,
            "height": number(row["Height__ft__"]), "crown": number(row["Spread__ft__"]),
            "points": number(row["Total_Points"]), "notes": None,
            **({"sourceReviewNotes": notes} if notes else {}),
        })
    result.sort(key=lambda row: row["sourceRow"])
    used = {row["county"] for row in result}
    assert len(result) == 124 and len(excluded) == 78 and len(used) == 47
    assert sum(row["status"] == "Illinois co-champion" for row in result) == 18
    return result, {county: counties[county] for county in sorted(used)}, excluded


if __name__ == "__main__":
    source = Path(sys.argv[1]).read_bytes()
    records, points, excluded = build(json.loads(source), sys.argv[2])
    audit = {"retrieved": "2026-10-08", "sourceUrl": LAYER, "sourceSha256": hashlib.sha256(source).hexdigest(),
             "sourceRows": 202, "includedRows": len(records), "excludedRows": excluded,
             "circumference": "Source feet preserved; inches field is feet × 12 for cross-state scoring checks.",
             "dates": "Combined Year listed/Last measured retained verbatim; measured remains null."}
    for name, data in [("illinois-champion-trees.json", records), ("illinois-county-points.json", points), ("illinois-import-audit.json", audit)]:
        (OUTPUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(records)} records across {len(points)} counties; excluded {len(excluded)} empty species slots")
