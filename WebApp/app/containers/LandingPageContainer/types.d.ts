import { ActionType } from 'typesafe-actions';
// import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface LandingPageContainerState {
  readonly default: any;
}

/* --- ACTIONS --- */
// type LandingPageContainerActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = LandingPageContainerState;
// type ContainerActions = LandingPageContainerActions;

export { RootState, ContainerState, /* ContainerActions */ };
