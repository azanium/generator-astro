import React from 'react';
import { render } from 'react-testing-library';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from '@ducks/store';
import About from '../about.component';
import 'jest-dom/extend-expect';

const props = {

};

describe('Test Component', () => {
  it('render', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ConnectedRouter store={store} history={history}>
          <About {...props} />
        </ConnectedRouter>
      </Provider>
    );
    getByText(/About/);
  });
});
