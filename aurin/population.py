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

class popReader:
    def popPusher(self):
        data = pd.read_csv('Australia_pop.csv')
        for index, row in data.iterrows():
            subDict={}
            subDict['State'] = row['States']
            temp = row['2020'].replace(",","")
            subDict["pop"] = int(temp)
            db.save(subDict)



if __name__== __name__:
    popPush = popReader()
    popReader.popPusher()
