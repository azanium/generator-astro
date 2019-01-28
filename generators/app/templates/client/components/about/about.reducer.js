import persistReducer from 'redux-persist/lib/persistReducer';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'test',
  storage,
  whitelist: [
    /* keys to be persisted */
  ],
};

const initialState = {};

/*
 * containers/home/reducer.js : home reducer
 * @param {Object} state the state of the home container
 * @param {Object} action the redux action instance
 * @returns {Object} returns the new state
 */
function test(state, action) { // eslint-disable-line
  return state || initialState;
}

export default persistReducer(persistConfig, test);
