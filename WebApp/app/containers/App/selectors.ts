import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


/**
 * Direct selector to the patent state domain
 */

const selectAppDomain = (state: ApplicationRootState) => {
  return state ? state.global : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by Patent
 */

const selectApp = () =>
  createSelector(selectAppDomain, substate => {
    return substate;
  });

export default selectApp;
export { selectAppDomain };
