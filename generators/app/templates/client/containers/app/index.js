import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '@components/home';
import About from '@components/about';
import NotFound from '@components/notFound';
import logo from './react.svg';
import './app.css';

class App extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Astro Generator</h2>
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
