#!/usr/bin/env python3
"""Reproduce the October 7, 2026 Clemson State Champ snapshot.

Usage: python3 scripts/import-south-carolina-champions.py RECORDS.json COUNTIES.zip
RECORDS is the complete non-geometry ArcGIS query documented in README.md.
Only an allowlist of public catalog fields is emitted. No contact, owner,
address, free-text remarks, attachment, or individual-tree geometry is copied.
"""
import csv
import datetime as dt
import io
import json
import math
from pathlib import Path
import sys
import zipfile

LAYER = "https://services1.arcgis.com/x5wCko8UnSi4h0CB/arcgis/rest/services/South_Carolina_Champion_Tree/FeatureServer/0"
OUTPUT = Path(__file__).resolve().parents[1] / "lib/data"


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
    assert len(rows) == 269, "Re-audit changed source totals before updating this snapshot"
    assert len({row["OBJECTID"] for row in rows}) == len(rows)
    selected = [row for row in rows if clean(row["statechamp"]) == "State Champ"]
    assert len(selected) == 196
    with zipfile.ZipFile(county_zip) as archive:
        text = archive.read("2025_Gaz_counties_national.txt").decode("utf-8-sig")
    counties = {}
    for raw in csv.DictReader(io.StringIO(text), delimiter="|" if "|" in text.splitlines()[0] else "\t"):
        row = {k.strip(): v.strip() for k, v in raw.items()}
        if row["USPS"] == "SC":
            counties[row["NAME"].removesuffix(" County")] = {
                "lat": float(row["INTPTLAT"]), "lng": float(row["INTPTLONG"])
            }
    result = []
    for row in selected:
        oid = row["OBJECTID"]
        county = clean(row["tree_county"])
        assert county in counties, f"Unmatched county for record {oid}: {county}"
        common = clean(row["tree_common_name"])
        scientific = clean(row["tree_science_name"])
        assert common and scientific
        timestamp = row["submission_date"]
        source_date = dt.datetime.fromtimestamp(timestamp / 1000, dt.timezone.utc).date().isoformat() if timestamp is not None else None
        flag = clean(row["champion"])
        assert flag in ("", "No", "Neither", "National Champ", "National Co-Champ")
        condition = clean(row["tree_cond"])
        result.append({
            "id": f"sc-{oid}", "sourceRow": oid, "sourceTreeId": str(oid),
            "sourceUrl": f"{LAYER}/{oid}", "status": "State Champ",
            **({"nationalFlag": flag} if flag.startswith("National") else {}),
            "scientificName": scientific, "commonName": common,
            "county": county, "town": "", "location": None,
            "measured": source_date,
            "circumference": number(row["Circumference"]),
            "height": number(row["Height"]), "crown": number(row["Crown"]),
            "points": number(row["Score"]),
            "notes": f"Source-reported condition: {condition}. This is a register observation, not a current inspection." if condition else None,
        })
    result.sort(key=lambda row: row["sourceRow"])
    used = {row["county"] for row in result}
    assert len(used) == 35
    return result, {county: counties[county] for county in sorted(used)}


if __name__ == "__main__":
    records, points = build(json.loads(Path(sys.argv[1]).read_text()), sys.argv[2])
    for name, data in [("south-carolina-champion-trees.json", records), ("south-carolina-county-points.json", points)]:
        (OUTPUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(records)} state-designated champions across {len(points)} counties")
