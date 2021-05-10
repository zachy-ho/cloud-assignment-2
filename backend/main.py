import tweepy
import couchdb
import json
import time
from tweepy.streaming import StreamListener as SL
from tweepy import OAuthHandler as OA
from tweepy import Stream
from urllib3.exceptions import ProtocolError
import creds
couch_server=couchdb.Server("http://admin:admin@localhost:5984")
db_nam=input("Enter a name for the database(only lowercase characters):  ")
user_name=input("Enter a name for user database(only lowercase characters):  ")
try:
    db = couch_server.create(db_nam)
except:
    db=couch_server[db_nam]
if user_name in couch_server:
    user_datab = couch_server[user_name]
else:
    user_datab = couch_server.create(user_name)

interested_keywords=['covid19','coronavirus','covid-19','economy','employment','income','covid','pandemic','outbreak','social distancing','community spread','self-isolation',
                     'quarantine','selfquarantine',
                     'self-quarantine','flatten the curve','economycrisis','jobloss','wage','wageloss','socialdistancing',' aid ','financialaid','lockdown',
                     'lock down','oxygen cylinder','oxygen concentrator','oxygen','vaccine','astrazeneca','pfizer','sputnik','fights covid','mutant','double mutant','spike protein',
                     'mypandemicsurvivalplan','quarintineandchill','wfh','remdesivir','steroids']
locat=[113.338953078, -43.6345972634, 153.569469029, -10.6681857235]
class dbListener(SL):
    def on_data(self, raw_data):
        api=tweepy.API(auth,wait_on_rate_limit=True,wait_on_rate_limit_notify=True)
        twt=json.loads(raw_data)
        doc_id=twt["id_str"]
        if twt["place"] is not None:
            if doc_id not in db and twt["lang"]=="en" and twt["place"]["full_name"]!="null" and twt["place"]["bounding_box"]!="null":
                for i in interested_keywords:
                    if i in twt["text"].lower():
                        db[doc_id]={"id_str":twt["id_str"],"text":twt["text"],"Date":twt["created_at"],
                    "User_Details":twt["user"],
                    "Place":twt["place"]["full_name"],
                    "Bounding Box":twt["place"]["bounding_box"],
                    "retweeted":twt["retweeted"],
                    "hashtags_details":twt["entities"]["hashtags"],
                    "lang":twt["lang"]}
        user_id=twt["user"]["id_str"]
        if user_id not in user_datab:
            try:
                
                for i in tweepy.Cursor(api.user_timeline,user_id).items(200):
                    tweet=i._json
                    if tweet["place"] is not None:
                        cc_tweet=(tweet["place"]["country_code"]).lower()
                        country=(tweet["place"]["country"]).lower()
                        if cc_tweet=="au" or country=="australia":
                            if tweet["id_str"] not in db and tweet["lang"]=="en" and tweet["place"]["full_name"]!="null" and tweet["place"]["bounding_box"]!="null":
                                for j in interested_keywords:
                                    if j in tweet["text"].lower():
                                        db[tweet["id_str"]]={"id_str":tweet["id_str"],
                                    "text":tweet["text"],
                                    "Date":tweet["created_at"],
                                    "User_Details":tweet["user"],
                                    "Place":tweet["place"]["full_name"],
                                    "Bounding Box":tweet["place"]["bounding_box"],
                                    "retweeted":tweet["retweeted"],
                                    "hashtags_details":tweet["entities"]["hashtags"],
                                    "lang":tweet["lang"]}
                                        user_datab[user_id] = {"user_":tweet["user"]["screen_name"]}
                                    
            except couchdb.http.ResourceConflict:
                time.sleep(5)
            except BaseException as e:
                print(e)
                time.sleep(5)
            

        return True
def on_error(self, status_code):
    print(status_code)



if __name__=="__main__":
 auth=OA(creds.consumer_key,creds.consumer_secret)
 auth.set_access_token(creds.access_token,creds.access_token_secret)
 listener=dbListener()
 while True:
     try:
         stream=Stream(auth, listener)
         stream.filter(locations=locat)
     except ProtocolError:
        continue