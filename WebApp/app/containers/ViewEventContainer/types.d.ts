import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface ViewEventContainerContainerState {
  readonly filter: string;
}

/* --- ACTIONS --- */
type ViewEventContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = ViewEventContainerContainerState;
type ContainerActions = ViewEventContainerActions;

export { RootState, ContainerState, ContainerActions };
