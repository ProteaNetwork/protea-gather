import { createStructuredSelector } from 'reselect';
import { selectMyCommunties } from '../../domain/communities/selectors';
import selectEventDomainRoot, { selectMyUpcomingEvents, selectMyPastEvents, selectMyActiveEvents, selectMyHostedEvents, selectDiscoverEvents } from 'domain/events/selectors';
import { IEvent } from 'domain/events/types';
import { makeSelectEthAddress } from 'containers/App/selectors';
import { ICommunity } from 'domain/communities/types';

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
