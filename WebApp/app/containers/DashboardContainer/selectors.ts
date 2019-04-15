import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';
import { selectMyCommunties } from '../../domain/communities/selectors';
import selectEventDomainRoot, { selectMyUpcomingEvents, selectMyPastEvents, selectMyActiveEvents, selectMyHostedEvents } from 'domain/events/selectors';
import { IEvent } from 'domain/events/types';
import { makeSelectEthAddress } from 'containers/App/selectors';
import { ICommunity } from 'domain/communities/types';

/**
 * Direct selector to the dashboardContainer state domain
 */

/**
 * Other specific selectors
 */
const selectDiscoverEvents = createSelector(selectMyCommunties, selectEventDomainRoot, makeSelectEthAddress,
  (myCommunities, allEvents, ethAddress): IEvent[] => {
    const eventManagers = (Object.values(myCommunities)).map((com: ICommunity)=> com.eventManagerAddress);
    const eventsArray: IEvent[] = Object.values(allEvents);
    return eventsArray.filter((evt: IEvent) => eventManagers.includes(evt.eventManagerAddress)).filter((event: IEvent) => (event.memberState == 0 && event.organizer.toLowerCase() != ethAddress.toLowerCase()));
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
