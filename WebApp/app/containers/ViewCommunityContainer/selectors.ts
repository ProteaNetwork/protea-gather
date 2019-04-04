import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the viewCommunityContainer state domain
 */

const selectViewCommunityContainerDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by ViewCommunityContainer
 */

const selectViewCommunityContainer = () =>
  createSelector(selectViewCommunityContainerDomain, substate => {
    return substate;
  });

export default selectViewCommunityContainer;
export { selectViewCommunityContainerDomain };
