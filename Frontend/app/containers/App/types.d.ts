import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface GlobalState {
  loggedIn: boolean,
  error: string,
  currentlySending: boolean,
  apiToken: string,
}


/* --- ACTIONS --- */
type GlobalActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = GlobalState;
type ContainerActions = GlobalActions;

export { RootState, ContainerState, ContainerActions };
