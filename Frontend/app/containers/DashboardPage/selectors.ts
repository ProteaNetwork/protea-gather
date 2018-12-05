import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


/**
 * Direct selector to the dashboardPage state domain
 */

const selectDashboardPageDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardPage
 */

const selectDashboardPage = () =>
  createSelector(selectDashboardPageDomain, substate => {
    return substate;
  });

export default selectDashboardPage;
export { selectDashboardPageDomain };
