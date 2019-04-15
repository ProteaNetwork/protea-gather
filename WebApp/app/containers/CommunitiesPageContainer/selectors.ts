import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { selectMyCommunties, selectDiscoverCommunties } from 'domain/communities/selectors';
import { selectBalances } from 'domain/transactionManagement/selectors';

/**
 * Direct selector to the CommunitiesPageContainer state domain
 */

const selectMyCommunitiesFilter = (state: ApplicationRootState) => state.communitiesPage.filter ? state.communitiesPage.filter : "";

/**
 * Other specific selectors
 */

const makeSelectFilter = createSelector(selectMyCommunitiesFilter, (filter)=>{
  return filter;
})

const makeSelectMyCommunities = createSelector(selectMyCommunitiesFilter, selectMyCommunties,
  (filter, communities) => {
  return communities.filter(community => (filter == "" || community.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0))
})

const makeSelectDiscoverCommunities = createSelector(selectMyCommunitiesFilter, selectDiscoverCommunties,
  (filter, communities) => {
  return communities.filter(community => (filter == "" || community.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0))
})

/**
 * Default selector used by ViewCommunityContainer
 */

const selectCommunitiesPage = createStructuredSelector({
  filter: makeSelectFilter,
  myCommunities: makeSelectMyCommunities,
  discoverCommunities: makeSelectDiscoverCommunities,
  balances: selectBalances
});

export default selectCommunitiesPage;
