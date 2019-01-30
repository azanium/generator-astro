import React from 'react';
import { render } from 'react-testing-library';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import store, { history } from '@ducks/store';
import reduxConnect from '../index';

class Test extends React.Component {  // eslint-disable-line
  render() {
    return <div key="reduxconnect" className="redux-connect">reduxConnect</div>;
  }
}

const AttachedTest = reduxConnect(Test);

describe('reduxConnect HOC - HOC', () => {
  it('renders with no problem', () => {
    const { container } = render(
      <Provider key="provider" store={store}>
        <ConnectedRouter key="router" store={store} history={history}>
          <AttachedTest key="component" />
        </ConnectedRouter>
      </Provider>,
    );
    const tree = container.querySelector('.redux-connect');
    expect(tree).toBeDefined();
    expect(container).toMatchSnapshot();
  });
});
