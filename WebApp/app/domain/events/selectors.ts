import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';
import { IEvent } from './types';
import { makeSelectEthAddress } from 'containers/App/selectors';
import { selectMyCommunties, selectDiscoverCommunties } from 'domain/communities/selectors';
import { ICommunity } from 'domain/communities/types';

/**
 * Direct selector to the EventsDomain
 */

export const selectEventsDomain = (state: ApplicationRootState) => {
  return state ? state.events : {};
};

/**
 * Other specific selectors
 */
export const selectMyEvents = createSelector(selectEventsDomain,
  (allEvents) => {
    return (Object.values(allEvents).filter((event: IEvent) => event.memberState > 0));
  }
)

export const selectMyUpcomingEvents = createSelector(selectMyEvents,
  (allMyEvents) => {
    return (Object.values(allMyEvents).filter((event: IEvent) => event.state == 1));
  }
)

export const selectMyActiveEvents = createSelector(selectMyEvents,
  (allMyEvents) => {
    const arr = Object.values(allMyEvents);
    return (Object.values(allMyEvents).filter((event: IEvent) => event.state == 2));
  }
)

export const selectMyPastEvents = createSelector(selectMyEvents,
  (allMyEvents) => {
    return (Object.values(allMyEvents).filter((event: IEvent) => (event.state == 3 || event.state == 4)));
  }
)

export const selectMyHostedEvents = createSelector(selectMyEvents, makeSelectEthAddress,
  (allMyEvents, myEthAddress) => {
    return (Object.values(allMyEvents).filter((event: IEvent) => (event.state < 3 && event.organizer.toLowerCase() == myEthAddress.toLowerCase())).map((event: IEvent) => event));
  }
)

export const selectDiscoverEvents = createSelector(selectDiscoverCommunties, selectEventsDomain, makeSelectEthAddress,
  (communities, allEvents, ethAddress): IEvent[] => {
    const eventManagers = (Object.values(communities)).map((com: ICommunity)=> com.eventManagerAddress);
    const eventsArray: IEvent[] = Object.values(allEvents);
    const allDiscoverEvents = eventsArray.filter((evt: IEvent) => eventManagers.includes(evt.eventManagerAddress)).filter((event: IEvent) => (event.memberState == 0 && event.organizer.toLowerCase() != ethAddress.toLowerCase()));
    return allDiscoverEvents.filter(event => event.state == 1);
  }
)

// Notifications
export const selectMyPendingAttendance = createSelector(selectMyEvents,
  (allMyEvents) => {
    return (Object.values(allMyEvents).filter((event: IEvent) => event.state == 2 && event.memberState == 1).map((event: IEvent) => event.eventId));
  }
)

export const selectMyRemainingGifts = createSelector(selectMyEvents,
  (allMyEvents) => {
    return Object.values(allMyEvents).filter((event: IEvent) => (event.state == 3 && event.memberState == 99) || (event.state == 4 && event.memberState == 1)).map((event: IEvent) => event.eventId);
  }
)


export const selectEventDomainRoot = createSelector(selectEventsDomain, substate => {
  return substate;
});

export default selectEventDomainRoot;
