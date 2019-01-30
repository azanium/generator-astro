import * as actions from '../home.action';
import * as types from '../home.actionType';

describe('Home Component - actions', () => {
  const payload = 'payload';

  it('dispatch test action', () => {
    expect(actions.test(payload)).toEqual({
      type: types.HOME_TEST,
      payload,
    });
  });

  it('dispatch testSuccess action', () => {
    expect(actions.testSuccess(payload)).toEqual({
      type: types.HOME_TEST_SUCCESS,
      payload
    });
  });

  it('dispatch testError action', () => {
    expect(actions.testError(payload)).toEqual({
      type: types.HOME_TEST_ERROR,
      payload
    });
  });

  it('dispatch testCancel', () => {
    expect(actions.testCancel(payload)).toEqual({
      type: types.HOME_TEST_CANCEL,
      payload
    });
  });
});
