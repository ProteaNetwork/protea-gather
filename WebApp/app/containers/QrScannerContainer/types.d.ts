import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface QrScannerContainerState {
  readonly active: boolean;
}

/* --- ACTIONS --- */
type QrScannerContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = QrScannerContainerState;
type ContainerActions = QrScannerContainerActions;

export { RootState, ContainerState, ContainerActions };
