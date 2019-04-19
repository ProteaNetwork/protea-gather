import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface ViewCommunityContainerState {
  readonly filter: string;
}

/* --- ACTIONS --- */
type ViewCommunityContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = ViewCommunityContainerState;
type ContainerActions = ViewCommunityContainerActions;

export { RootState, ContainerState, ContainerActions };
