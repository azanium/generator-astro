import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import store, { history } from '@ducks/store';
import reduxConnect from '../index';

class Test extends React.Component {  // eslint-disable-line
  render() {
    return <div className="redux-connect">reduxConnect</div>;
  }
}

const AttachedTest = reduxConnect(Test);

describe('reduxConnect HOC - HOC', () => {
  it('renders with no problem', () => {
    const component = mount(
      <Provider store={store}>
        <ConnectedRouter store={store} history={history}>
          <AttachedTest />
        </ConnectedRouter>
      </Provider>,
    );
    const tree = renderer.create(component).toJSON();

    expect(
      component
        .find('div')
        .first()
        .hasClass('redux-connect'),
    ).toEqual(true);
    expect(tree).toMatchSnapshot();
  });
});
