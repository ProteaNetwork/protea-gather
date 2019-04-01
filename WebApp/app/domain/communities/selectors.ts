import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the communitiesDomain
 */

const selectCommunitiesDomain = (state: ApplicationRootState) => {
  return state ? state.communities : {};
};

/**
 * Other specific selectors
 */
export const selectMyCommunties = createSelector(selectCommunitiesDomain,
  (allCommunities) => {
    const arr = Object.values(allCommunities);
    return arr.filter(com => com.isMember);
  }
)

/**
 * Default selector used by ComumnitiesDomain
 */

export const selectCommunitiesDomainRoot = createSelector(selectCommunitiesDomain, substate => {
    return substate;
  });

export default selectCommunitiesDomainRoot;
