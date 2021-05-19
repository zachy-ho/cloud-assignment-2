import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import couchAPI from '../api';
import styles from './Scenario1.module.scss';
import { StatesEnum } from '../analysis/enum';
import { getTweetFrequencyByState, getEmploymentRateByState } from '../analysis/dataProcessor';

const states = Object.values(StatesEnum).sort();

function Scenario1() {
  const [stateTweets, setStateTweets] = useState({});
  const [stateEmployment, setStateEmployment] = useState({});

  // Load tweets per state from couchdb mapreduce tweetsPerPlace
  useEffect(() => {
    if (Object.keys(stateTweets).length === 0) {
      couchAPI.get('tweets-db/_design/tweets/_view/tweetsPerPlace?group=true')
        .then((res) => {
          // Convert to statewide data
          const tweetFreq = getTweetFrequencyByState(res, states);
          setStateTweets(tweetFreq);
          return tweetFreq;
        })
        .then((res) => {
          console.log('tweets');
          console.log(res);
          console.log(Object.keys(res));
          console.log(Object.values(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // Load unemployment rate from couchdb mapreduce
  useEffect(() => {
    if (Object.keys(stateEmployment).length === 0) {
      couchAPI.get('aurin-db/_design/unemployment/_view/employmentRateByState?group=true')
        .then((res) => {
          // Convert to obj
          const unemploymentRates = getEmploymentRateByState(res, states);
          setStateEmployment(unemploymentRates);
          return unemploymentRates;
        })
        .then((res) => {
          console.log('Aurin');
          console.log(res);
          console.log(Object.keys(res));
          console.log(Object.values(res));
        });
    }
  },
  []);

  return (
    <div className={styles.container}>
      <h1>
        Scenario 1
      </h1>
      <p>
        We compare the total number of tweets in different states in Australia
        with their employment rate.

        The chart below shows the comparison.
      </p>
      {(Object.keys(stateTweets).length === 0
        && Object.keys(stateEmployment).length === 0
      )
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
                y: Object.values(stateEmployment),
                name: 'Employment rate',
                type: 'bar',
                marker: { color: 'blue' },
                yaxis: 'y2',
                offsetgroup: 2,
              },
            ]}
            layout={{
              title: 'Comparing employment rate with COVID-related tweets across Australian states',
              width: 1280,
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
                title: 'Employment rate (%)',
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
      <p>
        A hypothesis can be made that places (states) with higher employment
        rates tend to tweet about COVID less. Perhaps society worries less about
        the effects of COVID if their livelihood (i.e. employment) is unaffected
        .

        However, the data used for this comparison here does not take into
        acocunt the total number of tweets made in each state. Thus, there is
        no comparison on the ratio of COVID-related vs. non COVID-related tweets
        . This means that a higher number COVID-related tweets may come from
        states that have a higher/denser population. This scenario also does
        not consider the percentage of youth among each states&apos; population.
        This is significant as it can be assumed that youths tend to tweet more
        than other age groups (e.g. older people).
      </p>
    </div>
  );
}

export default Scenario1;
