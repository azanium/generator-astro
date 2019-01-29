import React from 'react';
import { render } from 'react-testing-library';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from '@ducks/store';
import Home from '../home.component';
import 'jest-dom/extend-expect';

const props = {

};

describe('Home Component', () => {
  it('render', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ConnectedRouter store={store} history={history}>
          <Home {...props} />
        </ConnectedRouter>
      </Provider>
    );
    getByText(/Check out/);
    const npmLink = getByText('Astro Generator');
    expect(npmLink.href).toBe('https://www.npmjs.com/package/generator-astro');
    const issuesLink = getByText('Issues');
    expect(issuesLink.href).toBe('https://github.com/azanium/generator-astro/issues');
  });
});