import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface EventPageState {
  readonly default: any;
}


/* --- ACTIONS --- */
type EventPageActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = EventPageState;
type ContainerActions = EventPageActions;

export { RootState, ContainerState, ContainerActions };