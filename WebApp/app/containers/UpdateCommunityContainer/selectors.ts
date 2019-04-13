import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';

/**
 * Direct selector to the viewCommunityContainer state domain
 */
const selectCommunitiesDomain = (state: ApplicationRootState) => state.communities;

/**
 * Other specific selectors
 */


export const makeSelectCommunity = () => createSelector(
  selectCommunitiesDomain,
  (state, props) => props.match.params.tbcAddress,
  // TODO get the bonding curve params from somewhere to fully populate the form
  (communities, tbcAddress) => communities[tbcAddress] || {}
);