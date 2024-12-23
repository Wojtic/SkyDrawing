import pandas

csvData = pandas.read_csv("./hygfull.csv") 

csvData.sort_values(["Mag"], 
					axis=0, 
					ascending=[True], 
					inplace=True) 

csvData.to_csv("./hygfullSorted.csv", encoding='utf-8', index=False)

