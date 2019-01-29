import React from 'react';
import Provider from 'react-redux/lib/components/Provider';
// import { injectGlobal } from 'styled-components';
import { PersistGate } from 'redux-persist/lib/integration/react';
import persistStore from 'redux-persist/lib/persistStore';
import { ConnectedRouter } from 'react-router-redux';
import { render, hydrate } from 'react-dom';
import store, { history } from '@client/ducks/store';
import App from './containers/app';

const persistor = persistStore(store);

const renderMethod = module.hot ? hydrate : render;
renderMethod(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConnectedRouter store={store} history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
