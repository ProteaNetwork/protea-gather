import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface ViewEventContainerState {
  readonly filter: string;
}

/* --- ACTIONS --- */
type ViewEventContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = ViewEventContainerState;
type ContainerActions = ViewEventContainerActions;

export { RootState, ContainerState, ContainerActions };
