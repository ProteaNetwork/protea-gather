import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface CommunityPageState {
  readonly default: any;
}


/* --- ACTIONS --- */
type CommunityPageActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = CommunityPageState;
type ContainerActions = CommunityPageActions;

export { RootState, ContainerState, ContainerActions };