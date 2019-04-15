import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';
import { selectBalances } from 'domain/transactionManagement/selectors';

/**
 * Direct selector to the viewCommunityContainer state domain
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

export const makeSelectEvents = () => createSelector(
  makeSelectCommunity(),
  selectEventsDomain,
  // state: redux store
  // props: connected component's props
  (community: ICommunity, events) => {
    if(!community || !events){
      return [];
    }
    return Object.keys(events).filter(key =>
      key.indexOf(community.eventManagerAddress) > -1).map(foundEventKey => events[foundEventKey])
  }

);

/**
 * Default selector used by ViewCommunityContainer
 */

const selectViewCommunityContainer = createStructuredSelector({
  community: makeSelectCommunity(),
  events: makeSelectEvents(),
  balances: selectBalances
});

export default selectViewCommunityContainer;
