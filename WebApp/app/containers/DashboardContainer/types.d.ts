import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface DashboardContainerState {
  readonly default: any;
}

/* --- ACTIONS --- */
type DashboardContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = DashboardContainerState;
type ContainerActions = DashboardContainerActions;

export { RootState, ContainerState, ContainerActions };
