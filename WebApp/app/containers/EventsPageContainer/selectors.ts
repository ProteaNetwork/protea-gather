import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';
import { selectMyCommunties } from 'domain/communities/selectors';
import { selectDiscoverEvents, selectMyEvents, selectMyUpcomingEvents, selectMyPastEvents, selectMyActiveEvents, selectMyHostedEvents } from 'domain/events/selectors';
import { selectBalances } from 'domain/transactionManagement/selectors';
import { makeSelectEthAddress } from 'containers/App/selectors';

/**
 * Direct selector to the EventsPageContainer state domain
 */

const selectMyEventsFilter = (state: ApplicationRootState) => state.eventPage.filter ? state.eventPage.filter : "";
/**
 * Other specific selectors
 */

const makeSelectFilter = createSelector(selectMyEventsFilter, (filter)=>{
  return filter;
})

const makeSelectFilteredMyUpcomingEvents = createSelector(selectMyEventsFilter, selectMyUpcomingEvents,
  (filter, events) => {
  return events.filter(event => (filter == "" || event.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0))
})

const makeSelectFilteredMyPendingClaimEvents = createSelector(selectMyEventsFilter, selectMyEvents, makeSelectEthAddress,
  (filter, events, ethAddress) => {
    return events.filter(event => (((event.state == 3 && event.memberState == 99) || (event.state == 4 && event.memberState == 1 && event.gift > 0)) && event.organizer != ethAddress)).filter(event => (filter == "" || event.name.indexOf(filter) >= 0))
})

const makeSelectFilteredMyPendingConfirmEvents = createSelector(selectMyEventsFilter, selectMyEvents,
  (filter, events) => {
  return events.filter(event => (event.state == 2 && event.memberState == 1)).filter(event => (filter == "" || event.name.indexOf(filter) >= 0))
})

const makeSelectFilteredDiscoverEvents = createSelector(selectMyEventsFilter, selectDiscoverEvents,
  (filter, events) => {
  return events.filter(event => (filter == "" || event.name.indexOf(filter) >= 0));
})

const makeSelectFilteredHostingEvents = createSelector(selectMyEventsFilter, selectMyHostedEvents,
  (filter, events) => {
  return events.filter(event => (filter == "" || event.name.indexOf(filter) >= 0));
})

const makeSelectMyHostedPendingEvents = createSelector(makeSelectFilteredHostingEvents,
  (events) => {
  return events.filter(event => event.state == 1);
})

const makeSelectMyHostedActiveEvents = createSelector(makeSelectFilteredHostingEvents,
  (events) => {
  return events.filter(event => event.state == 2);;
})

/**
 * Default selector used by ViewCommunityContainer
 */

const selectEventPage = createStructuredSelector({
  myEvents: selectMyEvents,
  filter: makeSelectFilter,
  myUpcomingEvents: makeSelectFilteredMyUpcomingEvents,
  myPendingClaimEvents: makeSelectFilteredMyPendingClaimEvents,
  myPendingConfirmEvents: makeSelectFilteredMyPendingConfirmEvents,
  discoverEvents: makeSelectFilteredDiscoverEvents,
  myHostingPendingEvents: makeSelectMyHostedPendingEvents,
  myHostingActiveEvents: makeSelectMyHostedActiveEvents,
  balances: selectBalances
});

export default selectEventPage;
