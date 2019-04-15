import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface EventsPageContainerState {
  readonly filter: string;
}

/* --- ACTIONS --- */
type EventsPageContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = EventsPageContainerState;
type ContainerActions = EventsPageContainerActions;

export { RootState, ContainerState, ContainerActions };
