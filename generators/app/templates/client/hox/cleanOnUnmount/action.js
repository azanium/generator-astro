import * as types from '@ducks/actionTypes';

/*
 * hox/cleanOnUnmount/action.js : RESET action factory
 * @returns {Object} the reset action object
 */
export function reset() { // eslint-disable-line
  return {
    type: types.RESET,
  };
}
