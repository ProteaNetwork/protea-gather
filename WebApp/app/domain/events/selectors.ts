import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';
import { IEvent } from './types';
import { makeSelectEthAddress } from 'containers/App/selectors';

/**
 * Direct selector to the EventsDomain
 */

const selectEventsDomain = (state: ApplicationRootState) => {
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
    return (Object.values(allMyEvents).filter((event: IEvent) => event.state == 3));
  }
)

export const selectMyHostedEvents = createSelector(selectMyEvents, makeSelectEthAddress,
  (allMyEvents, myEthAddress) => {
    return (Object.values(allMyEvents).filter((event: IEvent) => (event.state < 3 && event.organizer.toLowerCase() == myEthAddress.toLowerCase())).map((event: IEvent) => event.eventId));
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
