import json
import pandas as pd
import couchdb
from aurinSettings import host_ip, couchdb_name

couch_server=couchdb.Server("http://admin:admin@"+host_ip+":5984")
db_nam=couchdb_name

try:
    db = couch_server.create(db_nam)
except:
    db=couch_server[db_nam]

user_datab=[]

class dataPusher:

    def pusher(self):
        file = open("AIHW_Mortality/data3122319362349140854.json")
        cities = ['Sydney', 'Melbourne', 'Brisbane', 'Moreton Bay', 'Adelaide', 'Perth']
        aggregator = {'Sydney':{'p_rt_ratio':[0,0], 'p_crude_rt':[0,0]}, 'Melbourne':{'p_rt_ratio':[0,0], 'p_crude_rt':[0,0]}, \
         'Brisbane':{'p_rt_ratio':[0,0], 'p_crude_rt':[0,0]}, 'Moreton Bay':{'p_rt_ratio':[0,0], 'p_crude_rt':[0,0]}, \
         'Adelaide':{'p_rt_ratio':[0,0], 'p_crude_rt':[0,0]}, 'Perth':{'p_rt_ratio':[0,0], 'p_crude_rt':[0,0]}}
        aurin = json.load(file)
        flag = False
        data = {}
        file.close()
        for feature in aurin['features']:
            subDict = {}
            for city in cities:
                if city in feature['properties']['sa4_name']:
                    aggregator[city]['p_crude_rt'][0] += 1
                    aggregator[city]['p_rt_ratio'][0] += 1
                    aggregator[city]['p_crude_rt'][1] += float(feature['properties']['p_crude_rt'])
                    aggregator[city]['p_rt_ratio'][1] += float(feature['properties']['p_rt_ratio'])
                    flag = True
            if not flag:
                subDict['p_crude_rt'] = float(feature['properties']['p_crude_rt'])
                subDict['p_rt_ratio'] = float(feature['properties']['p_rt_ratio'])
                subDict["sa4_name"] = feature['properties']['sa4_name']
                db.save(subDict)
                data[feature['properties']['sa4_name']] = subDict
            flag = False
        for city in cities:
            subDict = {}
            subDict['p_crude_rt'] = aggregator[city]['p_crude_rt'][1]/aggregator[city]['p_crude_rt'][0]
            subDict['p_rt_ratio'] = aggregator[city]['p_rt_ratio'][1]/aggregator[city]['p_rt_ratio'][0]
            subDict["sa4_name"] = city
            db.save(subDict)


if __name__== __name__:
    pushing = dataPusher()
    pushing.pusher()
