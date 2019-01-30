import React from 'react';

/*
 * hoc/asyncComponent : calls the component asynchronously
 * @param {Promise} getComponent a promise to load the file that returns a component
 * @returns {class} the loaded react component or null
 */
export default function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    constructor(props) {
      super(props);
      this.Component = null;
      this.state = { Component: AsyncComponent.Component };
    }

    render() {
      let { Component } = this.state;
      if (!Component) {
        getComponent().then((cmp) => {
          AsyncComponent.Component = cmp;
          Component = cmp;
          this.setState({ Component: cmp });
        });
      }

      if (Component) {
        return <Component {...this.props} />;
      }
      return null;
    }
  };
}
