import React from 'react';
import * as actions from '../action';
import * as types from '@ducks/actionTypes';

describe('cleanOnUnmount HOC - actions', () => {
  it('dispatches reset action', () => {
    expect(actions.reset()).toEqual({
      type: types.RESET,
    });
  });
});
