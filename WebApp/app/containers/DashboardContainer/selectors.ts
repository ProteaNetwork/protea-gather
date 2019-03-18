import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboardContainer state domain
 */

const selectDashboardContainerDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardContainer
 */

const selectDashboardContainer = () =>
  createSelector(selectDashboardContainerDomain, substate => {
    return substate;
  });

export default selectDashboardContainer;
export { selectDashboardContainerDomain };
