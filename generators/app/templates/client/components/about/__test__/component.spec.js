import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import { About } from '../about.component';
import 'jest-dom/extend-expect';

const component = props => (
  <MemoryRouter>
    <About {...props} />
  </MemoryRouter>
);

describe('Test Component', () => {
  let props;

  beforeEach(() => {
    props = {
      about: {}
    };
  });

  afterEach(cleanup);

  it('should render', () => {
    const { container } = render(component(props));
    const element = container.querySelector('ul .about');
    expect(element).toBeDefined();
  });
});
