import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface TransactionManagementState {
  txPending: boolean;
}

/* --- ACTIONS --- */
type TransactionManagementActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = TransactionManagementState;
type DomainActions = TransactionManagementActions;

export { RootState, DomainState, DomainActions };
