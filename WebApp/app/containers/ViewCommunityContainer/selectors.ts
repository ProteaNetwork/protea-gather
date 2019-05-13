import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';
import { selectBalances } from 'domain/transactionManagement/selectors';
import { selectCommunitiesDomain } from 'domain/communities/selectors';
import { selectEventsDomain } from 'domain/events/selectors';

/**
 * Direct selector to the viewCommunityContainer state domain
 */
const selectMembersFilter = (state: ApplicationRootState) => state.viewCommunityPage.filter ? state.viewCommunityPage.filter : "";

/**
 * Other specific selectors
 */
const makeSelectFilter = createSelector(selectMembersFilter, (filter)=>{
  return filter;
})

export const makeSelectCommunity = () => createSelector(
  selectCommunitiesDomain,
  (state, props) => props.match.params.tbcAddress,
  (communities, tbcAddress) => communities[tbcAddress]
);

export const makeSelectFilterMembers = createSelector(
  makeSelectCommunity(), makeSelectFilter,
  (community, filter) => {
    if(community){
      return community.memberList ? community.memberList.filter(member => (filter == "" || member.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) || member.ethAddress.toLowerCase().indexOf(filter.toLowerCase()) >= 0) : [];
    } else {
      return [];
    }
  }
)

export const makeSelectEvents = () => createSelector(
  makeSelectCommunity(),
  selectEventsDomain,
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
  filter: makeSelectFilter,
  members: makeSelectFilterMembers,
  balances: selectBalances
});

export default selectViewCommunityContainer;
