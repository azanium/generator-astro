import React from 'react';
import { render } from 'react-testing-library';
import Home from './home.component';
import 'jest-dom/extend-expect';

const props = {

};

describe('Home Component', () => {
  it('render', () => {
    const { getByText } = render(<Home {...props} />);
    getByText(/Welcome to/);
    getByText(/Check out/);
    const npmLink = getByText('Astro Generator');
    expect(npmLink.href).toBe('https://www.npmjs.com/package/generator-astro');
    const issuesLink = getByText('Issues');
    expect(issuesLink.href).toBe('https://github.com/azanium/generator-astro/issues');
  });
});
