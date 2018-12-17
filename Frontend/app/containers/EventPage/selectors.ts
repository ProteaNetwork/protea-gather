import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


/**
 * Direct selector to the eventPage state domain
 */

const selectEventPageDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by EventPage
 */

const selectEventPage = () =>
  createSelector(selectEventPageDomain, substate => {
    return substate;
  });

export default selectEventPage;
export { selectEventPageDomain };
