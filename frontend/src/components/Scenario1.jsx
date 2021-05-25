import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import couchAPI from '../api';
import './Scenario.css';
import { StatesEnum } from '../analysis/enum';
import { getTweetFrequencyByArea, getEmploymentRateByState, getPopulationData } from '../analysis/dataProcessor';
import { couchdbTweetsName, couchdbAurinLabour, couchdbPopulationName } from '../config/couchdb';

const states = Object.values(StatesEnum).sort();

function Scenario1() {
  const [stateTweets, setStateTweets] = useState({});
  const [stateEmployment, setStateEmployment] = useState({});

  // Load tweets per state from couchdb mapreduce tweetsPerPlace
  useEffect(() => {
    if (Object.keys(stateTweets).length === 0) {
      const promises = [
        couchAPI.get(`${couchdbTweetsName}/_design/tweets/_view/tweetsPerPlace?group=true`),
        couchAPI.get(`${couchdbPopulationName}/_design/population/_view/allStates`),
      ];

      Promise.all(promises)
        .then((res) => {
          // Convert to statewide data
          const tweetFreq = getTweetFrequencyByArea(res[0], states);
          const popData = getPopulationData(res[1]);

          {
            const averagedFreq = {};
            Object.keys(tweetFreq).forEach((entry) => {
              averagedFreq[entry] = tweetFreq[entry] / popData[entry];
            });
            setStateTweets(averagedFreq);
          }

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
        In this scenario, we analyze whether there is a correlation between
        unemployment rates and the number of COVID-related tweets (averaged over
        population) across Australian states. We hypothesize that there is a
        higher number of COVID-related tweets per population in states that have lower
        employment rates as we theorize that people are more concerned about
        COVID-19 if it affects their livelihood (i.e. employment).
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
              title: 'Comparing employment rate with COVID-related tweets (per population) across Australian states',
              width: 1080,
              height: 640,
              xaxis: {
                tickangle: 20,
              },
              yaxis: {
                title: 'COVID-related tweets (per population)',
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
                range: [68, 76],
                overlaying: 'y',
                side: 'right',
              },
            }}
          />
        )}
      <p>
        In this scenario, we analyze whether there is a correlation between unemployment
        rates and the number of COVID-related tweets (averaged over population)
        across Australian states. We hypothesize that there is a higher number
        of COVID-related tweets per population in states that have lower
        employment rates as we theorize that people are more concerned about
        COVID-19 if it affects their livelihood (i.e. employment).
      </p>
      <p>
        South Australia, Victoria and  Tasmania has the highest number of
        COVID-related tweets per population. However, their
        employment rates vary drastically. Tasmania had the lowest employment
        rates across the states. Perhaps people living there are truly more
        concerned about COVID-19 and its effect on job security (I.e. having a
        higher number of COVID-related tweets) since their employment rate was
        the lowest.
      </p>
      <p>
        Victoria has the second highest employment rate even though it is one of the
        states with a high number of COVID-related tweets per population.
        Victorians may instead be more concerned about the effects of COVID-19
        on aspects of life other than employment. Another reason could be that
        Victoria has a higher population of young adults compared to other
        states, who tend to use Twitter more than other age groups (I.e.
        elderly, children)
      </p>
      <p>
        Most other states seem to exhibit a more neutral behaviour, not explicitly
        showing signs of aligning with our hypothesis. Apart from Tasmania,
        Western Australia seems to be the only other state that agree with our
        hypothesis. It has the highest employment rate but has one of the lowest
        scores for COVID-related tweets per population. Western Australia is
        known to have handled the pandemic rather well compared to states like
        Victoria. That may be a core reason why residents there may be less
        concerned about COVID-19&apos;s effects on employment!
      </p>
    </div>
  );
}

export default Scenario1;
