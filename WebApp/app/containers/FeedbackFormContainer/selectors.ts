import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';

/**
 * Direct selector to the profileContainer state domain
 */
const selectPendingResponse = (state: ApplicationRootState) => state.userProfile.pendingResponse;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProfileContainer
 */


export default selectPendingResponse;
