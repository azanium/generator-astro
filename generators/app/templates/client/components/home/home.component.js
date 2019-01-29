import React from 'react';
import Link from 'react-router-dom/Link';
import { reduxConnect } from '@hox';
import * as actions from './home.action';

import './home.css';

class Home extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div className="Home">
        <p className="Home-intro">Check out astro generator on how to add features</p>
        <ul className="Home-resources">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <a href="https://www.npmjs.com/package/generator-astro">Astro Generator</a>
          </li>
          <li>
            <a href="https://github.com/azanium/generator-astro/issues">Issues</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default reduxConnect(Home, actions);
