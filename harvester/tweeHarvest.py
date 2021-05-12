from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import API
from tweepy import Cursor
import credential

class StdOutListener(StreamListener):

    def on_data(self, data):
        print(data)
        return True
    
    def on_error(self, status):
        print(status)

if __name__=="__main__":

    listener = StdOutListener()
    auth = OAuthHandler(credential.api_key, credential.api_secret)
    auth.set_access_token(credential.access_token, credential.access_secret)

    # stream = Stream(auth, listener)

    # stream.filter(track=['melbourne'])

    api = API(auth)
    places = api.geo_search(query='Australia', granularity="country")
    place_id = places[0].id
    tweets = api.search(q=(['crime']) and ("place:%s" % place_id))

    # for tweet in Cursor(api.search(q=(['crime']) and ("place:%s" % place_id)), lang="English").items(5):
    #     tweets.append(tweet)
    print(tweets)
