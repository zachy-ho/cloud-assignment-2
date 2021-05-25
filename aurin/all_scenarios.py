import json
import pandas as pd
import couchdb
from aurinSettings import host_ip, couchdb_labour_name, couchdb_mortality_name, couchdb_crash_name, couchdb_population_name

couch_server = couchdb.Server("http://admin:admin@"+host_ip+":5984")
db_1_nam = couchdb_labour_name
db_2_nam = couchdb_mortality_name
db_3_nam = couchdb_crash_name
db_4_nam = couchdb_population_name

try:
    db1 = couch_server.create(db_1_nam)
except:
    db1 = couch_server[db_1_nam]

try:
    db2 = couch_server.create(db_2_nam)
except:
    db2 = couch_server[db_2_nam]

try:
    db3 = couch_server.create(db_3_nam)
except:
    db3 = couch_server[db_3_nam]

try:
    db4 = couch_server.create(db_4_nam)
except:
    db4 = couch_server[db_4_nam]

class dataLoader:

    def loader(self):

        # labour-db
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
                subDict['yth_unemp_rt_15_24'] = float(feature['properties']['yth_unemp_rt_15_24'])
                subDict['mpy_rt_15_64'] = float(feature['properties']['mpy_rt_15_64'])
                subDict['state_name_2016'] = feature['properties']["state_name_2016"]
                subDict["sa4_name_2016"] = feature['properties']['sa4_name_2016']
                db1.save(subDict)
                data[feature['properties']['sa4_name_2016']] = subDict
            flag = False
        for city in cities:
            subDict = {}
            subDict['unemp_rt_15'] = aggregator[city]['unemp_rt_15'][1]/aggregator[city]['unemp_rt_15'][0]
            subDict['yth_unemp_rt_15_24'] = aggregator[city]['yth_unemp_rt_15_24'][1]/aggregator[city]['yth_unemp_rt_15_24'][0]
            subDict['mpy_rt_15_64'] = aggregator[city]['mpy_rt_15_64'][1]/aggregator[city]['mpy_rt_15_64'][0]
            subDict['state_name_2016'] = aggregator[city]['state']
            subDict["sa4_name_2016"] = city
            db1.save(subDict)
            data[city] = subDict

        # mortality-db
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
                db2.save(subDict)
                data[feature['properties']['sa4_name']] = subDict
            flag = False
        for city in cities:
            subDict = {}
            subDict['p_crude_rt'] = aggregator[city]['p_crude_rt'][1]/aggregator[city]['p_crude_rt'][0]
            subDict['p_rt_ratio'] = aggregator[city]['p_rt_ratio'][1]/aggregator[city]['p_rt_ratio'][0]
            subDict["sa4_name"] = city
            db2.save(subDict)

        # crush-db
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
            db3.save(subDict)
        
        # population-db
        data = pd.read_csv('Australia_pop.csv')
        for index, row in data.iterrows():
            subDict={}
            subDict['State'] = row['States']
            temp = row['2020'].replace(",","")
            subDict["pop"] = int(temp)
            db4.save(subDict)

if __name__== __name__:
    loading = dataLoader()
    loading.loader()
