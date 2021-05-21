/* eslint-disable react/prop-types */
import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import Scenario1 from './components/Scenario1';
import Scenario2 from './components/Scenario2';
import Nav from './components/Nav';
import './App.css';

function WithNav({ children }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Redirect exact from="/" to="/scenario1" />
            <Route path="/scenario1">
              <WithNav>
                <Scenario1 />
              </WithNav>
            </Route>
            <Route path="/scenario2">
              <WithNav>
                <Scenario2 />
              </WithNav>
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
