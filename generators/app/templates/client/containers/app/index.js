import React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as routes from '@ducks/routes';
import notFoundRoute from '@components/notFound/notFound.route';
import logo from './react.svg';
import './style.scss';

/**
 * Generate Route components for all routes
 */
const generateRoutesComponent = () => {
  const components = [];
  Object.keys(routes).forEach((routeKey) => {
    const route = routes[routeKey];
    components.push(route.path ? <Route key={route.path} exact path={route.path} component={route.component} /> : <Route key={route.path} exact component={route.component} />);
  });

  // Add not found route
  components.push(
    <Route key="notFound" component={notFoundRoute.component} />
  );
  return components;
};

class App extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Astro Generator Fullstack</h2>
        </div>
        <Switch>{generateRoutesComponent()}</Switch>
      </div>
    );
  }
}

export default App;
