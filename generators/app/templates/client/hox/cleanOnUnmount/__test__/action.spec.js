import * as types from '@ducks/actionTypes';
import * as actions from '../action';

describe('cleanOnUnmount HOC - actions', () => {
  it('dispatches reset action', () => {
    expect(actions.reset()).toEqual({
      type: types.RESET,
    });
  });
});
