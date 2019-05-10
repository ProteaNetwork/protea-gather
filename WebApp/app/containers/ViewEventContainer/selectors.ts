import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';
import { IEvent } from 'domain/events/types';
import { selectBalances } from 'domain/transactionManagement/selectors';
import { selectCommunitiesDomain } from 'domain/communities/selectors';
import { selectEventsDomain } from 'domain/events/selectors';

/**
 * Direct selector to the viewEventContainer state domain
 */

const selectAttendeeFilter = (state: ApplicationRootState) => state.viewEventPage.filter ? state.viewEventPage.filter : "";


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

export const makeSelectFilterAttendees = createSelector(
  makeSelectEvent(), selectAttendeeFilter,
  (event, filter) => {
    if(!event){
      return;
    }
    return event.attendees ? event.attendees.filter(attendee => (filter == "" || attendee.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) || attendee.ethAddress.toLowerCase().indexOf(filter.toLowerCase()) >= 0) : [];
  }
)

/**
 * Default selector used by ViewEventContainer
 */

const selectViewEventContainer = createStructuredSelector({
  community: makeSelectCommunity(),
  event: makeSelectEvent(),
  attendees: makeSelectFilterAttendees,
  balances: selectBalances
});

export default selectViewEventContainer;
