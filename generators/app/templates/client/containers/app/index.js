import React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as routes from '@ducks/routes';
import Loadable from 'react-loadable';
import notFoundRoute from '@components/notFound/notFound.route';
import logo from './react.svg';
import './style.scss';

const LoadableComponent = loader => Loadable({
  loader,
  loading: () => null,
});

/**
 * Generate Route components for all routes
 */
const generateRoutesComponent = () => {
  const components = Object.values(routes).map(route => <Route key={route.path} exact path={route.path} component={LoadableComponent(route.component)} />);
  // Add not found route
  components.push(
    <Route key="notFound" component={LoadableComponent(notFoundRoute.component)} />
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
