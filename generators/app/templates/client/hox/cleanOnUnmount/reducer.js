import * as types from '@ducks/actionTypes';

/*
 * hox/cleanOnUnmount/reducer.js : the cleanOnUnmount HOC reducer factory
 * @param {Function} combinedReducers the current reducers factory of the component
 * @returns {Function} combination of the current reducer factory and the new (with reset functionality) reducer factory
 */
export default combinedReducers => (state, action) => {
  if (action.type === types.RESET) {
    state = undefined; // eslint-disable-line
  }
  return combinedReducers(state, action);
};
