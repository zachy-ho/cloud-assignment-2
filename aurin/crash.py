import pandas as pd
import couchdb
from aurinSettings import host_ip, couchdb_mortality_name

couch_server=couchdb.Server("http://admin:admin@"+host_ip+":5984")
db_nam=couchdb_mortality_name

try:
    db = couch_server.create(db_nam)
except:
    db=couch_server[db_nam]

user_datab=[]

class crashReader:
    def crashes(self):
        data = pd.read_csv('ardd_fatalities_apr_2021.csv', low_memory=False)
        data = data[data.Year.isin([2020,2021])]
        data = data[["State", "Month", "Year", "Crash ID"]]
        data = data.groupby(['Year','Month', 'State']).size()
        for key, values in data.items():
            print(key , values)
            subDict = {}
            subDict["State"] = key[2]
            subDict["Month"] = key[1]
            subDict["Year"] = key[0]
            subDict["Count"] = values
            db.save(subDict)

if __name__== __name__:
    read = crashReader()
    read.crashes()