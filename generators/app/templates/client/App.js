import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import './App.css';

const App = () => (
  <div>
    <h1>Hello, World! mf2 crazy guy</h1>
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </div>
);

export default App;
