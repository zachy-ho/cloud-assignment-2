import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import couchAPI from '../api';
import styles from './Scenario1.module.scss';
import { StatesEnum } from '../analysis/enum';
import { getTweetFrequencyByState } from '../analysis/dataProcessor';

const states = Object.values(StatesEnum).sort();

function Scenario1() {
  const [stateTweets, setStateTweets] = useState({});

  // Load tweets per state from couchdb mapreduce tweetsPerPlace
  useEffect(() => {
    if (Object.keys(stateTweets).length === 0) {
      couchAPI.get('/_design/tweets/_view/tweetsPerPlace?group=true')
        .then((res) => {
          // Convert to statewide data
          const tweetFreq = getTweetFrequencyByState(res, states);
          setStateTweets(tweetFreq);
          return tweetFreq;
        })
        .then((res) => {
          console.log(res);
          console.log(Object.keys(res));
          console.log(Object.values(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1>
        Scenario 1
      </h1>
      <p>
        We compare the total number of tweets in different states in Australia
        with their unemployment rate.

        The chart below shows the comparison.
      </p>
      {Object.keys(stateTweets).length === 0
        ? (
          <p>
            Preparing data for chart...
          </p>
        )
        : (
          <Plot
            data={[
              {
                x: Object.keys(stateTweets),
                y: Object.values(stateTweets),
                name: 'COVID-related tweets',
                type: 'bar',
                marker: { color: 'orange' },
                offsetgroup: 1,
              },
              {
                x: Object.keys(stateTweets),
                y: [70, 80, 70, 68, 85, 48, 90, 30, 88],
                name: 'Unemployment rate',
                type: 'bar',
                marker: { color: 'blue' },
                yaxis: 'y2',
                offsetgroup: 2,
              },
            ]}
            layout={{
              title: 'Comparing unemployment rate with COVID-related tweets across Australian states',
              width: 960,
              height: 720,
              yaxis: {
                title: 'COVID-related tweets',
                titlefont: {
                  color: 'orange',
                },
                tickfont: {
                  color: 'orange',
                },
              },
              yaxis2: {
                title: 'Unemployment rate (%)',
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

        )}
    </div>
  );
}

export default Scenario1;
