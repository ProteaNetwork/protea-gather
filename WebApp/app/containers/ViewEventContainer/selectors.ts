import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';
import { IEvent } from 'domain/events/types';
import { selectBalances } from 'domain/transactionManagement/selectors';

/**
 * Direct selector to the viewEventContainer state domain
 */
const selectEventsDomain = (state: ApplicationRootState) => state.events;
const selectCommunitiesDomain = (state: ApplicationRootState) => state.communities;


/**
 * Other specific selectors
 */
export const makeSelectCommunity = () => createSelector(
  selectCommunitiesDomain,
  (state, props) => props.match.params.eventId,
  (communities: any, eventId) => {
    const filtered = Object.keys(communities).filter(key => communities[key].eventManagerAddress == eventId.split('-')[0])
    return filtered.length > 0 ? communities[filtered[0]] : {};
  }
)

export const makeSelectEvent = () => createSelector(
  selectEventsDomain,
  // state: redux store
  // props: connected component's props
  (state, props) => props.match.params.eventId,
  (events, eventId) => events[eventId]
);



/**
 * Default selector used by ViewEventContainer
 */

const selectViewEventContainer = createStructuredSelector({
  community: makeSelectCommunity(),
  event: makeSelectEvent(),
  balances: selectBalances
});

export default selectViewEventContainer;
