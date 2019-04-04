import jwtDecode from 'jwt-decode';
import { createSelector, createStructuredSelector } from 'reselect';
import { ApplicationRootState } from 'types';


/**
 * Direct selector to the user state domain
 */

const txPendingState = (state: ApplicationRootState) => state.transactionManagement.txPending;

/**
 * Other specific selectors
 */

/**
 * Default selector used by App
 */
const makeSelectTxPending = createSelector(txPendingState, substate => {
    return substate;
  });

// Root

const selectCreateCommunityState = createStructuredSelector({
  pendingTx: makeSelectTxPending
})

export default selectCreateCommunityState;
