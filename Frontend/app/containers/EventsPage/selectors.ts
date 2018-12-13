import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


/**
 * Direct selector to the eventsPage state domain
 */

const selectEventsPageDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by EventsPage
 */

const selectEventsPage = () =>
  createSelector(selectEventsPageDomain, substate => {
    return substate;
  });

export default selectEventsPage;
export { selectEventsPageDomain };
