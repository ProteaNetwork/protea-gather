import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


/**
 * Direct selector to the communitiesPage state domain
 */

const selectCommunitiesPageDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by CommunitiesPage
 */

const selectCommunitiesPage = () =>
  createSelector(selectCommunitiesPageDomain, substate => {
    return substate;
  });

export default selectCommunitiesPage;
export { selectCommunitiesPageDomain };
