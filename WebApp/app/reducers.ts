/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
// tslint:disable-next-line:no-duplicate-imports
import Redux from 'redux';

// tslint:disable-next-line:no-submodule-imports
// tslint:disable-next-line:no-implicit-dependencies
import authenticationReducer from './domain/authentication/reducer';
import userProfileReducer from './domain/userProfile/reducer';
import communitiesReducer from 'domain/communities/reducer';
import eventsReducer from 'domain/events/reducer';
import transactionManagementReducer from 'domain/transactionManagement/reducer';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers: Redux.ReducersMapObject = {}): Redux.Reducer<any> {
  return combineReducers({
    authentication: authenticationReducer,
    userProfile: userProfileReducer,
    communities: communitiesReducer,
    events: eventsReducer,
    transactionManagement: transactionManagementReducer,
    ...injectedReducers,
  });
}
