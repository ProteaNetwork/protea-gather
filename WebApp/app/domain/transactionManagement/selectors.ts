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

/**
 * Default selector used by TransactionManagement
 */

const selectTransactionManagement = () =>
  createSelector(selectTransactionManagementDomain, substate => {
    return substate;
  });

export default selectTransactionManagement;
export { selectTransactionManagementDomain };
