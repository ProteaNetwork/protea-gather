import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the transactionManagement state domain
 */

const selectTransactionManagementDomain = (state: ApplicationRootState) => {
  return state ? state.transactionManagement : initialState;
};

/**
 * Other specific selectors
 */
const selectEthBalance = (state: ApplicationRootState) => state.transactionManagement.ethBalance;

const selectDaiBalance = (state: ApplicationRootState) => state.transactionManagement.daiBalance;

const selectEthAddress = (state: ApplicationRootState) => state.transactionManagement.ethAddress;

const selectTxPendingState = (state: ApplicationRootState) => state.transactionManagement.txPending ? state.transactionManagement.txPending : false;

const selectTxRemaining = (state: ApplicationRootState) => state.transactionManagement.txRemaining ? state.transactionManagement.txRemaining : 0;

const selectTxContext = (state: ApplicationRootState) => state.transactionManagement.txContext ? state.transactionManagement.txContext : 0;

/**
 * Default selector used by TransactionManagement
 */

export const selectBalances = createSelector(
  selectEthBalance,
  selectDaiBalance,
  selectEthAddress,
  (ethBalance, daiBalance, ethAddress): {ethBalance: number, daiBalance: number, ethAddress: string} => ({
    ethBalance: ethBalance,
    daiBalance: daiBalance,
    ethAddress: ethAddress
  })
);

export const makeSelectTransactionManagement = createSelector(selectTransactionManagementDomain, substate => {
    return substate;
  });

export const makeSelectTxPending = createSelector(selectTxPendingState, substate => {
  return substate;
});

export const makeSelectTxRemaining = createSelector(selectTxRemaining, substate => {
  return substate;
});

export const makeSelectTxContext = createSelector(selectTxContext, substate => {
  return substate;
});

export default makeSelectTransactionManagement;
