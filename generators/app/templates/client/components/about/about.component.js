import React from 'react';
import Link from 'react-router-dom/Link';
import './style.scss';

export const About = () => (
  <div>
    <h2>About Astro Generator</h2>
    <p>This generator was created to easily help fullstack developer to leverage CommonJS + ReactJS with the same basecode for server side</p>
    <p>The server side codes are created using CommonJS</p>
    <p>The client side was created using ReactJS</p>
    <ul className="about">
      <li>
        <Link to="/">Home</Link>
      </li>
    </ul>
  </div>
);

export default About;
