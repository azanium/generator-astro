import React from 'react';
import Link from 'react-router-dom/Link';
import './about.css';

const Test = () => (
  <div>
    <h2>About Astro Generator</h2>
    <p>This generator was created to easily help fullstack developer to leverage CommonJS + ReactJS with the same basecode for server side</p>
    <p>The server side codes are created using CommonJS</p>
    <p>The client side was created using ReactJS</p>
    <ul className="Home-resources">
      <li>
        <Link to="/">Home</Link>
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

export default Test;
