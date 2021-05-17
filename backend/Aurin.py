import json
import pandas as pd
import couchdb

couch_server=couchdb.Server("http://admin:admin@localhost:5984")
db_nam=input("Enter a name for the database(only lowercase characters):  ")

try:
    db = couch_server.create(db_nam)
except:
    db=couch_server[db_nam]

user_datab=[]

class dataLoader:

    def loader(self):
        file = open("DESE_-_Labour_Market_-_Summary_Data__SA4__December_2020.json/data2884855105501059863.json")
        cities = ['Sydney', 'Melbourne', 'Brisbane', 'Moreton Bay', 'Adelaide', 'Perth']
        count = {'Sydney':0, 'Melbourne':0, 'Brisbane':0, 'Moreton Bay':0, 'Adelaide':0, 'Perth':0}
        sum = {'Sydney':0, 'Melbourne':0, 'Brisbane':0, 'Moreton Bay':0, 'Adelaide':0, 'Perth':0}
        aggregator = {'Sydney':{'unemp_rt_15':[0,0], 'mpy_rt_15_64':[0,0], 'yth_unemp_rt_15_24':[0,0], 'state':""}, 'Melbourne':{'unemp_rt_15':[0,0], 'mpy_rt_15_64':[0,0], 'yth_unemp_rt_15_24':[0,0], 'state':""}, \
         'Brisbane':{'unemp_rt_15':[0,0], 'mpy_rt_15_64':[0,0], 'yth_unemp_rt_15_24':[0,0], 'state':""}, 'Moreton Bay':{'unemp_rt_15':[0,0], 'mpy_rt_15_64':[0,0], 'yth_unemp_rt_15_24':[0,0], 'state':""}, \
         'Adelaide':{'unemp_rt_15':[0,0], 'mpy_rt_15_64':[0,0], 'yth_unemp_rt_15_24':[0,0], 'state':""}, 'Perth':{'unemp_rt_15':[0,0], 'mpy_rt_15_64':[0,0], 'yth_unemp_rt_15_24':[0,0], 'state':""}}
        aurin = json.load(file)
        flag = False
        data = {}
        file.close()
        for feature in aurin['features']:
            subDict = {}
            for city in cities:
                if city in feature['properties']['sa4_name_2016']:
                    aggregator[city]['unemp_rt_15'][0] += 1
                    aggregator[city]['yth_unemp_rt_15_24'][0] += 1
                    aggregator[city]['mpy_rt_15_64'][0] += 1
                    aggregator[city]['unemp_rt_15'][1] += float(feature['properties']['unemp_rt_15'])
                    aggregator[city]['yth_unemp_rt_15_24'][1] += float(feature['properties']['yth_unemp_rt_15_24'])
                    aggregator[city]['mpy_rt_15_64'][1] += float(feature['properties']['mpy_rt_15_64'])
                    aggregator[city]['state'] = feature['properties']["state_name_2016"]
                    flag = True
            if not flag:
                subDict['unemp_rt_15'] = float(feature['properties']['unemp_rt_15'])
                subDict['yth_unemp_rt_15_24'] = float(feature['properties']['unemp_rt_15'])
                subDict['mpy_rt_15_24'] = float(feature['properties']['unemp_rt_15'])
                subDict['state_name_2016'] = feature['properties']["state_name_2016"]
                data[feature['properties']['sa4_name_2016']] = subDict
        for city in cities:
            subDict = {}
            subDict['unemp_rt_15'] = aggregator[city]['unemp_rt_15'][1]/aggregator[city]['unemp_rt_15'][0]
            subDict['yth_unemp_rt_15_24'] = aggregator[city]['yth_unemp_rt_15_24'][1]/aggregator[city]['yth_unemp_rt_15_24'][0]
            subDict['mpy_rt_15_24'] = aggregator[city]['mpy_rt_15_64'][1]/aggregator[city]['mpy_rt_15_64'][0]
            subDict['state_name_2016'] = aggregator[city]['state']
            data[city] = subDict
        db.save(db_doc)

if __name__== __name__:
    loading = dataLoader()
    loading.loader()
