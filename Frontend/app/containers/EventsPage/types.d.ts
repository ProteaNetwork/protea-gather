import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface EventsPageState {
  readonly searchParameter: string;
  readonly sortParameter: number;
}


/* --- ACTIONS --- */
type EventsPageActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = EventsPageState;
type ContainerActions = EventsPageActions;

export { RootState, ContainerState, ContainerActions };