import csv
import json

def make_json(csvFilePath, jsonFilePath):
    
    data = "const hvezdy = ["
    
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        for rows in csvReader:
            data += json.dumps(rows) + ","

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(data + "{}];")
        
csvFilePath = r'./hygfullSorted.csv'
jsonFilePath = r'starsSorted.js'

make_json(csvFilePath, jsonFilePath)