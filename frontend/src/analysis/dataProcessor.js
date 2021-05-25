/* eslint-disable import/prefer-default-export */

// Helpers
const initializeDict = (keys, value) => {
  const dict = {};
  for (let i = 0; i < keys.length; i += 1) {
    dict[keys[i]] = value;
  }
  return dict;
};

export const getTweetFrequencyByArea = (couchData, areas) => {
  const tweetFreq = initializeDict(areas, 0);

  // Formulate object with state names and sum of tweets
  const tweets = couchData.data.rows;
  for (let i = 0; i < tweets.length; i += 1) {
    const locations = tweets[i].key.split(',').map((item) => item.trim().toLowerCase());
    let locationIndex = 0;

    if (locations.some((item) => {
      locationIndex = areas.map((area) => area.toLowerCase()).indexOf(item);
      return locationIndex >= 0;
    })) {
      tweetFreq[areas[locationIndex]] += tweets[i].value;
    }
  }

  return tweetFreq;
};

export const getEmploymentRateByState = (couchData, states) => {
  const stateRate = initializeDict(states, 0);

  // Formulate object with state names and overall unemployment rate
  const rates = couchData.data.rows;
  for (let i = 0; i < rates.length; i += 1) {
    const stateName = rates[i].key;
    stateRate[stateName] = rates[i].value;
  }

  return stateRate;
};

export const getMortalityRatesBySA4 = (couchData) => {
  const sa4Rates = {};

  const rates = couchData.data.rows;
  for (let i = 0; i < rates.length; i += 1) {
    const sa4 = rates[i].key;
    sa4Rates[sa4] = {
      crude_rate: rates[i].value[0],
      ratio_to_average: rates[i].value[1],
    };
  }

  return sa4Rates;
};

export const getNumTweets = (tweetsData, ordered) => {
  const entries = Object.entries(tweetsData);
  if (ordered) {
    entries.sort((a, b) => a[0] > b[0]);
  }

  const numTweets = entries.map((entry) => entry[1]);

  return numTweets;
};

export const getMortalityRatio = (mortalityData, ordered) => {
  const entries = Object.entries(mortalityData);
  if (ordered) {
    entries.sort((a, b) => a[0] > b[0]);
  }

  const ratios = entries.map((entry) => entry[1].ratio_to_average);

  return ratios;
};

export const getCrudeMortality = (mortalityData, ordered) => {
  const entries = Object.entries(mortalityData);
  if (ordered) {
    entries.sort((a, b) => a[0] > b[0]);
  }

  const ratios = entries.map((entry) => entry[1].crude_rate);

  return ratios;
};

export const getPopulationData = (populationData) => {
  const { rows } = populationData.data;
  const popObj = {};
  for (let i = 0; i < rows.length; i += 1) {
    popObj[rows[i].key] = rows[i].value;
  }
  return popObj;
};

export const mapify = (data) => {
  const map = new Map();
  for (let i = 0; i < data.length; i += 1) {
    map.set(data[i].key, data[i].value);
  }
  return map;
};
