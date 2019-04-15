import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';
import { selectMyCommunties, selectDiscoverCommunties } from 'domain/communities/selectors';

/**
 * Direct selector to the CommunitiesPageContainer state domain
 */
const selectCommunitiesDomain = (state: ApplicationRootState) => state.communities;
const selectEventsDomain = (state: ApplicationRootState) => state.events;

const selectEthBalance = (state: ApplicationRootState) => state.transactionManagement.ethBalance;
const selectDaiBalance = (state: ApplicationRootState) => state.transactionManagement.daiBalance;

/**
 * Other specific selectors
 */


export const makeSelectCommunity = () => createSelector(
  selectCommunitiesDomain,
  // state: redux store
  // props: connected component's props
  (state, props) => props.match.params.tbcAddress,
  (communities, tbcAddress) => communities[tbcAddress]
);

export const selectBalances = createSelector(
  selectEthBalance,
  selectDaiBalance,
  (ethBalance,daiBalance) => ({
    ethBalance: ethBalance,
    daiBalance: daiBalance
  })
);

/**
 * Default selector used by ViewCommunityContainer
 */

const selectCommunitiesPage = createStructuredSelector({
  myCommunities: selectMyCommunties,
  discoverCommunities: selectDiscoverCommunties,
  balances: selectBalances
});

export default selectCommunitiesPage;
