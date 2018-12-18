import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


/**
 * Direct selector to the loginPage state domain
 */

const selectLoginPageDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const selectLoginPage = () =>
  createSelector(selectLoginPageDomain, substate => {
    return substate;
  });

export default selectLoginPage;
export { selectLoginPageDomain };
