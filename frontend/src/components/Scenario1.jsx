import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import couchAPI from '../api';
import './Scenario.css';
import { StatesEnum } from '../analysis/enum';
import { getTweetFrequencyByArea, getEmploymentRateByState } from '../analysis/dataProcessor';
import { couchdbTweetsName, couchdbAurinLabour } from '../config/couchdb';

const states = Object.values(StatesEnum).sort();

function Scenario1() {
  const [stateTweets, setStateTweets] = useState({});
  const [stateEmployment, setStateEmployment] = useState({});

  // Load tweets per state from couchdb mapreduce tweetsPerPlace
  useEffect(() => {
    if (Object.keys(stateTweets).length === 0) {
      couchAPI.get(`${couchdbTweetsName}/_design/tweets/_view/tweetsPerPlace?group=true`)
        .then((res) => {
          // Convert to statewide data
          const tweetFreq = getTweetFrequencyByArea(res, states);
          setStateTweets(tweetFreq);
          return tweetFreq;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // Load unemployment rate from couchdb mapreduce
  useEffect(() => {
    if (Object.keys(stateEmployment).length === 0) {
      couchAPI.get(`${couchdbAurinLabour}/_design/unemployment/_view/employmentRateByState?group=true`)
        .then((res) => {
          // Convert to obj
          const unemploymentRates = getEmploymentRateByState(res, states);
          setStateEmployment(unemploymentRates);
          return unemploymentRates;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  []);

  return (
    <div className="scenario1-container">
      <h1>
        Scenario 1
      </h1>
      <p>
        We compare the total number of COVID-related tweets in different states in Australia
        with their employment rate.
      </p>
      <p>
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
        We formulate a hypothesis that places (states) with higher employment
        rates tend to tweet about COVID less. This is based on the assumption
        that people worry less about the effects of COVID if their livelihood
        (i.e. employment) is seemingly unaffected.
      </p>
      <p>
        From the data above, we can see that ... (waiting for Agrim to fix
        the wrongly saved data)
      </p>
      <h3>
        Assumptions and other notes on data
      </h3>
      <p>
        We must acknowledge that the comparison made in this scenario
        disregards a lot of different factors that affect employment rate. For
        example, we did not consider data on the homeless across states. We
        also did not look at the number of professionals across different
        industries and compare them with the what the demand is. This data can
        vary from state to state as well.
      </p>
      <p>
        On the other hand, we are taking the raw number of COVID-related tweets
        instead of taking a percentage of COVID-related tweets over the total
        number of tweets over a specific period for each state. Thus, the data
        on the total number of tweets can be influenced by the distribution of
        young adults (which we assume is the group that tends to tweet the most)
        across states.
      </p>
    </div>
  );
}

export default Scenario1;
