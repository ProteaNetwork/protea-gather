import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


/**
 * Direct selector to the communityPage state domain
 */

const selectCommunityPageDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by CommunityPage
 */

const selectCommunityPage = () =>
  createSelector(selectCommunityPageDomain, substate => {
    return substate;
  });

export default selectCommunityPage;
export { selectCommunityPageDomain };
