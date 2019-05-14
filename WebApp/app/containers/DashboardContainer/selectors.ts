import { createStructuredSelector } from 'reselect';
import { selectMyCommunties } from '../../domain/communities/selectors';
import { selectMyUpcomingEvents, selectMyPastEvents, selectMyActiveEvents, selectMyHostedEvents, selectDiscoverEvents } from 'domain/events/selectors';

/**
 * Direct selector to the dashboardContainer state domain
 */

/**
 * Other specific selectors
 */

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
