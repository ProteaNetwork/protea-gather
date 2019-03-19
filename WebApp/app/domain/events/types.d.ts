import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface EventsState {
  readonly default: any;
}

/* --- ACTIONS --- */
type EventsActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = EventsState;
type DomainActions = EventsActions;

export { RootState, DomainState, DomainActions };
