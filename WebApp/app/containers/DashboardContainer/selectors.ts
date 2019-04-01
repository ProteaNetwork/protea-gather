import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';
import { selectMyCommunties } from '../../domain/communities/selectors';
import selectEventDomainRoot, { selectMyUpcomingEvents, selectMyPastEvents, selectMyActiveEvents, selectMyHostedEvents } from 'domain/events/selectors';
import { IEvent } from 'domain/events/types';

/**
 * Direct selector to the dashboardContainer state domain
 */

/**
 * Other specific selectors
 */
const selectDiscoverEvents = createSelector(selectMyCommunties, selectEventDomainRoot,
  (myCommunities, allEvents) => {
    const eventManagers = (Object.values(myCommunities)).map(com => com.eventManagerAddress);
    const eventsArray = Object.values(allEvents);
    return eventsArray.filter((evt: IEvent) => eventManagers.includes(evt.eventManagerAddress)).filter(event => event.memberState == 0);
  }
)


/**
 * Default selector used by DashboardContainer
 */

const selectDashboardContainer = createStructuredSelector({
  myCommunities: selectMyCommunties,
  myUpcomingEvents: selectMyUpcomingEvents,
  myPastEvents: selectMyPastEvents,
  myActiveEvents: selectMyActiveEvents,
  myHostingEvents: selectMyHostedEvents,
  discoverEvents: selectDiscoverEvents
});

export default selectDashboardContainer;
// export { selectDashboardContainerDomain };
