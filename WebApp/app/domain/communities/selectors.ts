import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';
import { ICommunity } from './types';

/**
 * Direct selector to the communitiesDomain
 */

export const selectCommunitiesDomain = (state: ApplicationRootState) => {
  return state ? state.communities : {};
};

/**
 * Other specific selectors
 */
export const selectMyCommunties = createSelector(selectCommunitiesDomain,
  (allCommunities) => {
    return (Object.values(allCommunities).filter((com: ICommunity) => com.isMember));
  }
)

export const selectTotalStaked = createSelector(selectMyCommunties,
  (myCommunities: ICommunity[]) => {
    const totalStaked = myCommunities.reduce((total: number, community: ICommunity) => total + parseFloat(`${community.availableStake}`), 0);
    return totalStaked;
})

export const selectDiscoverCommunties = createSelector(selectCommunitiesDomain,
  (allCommunities) => {
    return (Object.values(allCommunities).filter((com: ICommunity) => !com.isMember));
  }
)


/**
 * Default selector used by ComumnitiesDomain
 */

export const selectCommunitiesDomainRoot = createSelector(selectCommunitiesDomain, substate => {
    return substate;
  });

export default selectCommunitiesDomainRoot;
