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

file = open("DESE_-_Labour_Market_-_Summary_Data__SA4__December_2020.json/data2884855105501059863.json")
cities = ['Sydney', 'Melbourne', 'Brisbane', 'Moreton Bay', 'Adelaide', 'Perth']
count = {'Sydney':0, 'Melbourne':0, 'Brisbane':0, 'Moreton Bay':0, 'Adelaide':0, 'Perth':0}
sum = {'Sydney':0, 'Melbourne':0, 'Brisbane':0, 'Moreton Bay':0, 'Adelaide':0, 'Perth':0}
aurin = json.load(file)
flag = False
data = {}
file.close()
for feature in aurin['features']:
    for city in cities:
        if city in feature['properties']['sa4_name_2016']:
            count[city] += 1
            sum[city] += float(feature['properties']['unemp_rt_15'])
            flag = True
    if not flag:
        data[feature['properties']['sa4_name_2016']] = float(feature['properties']['unemp_rt_15'])
for city in cities:
    sum[city] = sum[city]/count[city]
    data[city] = sum[city]
db.save(data)


