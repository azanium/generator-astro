import React from 'react';
import logo from './react.svg';
import './home.css';

const Home = () => (
  <div className="Home">
    <div className="Home-header">
      <img src={logo} className="Home-logo" alt="logo" />
      <h2>Welcome to Astro Generator Fullstack</h2>
    </div>
    <p className="Home-intro">
      Check out astro generator on how to add features
    </p>
    <ul className="Home-resources">
      <li>
        <a href="https://www.npmjs.com/package/generator-astro">Astro Generator</a>
      </li>
      <li>
        <a href="https://github.com/azanium/generator-astro/issues">Issues</a>
      </li>
    </ul>
  </div>
);

export default Home;
