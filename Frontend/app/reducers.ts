/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import Redux from 'redux';

/**
 * Creates the main reducer with the dynamically injected ones
 */

function globalReducer(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default function createReducer(injectedReducers: Redux.ReducersMapObject = {}): Redux.Reducer<any> {
  return combineReducers({
    globalReducer,
    ...injectedReducers,
  });
}
