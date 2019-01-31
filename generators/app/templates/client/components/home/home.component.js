import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { reduxConnect } from '@hox';
import * as actions from './home.action';

import './style.scss';

export class Home extends React.Component {
  componentDidMount() {
    const { home, test } = this.props;
    if (!home.success) {
      test('azanium');
    }
  }

  render() {
    const { home } = this.props;
    const status = home.success ? 'success' : 'loading';
    return (
      <div className="Home">
        <p className="Home-intro">Check out astro generator on how to add features</p>
        <p className="Home-intro" data-testid="status">Status: {status}</p>
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

Home.propTypes = {
  test: PropTypes.func,
  home: PropTypes.shape({
    success: PropTypes.bool
  })
};

Home.defaultProps = {
  test: () => {},
  home: {
    success: false
  }
};

export default reduxConnect(Home, actions);
