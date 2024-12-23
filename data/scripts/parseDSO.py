import csv
import json

IC = []
NGC = []
M = []

def relevantInfo(row, type, id):
    RA = row["RA"].split(":")
    RA = float(RA[0]) + float(RA[1]) / 60 + float(RA[2]) / 3600
    DEC = row["Dec"].split(":")
    sign = 1 if DEC[0][0] == "+" else -1
    DEC = sign*float(DEC[0][1:]) + float(DEC[1]) / 60 + float(DEC[2]) / 3600
    return {
        type: id,
        "RA": RA,
        "Dec": DEC,
        "Type": row["Type"],
        "Const": row["Const"],
        "Names": row["Common names"],
        "Notes": row["NED notes"]
    }

with open("./../NGC.csv", encoding='utf-8') as csvf:
    csvReader = csv.DictReader(csvf, delimiter=";")
    line = 0
    for rows in csvReader:
        if rows["RA"] == "":
            continue
        if rows["M"]:
            M.append(relevantInfo(rows, "M", rows["M"]))
        if rows["Name"][:2] == "IC":
            NGC.append(relevantInfo(rows, "IC", rows["Name"].split(" ")[0][2:]))
        if rows["Name"][:3] == "NGC":
            NGC.append(relevantInfo(rows, "NGC", rows["Name"].split(" ")[0][3:]))

Mjs = "const M = ["
for obj in M:
    Mjs += json.dumps(obj) + ","

with open("./../M.js", 'w', encoding='utf-8') as jsonf:
    jsonf.write(Mjs[:-1]+ "];")

NGCjs = "const NGC = ["
for obj in NGC:
    NGCjs += json.dumps(obj) + ","

with open("./../NGC.js", 'w', encoding='utf-8') as jsonf:
    jsonf.write(NGCjs[:-1]+ "];")

ICjs = "const IC = ["
for obj in IC:
    ICjs += json.dumps(obj) + ","

with open("./../IC.js", 'w', encoding='utf-8') as jsonf:
    jsonf.write(ICjs[:-1]+ "];")