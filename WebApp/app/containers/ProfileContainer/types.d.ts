import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface ProfileContainerState {
  readonly default: any;
}

/* --- ACTIONS --- */
type ProfileContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = ProfileContainerState;
type ContainerActions = ProfileContainerActions;

export { RootState, ContainerState, ContainerActions };
