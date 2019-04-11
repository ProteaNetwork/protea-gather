import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';

/**
 * Direct selector to the profileContainer state domain
 */

const selectProfileContainerDomain = (state: ApplicationRootState) => {
  return state ? state : {};
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProfileContainer
 */

const selectProfileContainer = () =>
  createSelector(selectProfileContainerDomain, substate => {
    return substate;
  });

export default selectProfileContainer;
export { selectProfileContainerDomain };
