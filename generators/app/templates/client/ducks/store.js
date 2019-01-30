import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable/lib/cjs/createEpicMiddleware';
import { composeWithDevTools } from 'redux-devtools-extension';
import createHistory from 'history/createBrowserHistory';
import { combineEpics } from 'redux-observable/lib/cjs/combineEpics';


// rxjs observables
import { ajax } from 'rxjs/observable/dom/ajax';
import { of } from 'rxjs/observable/of';
// ----------------

import hocReducer from '@hox/cleanOnUnmount/reducer';
import * as reducers from '@ducks/reducers';
import * as epics from '@ducks/epics';

// global definitions
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/takeUntil';
// ------------------

export const history = createHistory();

// the epics middleware
const epicMiddleware = createEpicMiddleware({
  dependencies: {
    getJSON: ajax.getJSON,
    of
  }
});

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

// the reducers
const combinedReducers = combineReducers({
  ...reducers,
  routing: routerReducer
});
const reducer = hocReducer(combinedReducers); // adds reset reducer to our apps reducer
const store = createStore(
  reducer,
  preloadedState,
  composeWithDevTools(
    applyMiddleware(
      epicMiddleware,
      routerMiddleware(history)
    )
  )
);

const allEpics = Object.values({ ...epics });
epicMiddleware.run(combineEpics(...allEpics));

export default store;
