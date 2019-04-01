import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the EventsDomain
 */

const selectEventsDomain = (state: ApplicationRootState) => {
  return state ? state.events : {};
};

const selectEthAddress = (state: ApplicationRootState) => {
  return state ? state.authentication.ethAddress : "";
}

/**
 * Other specific selectors
 */
export const selectMyEvents = createSelector(selectEventsDomain,
  (allEvents) => {
    const arr = Object.values(allEvents);
    return arr.filter(event => event.memberState > 0);
  }
)

export const selectMyUpcomingEvents = createSelector(selectMyEvents,
  (allMyEvents) => {
    const arr = Object.values(allMyEvents);
    return arr.filter(event => event.state == 1);
  }
)

export const selectMyActiveEvents = createSelector(selectMyEvents,
  (allMyEvents) => {
    const arr = Object.values(allMyEvents);
    return arr.filter(event => event.state == 2);
  }
)

export const selectMyPastEvents = createSelector(selectMyEvents,
  (allMyEvents) => {
    const arr = Object.values(allMyEvents);
    return arr.filter(event => event.state == 3);
  }
)

export const selectMyHostedEvents = createSelector(selectMyEvents, selectEthAddress,
  (allMyEvents, myEthAddress) => {
    const arr = Object.values(allMyEvents);
    return arr.filter(event => (event.state < 3 && event.organizer.toLowerCase() == myEthAddress)).map(event => event.eventId);
  }
)

// Notifications
export const selectMyPendingAttendance = createSelector(selectMyEvents,
  (allMyEvents) => {
    const arr = Object.values(allMyEvents);
    return arr.filter(event => event.state == 2 && event.memberState == 1).map(event => event.eventId);
  }
)

export const selectMyRemainingGifts = createSelector(selectMyEvents,
  (allMyEvents) => {
    const arr = Object.values(allMyEvents);
    return arr.filter(event => (event.state == 3 && event.memberState == 99) || (event.state == 4 && event.memberState == 1)).map(event => event.eventId);
  }
)


export const selectEventDomainRoot = createSelector(selectEventsDomain, substate => {
  return substate;
});

export default selectEventDomainRoot;
