import React from 'react';
import { render } from 'react-testing-library';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import store, { history } from '@ducks/store';
import cleanOnUnmount from '../index';

class Test extends React.Component { // eslint-disable-line
  render() {
    return <div className="clean-on-unmount">cleanOnUnmount</div>;
  }
}

const AttachedTest = cleanOnUnmount(Test);

describe('cleanOnUnmount HOC - HOC', () => {
  it('renders with no problem', () => {
    const { container } = render(
      <Provider key="provider" store={store}>
        <ConnectedRouter key="connectedRouter" store={store} history={history}>
          <AttachedTest key="attachedTest" />
        </ConnectedRouter>
      </Provider>,
    );
    const tree = container.querySelector('.clean-on-unmount');
    expect(tree).toBeDefined();
    expect(container).toMatchSnapshot();
  });
});
