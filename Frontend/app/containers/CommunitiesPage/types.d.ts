import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface CommunitiesPageState {
  readonly searchParameter: string;
  readonly sortParameter: number;
}


/* --- ACTIONS --- */
type CommunitiesPageActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type ContainerState = CommunitiesPageState;
type ContainerActions = CommunitiesPageActions;

export { RootState, ContainerState, ContainerActions };
