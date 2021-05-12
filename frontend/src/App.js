import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Scenario from './components/Scenario';
import './App.css';

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    if (data.length === 0) {
      let headers = new Headers();
      headers.append('Authorization', 'Basic ' + btoa('admin:admin'))
      fetch('http://172.26.134.112:5984/_utils', {headers: headers}).then(res => console.log(res))
    }
  }, []) 

  return (
    <div className="App">
      <header className="App-header">
        <Scenario />
      </header>
    </div>
  );
}

export default App;
