import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';

/**
 * Direct selector to the viewCommunityContainer state domain
 */
const selectEventsDomain = (state: ApplicationRootState) => state.events;

/**
 * Other specific selectors
 */


export const makeSelectEvent = () => createSelector(
  selectEventsDomain,
  (state, props) => props.match.params.eventId,
  // TODO get the bonding curve params from somewhere to fully populate the form
  (communities, eventId) => communities[eventId] || {}
);