import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <div className="navbar">
      <nav>
        <ul>
          <li>
            <Link to="/">Scenario 1</Link>
          </li>
          <li>
            <Link to="/scenario2">Scenario 2</Link>
          </li>
          <li>
            <Link to="/scenario3">Scenario 3</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
