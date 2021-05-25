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
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [mortality]);

  const mappedAreas = (tweets) => {
    const rows = [];
    Object.keys(tweets).forEach((area) => {
      rows.push(
        <div>
          {Object.keys(tweets).indexOf(area) + 1}
          {' '}
          :
          {' '}
          {area}
        </div>,
      );
    });
    return (
      <div style={{ textAlign: 'left', fontSize: '18px' }}>
        {rows}
      </div>
    );
  };

  return (
    <div className="scenario1-container">
      <h1>
        Scenario 2
      </h1>
      <p>
        We compare the total number of tweets in different areas (SA4) in
        Australia with mortality rates.
        This scenario aims to analyze whether the mortality rates in the SA4 level
        has any effect on number of tweets related to COVID-19. We hypothesize
        that the higher the number of tweets made regarding COVID-19, the higher
        the mortality rate in that area.
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
        For this scenario, we compared the number of COVID-related tweets against two
        different mortality measures – ratio of area to average mortality, and
        crude mortality rate.
      </p>
      <p>
        The two obvious outliers in this scenario are the areas Sydney (point 48)
        and Melbourne (point 29) (kindly refer to the mapping of number IDs to SA4 areas
        at the bottom of this page)
        for a mapping of SA4 areas to number ids). These two areas have
        the highest number of COVID-related tweets but their mortality rates are
        among the lowest. This goes against our hypothesis where we assumed the
        opposite to be true. Apart from Sydney and Melbourne, Adelaide (point 1),
        Brisbane (point 6) and Perth (point 38) were also separated from the
        large cluster sitting close to the x=0 line.
      </p>
      <p>
        This may signify that even though certain SA4 areas have a relatively large
        amount of COVID-related tweets, it may not mean that those areas have
        a higher mortality rate. This could mean that the healthcare professionals
        in these areas may have been incredibly efficient in handling the spread
        of COVID-19, and taking drastic measures to minimize the number of
        deaths caused by the pandemic. Conversely, this may mean that the other
        areas with a higher mortality rate may not have performed as well.
      </p>
      <p>
        That being said, we have to acknowledge that our harvested tweets were
        the raw number rather than a percentage of the all the tweets made in
        each area. We were unable to find data on SA4 population. In addition, the
        large cluster situated close to the x=0 lines in both figures above may
        be due to these areas having less dense population, not to mention that
        not everyone geotags their tweets. Lastly, there could be unknown data
        on other causes of mortality in these areas that display high mortality
        rates. For example, perhaps car accidents due to poorly maintained roads
        in Mid North Coast (point 30) could be the main reason why it has the
        highest mortality rates, instead of COVID-19.
      </p>
      <h2 style={{ textAlign: 'left', fontSize: '24px' }}>
        Map of number IDs to SA4 areas
      </h2>
      {Object.keys(SA4Tweets).length !== 0
          && mappedAreas(SA4Tweets)}
    </div>
  );
}

export default Scenario2;
