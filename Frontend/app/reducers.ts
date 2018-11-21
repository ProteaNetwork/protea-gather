/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
// tslint:disable-next-line:no-duplicate-imports
import Redux from 'redux';

// tslint:disable-next-line:no-submodule-imports
// tslint:disable-next-line:no-implicit-dependencies
import globalReducer from 'containers/App/reducer';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers: Redux.ReducersMapObject = {}): Redux.Reducer<any> {
  return combineReducers({
    global: globalReducer,
    ...injectedReducers,
  });
}
