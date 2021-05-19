/* eslint-disable import/prefer-default-export */

// Helpers
const initializeDict = (keys, value) => {
  const dict = {};
  for (let i = 0; i < keys.length; i += 1) {
    dict[keys[i]] = value;
  }
  return dict;
};

export const getTweetFrequencyByState = (couchData, states) => {
  const tweetFreq = initializeDict(states, 0);

  // Formulate object with state names and sum of tweets
  const tweets = couchData.data.rows;
  for (let i = 0; i < tweets.length; i += 1) {
    const locations = tweets[i].key.split(',').map((item) => item.trim().toLowerCase());
    let locationIndex = 0;

    if (locations.some((item) => {
      locationIndex = states.map((state) => state.toLowerCase()).indexOf(item);
      return locationIndex >= 0;
    })) {
      tweetFreq[states[locationIndex]] += tweets[i].value;
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
