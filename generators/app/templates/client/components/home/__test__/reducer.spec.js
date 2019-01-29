import reducer from '../home.reducer';
import * as types from '../home.actionType';

describe('Home Container - reducers', () => {
  it('sets loading state', () => {
    expect(
      reducer(
        {},
        {
          type: types.HOME_TEST
        }
      )
    ).toEqual({
      loading: true
    });
  });

  it('sets success state', () => {
    expect(
      reducer(
        {},
        {
          type: types.HOME_TEST_SUCCESS
        }
      )
    ).toEqual({
      loading: false,
      success: true
    });
  });

  it('sets error state', () => {
    expect(
      reducer(
        {},
        {
          type: types.HOME_TEST_ERROR
        }
      )
    ).toEqual({
      loading: false,
      error: true
    });
  });

  it('returns the initial state', () => {
    expect(reducer({}, {})).toEqual({});
  });
});
