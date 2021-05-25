/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Scenario1 from './Scenario1';
import Scenario2 from './Scenario2';
import Scenario3 from './Scenario3';
import './Nav.css';

function Nav({ viewScenario }) {
  return (
    <div className="navbar">
      <nav>
        <ul>
          <li>
            <button type="submit" value="1" onClick={viewScenario}>Scenario 1</button>
          </li>
          <li>
            <button type="submit" value="2" onClick={viewScenario}>Scenario 2</button>
          </li>
          <li>
            <button type="submit" value="3" onClick={viewScenario}>Scenario 3</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function ScenarioPage() {
  const [scenario, setScenario] = useState(1);

  function viewScenario(e) {
    e.preventDefault();
    console.log(e.target.value);
    setScenario(parseInt(e.target.value, 10));
  }

  function displayScenario(scenarioNum) {
    if (scenarioNum === 1) {
      return (
        <Scenario1 />
      );
    } if (scenarioNum === 2) {
      return (
        <Scenario2 />
      );
    }
    return (
      <Scenario3 />
    );
  }

  return (
    <>
      <Nav viewScenario={viewScenario} />
      {displayScenario(scenario)}
    </>
  );
}

export default ScenarioPage;
