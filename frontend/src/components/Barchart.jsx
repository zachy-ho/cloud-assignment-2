import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';


const data = {
  'NSW': {
    'employment_rate': 0.8,
    'num_tweets': 200
  },
  'QLD': {
    'employment_rate': 0.7,
    'num_tweets': 400
  },
  'SA': {
    'employment_rate': 0.71,
    'num_tweets': 822
  },
  'TAS': {
    'employment_rate': 0.68,
    'num_tweets': 292
  },
  'VIC': {
    'employment_rate': 0.72,
    'num_tweets': 1000
  },
  'WA': {
    'employment_rate': 0.74,
    'num_tweets': 1012
  },
  'ACT': {
    'employment_rate': 0.798,
    'num_tweets': 728
  },
}

const get_states = (data) => {
  return Object.keys(data)
}

const get_employment_rates = (data) => {

}

function Barchart() {
  const [trace1, setTrace1] = useState({})

  useEffect(() => {
    if (trace1 === []) {
      setTrace1({
        x: Object.keys(data),
        y: []
      })

    }
  }, [])

}

export default Barchart;

