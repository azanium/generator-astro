import * as types from '@ducks/actionTypes';
import reducer from '../reducer';

describe('cleanOnUnmount HOC - reducers', () => {
  it('sets state to undefined', () => {
    expect(
      reducer(state => state)(
        {},
        {
          type: types.RESET,
        },
      ),
    ).toEqual(undefined);
  });
});
