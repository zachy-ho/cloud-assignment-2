import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import couchAPI from '../api';
import {
  getMortalityRatesBySA4, getTweetFrequencyByArea, getNumTweets,
  getMortalityRatio, getCrudeMortality,
} from '../analysis/dataProcessor';
import { couchdbMortalityName, couchdbTweetsName } from '../config/couchdb';
import './Scenario.css';

function Scenario2() {
  const [SA4Tweets, setSA4Tweets] = useState({});
  const [mortality, setMortality] = useState({});

  useEffect(() => {
    if (Object.keys(mortality).length === 0) {
      couchAPI.get(`${couchdbMortalityName}/_design/mortality/_view/mortalityBySA4`)
        .then((res) => {
          // Store in moratlity object
          const mortalityRates = getMortalityRatesBySA4(res);
          setMortality(mortalityRates);
          return mortalityRates;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(mortality).length >= 0) {
      if (Object.keys(SA4Tweets).length === 0) {
        couchAPI.get(`${couchdbTweetsName}/_design/tweets/_view/tweetsPerPlace?group=true`)
          .then((res) => {
          // Convert to SA4-wide data
            const tweetFreq = getTweetFrequencyByArea(res, Object.keys(mortality));
            setSA4Tweets(tweetFreq);
            return tweetFreq;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [mortality]);

  return (
    <div className="scenario1-container">
      <h1>
        Scenario 2
      </h1>
      <p>
        We compare the total number of tweets in different areas (SA4) in
        Australia with the mortality rate.
      </p>
      <p>
        The chart below shows the comparison.
      </p>
      {(Object.keys(SA4Tweets).length === 0
        && Object.keys(mortality).length === 0
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
                x: getNumTweets(SA4Tweets, true),
                y: getMortalityRatio(mortality, true),
                name: 'SA4 areas',
                mode: 'text+markers',
                type: 'scatter',
                text: Object.keys(SA4Tweets).map(
                  (entry) => (Object.keys(SA4Tweets).indexOf(entry) + 1),
                ),
                textposition: 'top center',
              }]}
            layout={{
              title: 'Comparing \'area mortality\':\'average mortality\' ratio with COVID-related tweets across Australian SA4 areas',
              width: 1280,
              height: 720,
              xaxis: {
                title: 'Number of COVID-related tweets',
              },
              yaxis: {
                title: 'Ratio of area death rate to average death rate',
              },
            }}
          />

        )}
      <p>
        A hypothesis can be made that places (states) with higher employment
        rates tend to tweet about COVID less. Perhaps society worries less about
        the effects of COVID if their livelihood (i.e. employment) is unaffected
        .
      </p>
      <p>
        However, the data used for this comparison here does not take into
        acocunt the total number of tweets made in each state. Thus, there is
        no comparison on the ratio of COVID-related vs. non COVID-related tweets
        . This means that a higher number COVID-related tweets may come from
        states that have a higher/denser population. This scenario also does
        not consider the percentage of youth among each states&apos; population.
        This is significant as it can be assumed that youths tend to tweet more
        than other age groups (e.g. older people).
      </p>
      {(Object.keys(SA4Tweets).length === 0
        && Object.keys(mortality).length === 0
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
                x: getNumTweets(SA4Tweets, true),
                y: getCrudeMortality(mortality, true),
                name: 'SA4 areas',
                mode: 'text+markers',
                type: 'scatter',
                text: Object.keys(SA4Tweets).map(
                  (entry) => (Object.keys(SA4Tweets).indexOf(entry) + 1),
                ),
                textposition: 'top center',
              }]}
            layout={{
              title: 'Comparing crude mortality rate (deaths per 100000 people) with COVID-related tweets across Australian SA4 areas',
              width: 1280,
              height: 720,
              xaxis: {
                title: 'Number of COVID-related tweets',
              },
              yaxis: {
                title: 'Crude mortality rate (deaths per 100000 people)',
              },
            }}
          />
        )}
      <p>
        Some explanation to be filled after clarification with Agrim.
      </p>
    </div>
  );
}

export default Scenario2;
