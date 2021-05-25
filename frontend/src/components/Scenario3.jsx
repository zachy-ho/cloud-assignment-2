import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import couchAPI from '../api';
import { couchdbCrashName, couchdbTweetsName } from '../config/couchdb';
import { mapify } from '../analysis/dataProcessor';
import './Scenario.css';

function Scenario3() {
  const [vicTweets, setVicTweets] = useState(null);
  const [nswTweets, setNswTweets] = useState(null);
  const [vicCrashes, setVicCrashes] = useState(null);
  const [nswCrashes, setNswCrashes] = useState(null);

  // Get crashes ([[month, year], count])
  useEffect(() => {
    const crashPromises = [];
    if (vicCrashes === null) {
      crashPromises.push(
        couchAPI.get(`${couchdbCrashName}/_design/crashes/_view/vicByMonth`),
      );
    }
    if (nswCrashes === null) {
      crashPromises.push(
        couchAPI.get(`${couchdbCrashName}/_design/crashes/_view/nswByMonth`),
      );
    }

    Promise.all(crashPromises)
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.length; i += 1) {
          if (res[i].status === 200) {
            rows = res[i].data.rows;
            const urlSegs = res[i].config.url.split('/');
            if (urlSegs[urlSegs.length - 1] === 'vicByMonth') {
              setVicCrashes(mapify(rows));
            } else {
              setNswCrashes(mapify(rows));
            }
          }
        }
      });
  }, [vicCrashes, nswCrashes]);

  // Get VIC tweets ([[month, year], count])
  useEffect(() => {
    const tweetPromises = [];
    if (vicTweets === null) {
      tweetPromises.push(
        couchAPI.get(`${couchdbTweetsName}/_design/tweets/_view/vicTweetsFrom2020ByMonth?group=true`),
      );
    }
    if (nswTweets === null) {
      tweetPromises.push(
        couchAPI.get(`${couchdbTweetsName}/_design/tweets/_view/nswTweetsFrom2020ByMonth?group=true`),
      );
    }

    Promise.all(tweetPromises)
      .then((res) => {
        let rows = [];
        for (let i = 0; i < res.length; i += 1) {
          if (res[i].status === 200) {
            rows = res[i].data.rows;
            const urlSegs = res[i].config.url.split('/');
            if (urlSegs[urlSegs.length - 1] === 'vicTweetsFrom2020ByMonth?group=true') {
              setVicTweets(mapify(rows));
            } else {
              setNswTweets(mapify(rows));
            }
          }
        }
      });
    // console.log(...nswTweets.keys());
    // console.log(...nswTweets.values());
  }, [vicTweets, nswTweets]);

  // Get NSW tweets

  return (
    <div className="scenario1-container">
      <h1>
        Scenario 3
      </h1>
      <p>
        This scenario looks at whether there are trends in car crashes from 2020
        to 2021 (present) in Victoria and New South Wales when compared with
        the number of COVID-related tweets (representing the pandemic timeline).
      </p>
      <p>
        The scatter plots below shows the comparison.
      </p>
      {
      (vicCrashes === null || vicTweets === null)
        ? (
          <p>
            Preparing data for VIC plot...
          </p>
        )
        : (
          <Plot
            data={
                [{
                  x: [...vicCrashes.keys()].map((i) => i.toString()),
                  y: [...vicCrashes.values()],
                  name: 'Number of crashes',
                  type: 'scatter',
                  marker: { color: 'orange' },
                  offsetgroup: 1,
                },
                {
                  x: [...vicTweets.keys()].map((i) => i.toString()),
                  y: [...vicTweets.values()],
                  name: 'Number of COVID-related tweets',
                  type: 'scatter',
                  marker: {
                    color: 'blue',
                  },
                  yaxis: 'y2',
                  offsetgroup: 2,
                },
                ]
              }
            layout={{
              title: 'Comparing vehicle crashes with COVID-related tweets in VIC from 2020-2021',
              width: 1080,
              height: 640,
              legend: {
                orientation: 'h',
              },
              xaxis: {
                type: 'category',
                tickangle: 20,
              },
              yaxis: {
                title: 'Number of crashes',
                titlefont: {
                  color: 'orange',
                },
                tickfont: {
                  color: 'orange',
                },
              },
              yaxis2: {
                title: 'Number of COVID-related tweets',
                titlefont: {
                  color: 'blue',
                },
                tickfont: {
                  color: 'blue',
                },
                overlaying: 'y',
                side: 'right',
              },
            }}
          />

        )
      }
      <p>
        An assumption we are making for this scenario is that the number of
        COVID-related tweets represent how much society is affected by COVID-19
        (i.e. a higher number = potentially more cases = more lockdown restrictions).
        Following this, we assume the usage of vehicles to travel is lower during
        periods when there are more restrictions.
        Thus, we hypothesize that the higher the number of COVID-related tweets, the lower
        the number of crashes.
      </p>
      <p>
        Looking at the number of crashes (orange in above plot), we see three obvious
        spikes. They are in March 2020, October 2020 and March 2021. This roughly
        aligns, respectively, with the start of the pandemic-induced lockdowns, the first big
        loosening of lockdown restrictions, and when lockdown restrictions are
        further loosened to almost going back to &apos;normal life&apos; (masks not required
        outdoors).
      </p>
      <p>
        The number of COVID-related tweets seem to show a trend that
        does not align with our first assumption. Q2 to Q3 of 2020 were when there
        were most active cases of COVID-19, and the pandemic has &apos;slowed down
        &apos; since December 2020. However, we see that February, April and May
        2021 were the months that had the most COVID-related tweets. Perhaps this
        is due to the introduction of COVID vaccines instead.
      </p>
      <p>
        We can conclude that for Victoria, there is no inverse relationship
        between the number of COVID-related tweets and number of crashes.
        In fact, if we look at the spikes of both number of COVID-related tweets
        and number of crashes around March 2020 and March 2021, we may even
        assume that these two show a more direct relationship instead.
      </p>
      {
      (nswCrashes === null || nswTweets === null)
        ? (
          <p>
            Preparing data for NSW plot...
          </p>
        )
        : (
          <Plot
            data={
                [{
                  x: [...nswCrashes.keys()].map((i) => i.toString()),
                  y: [...nswCrashes.values()],
                  name: 'Number of crashes',
                  type: 'scatter',
                  marker: { color: 'orange' },
                  offsetgroup: 1,
                },
                {
                  x: [...nswTweets.keys()].map((i) => i.toString()),
                  y: [...nswTweets.values()],
                  name: 'Number of COVID-related tweets',
                  type: 'scatter',
                  marker: {
                    color: 'blue',
                  },
                  yaxis: 'y2',
                  offsetgroup: 2,
                },
                ]
              }
            layout={{
              title: 'Comparing vehicle crashes with COVID-related tweets in NSW from 2020-2021',
              width: 1080,
              height: 640,
              legend: {
                orientation: 'h',
              },
              xaxis: {
                type: 'category',
                tickangle: 20,
              },
              yaxis: {
                title: 'Number of crashes',
                titlefont: {
                  color: 'orange',
                },
                tickfont: {
                  color: 'orange',
                },
              },
              yaxis2: {
                title: 'Number of COVID-related tweets',
                titlefont: {
                  color: 'blue',
                },
                tickfont: {
                  color: 'blue',
                },
                overlaying: 'y',
                side: 'right',
              },
            }}
          />

        )
      }
      <p>
        New South Wales seems to exhibit more drastic shifts from month to month
        in terms of car crashes. We see spikes in February, September and November
        of 2020, as well as February 2021. This may be due to the state implementing
        changes in lockdown restrictions more frequently than Victoria did.
      </p>
      <p>
        The number of COVID-related tweets show a more steady upward trend instead.
        Once again, we can interpret this as our initial assumption of tweets
        representing the negative effect of COVID-19 on society to be wrong, or
        at least incomplete. With the trend shown by New South Wales, we may make
        an educated guess that the small spikes in March 2020 and December 2020
        align with the start of the pandemic and Australia&apos;s overall successful
        progress with minimizing active cases respectively. On the other hand,
        the large spike in May 2021 may be due to vaccines being rolled out.
      </p>
      <p>
        Similar to Victoria, there seem to be no inverse relationship
        between the number of COVID-related tweets and number of crashes
        in New South Wales.
      </p>
    </div>
  );
}

export default Scenario3;
