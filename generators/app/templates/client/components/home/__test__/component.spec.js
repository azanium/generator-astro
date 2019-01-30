import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../home.component';
import 'jest-dom/extend-expect';

const component = props => (
  <MemoryRouter>
    <Home {...props} />
  </MemoryRouter>
);

describe('Home Component', () => {
  let props;

  beforeEach(() => {
    props = {
      home: {
        success: false,
      },
      test: jest.fn()
    };
  });

  afterEach(cleanup);

  it('should use default test action', () => {
    delete props.test;
    const { getByText } = render(component(props));
    expect(getByText(/status/i)).toHaveTextContent('Status: loading');
  });

  it('should call test action', () => {
    render(component(props));
    expect(props.test).toBeCalledTimes(1);
  });

  it('should not call test action', () => {
    props.home.success = true;
    render(component(props));
    expect(props.test).not.toBeCalled();
  });

  it('should render loading status', () => {
    const { getByText } = render(component(props));
    const status = getByText(/status/i);
    expect(status).toHaveTextContent('Status: loading');
  });

  it('should render loading success', () => {
    const { getByText, rerender, container } = render(component(props));
    const status = getByText(/status/i);
    expect(status).toHaveTextContent('Status: loading');
    props.home.success = true;
    rerender(component(props), container);
    expect(getByText(/status/i)).toHaveTextContent('Status: success');
  });
});
