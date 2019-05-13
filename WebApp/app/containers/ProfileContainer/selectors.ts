import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';

/**
 * Direct selector to the profileContainer state domain
 */
const selectProfileDomain = (state: ApplicationRootState) => state.userProfile;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProfileContainer
 */


export default selectProfileDomain;
