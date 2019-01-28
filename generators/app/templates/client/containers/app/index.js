import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '@components/home';
import About from '@components/about';

import logo from './react.svg';
import './app.css';


const App = () => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Welcome to Astro Generator Fullstack</h2>
    </div>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
    </Switch>
  </div>
);

export default App;
