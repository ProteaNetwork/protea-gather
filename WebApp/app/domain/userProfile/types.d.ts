import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

/* --- STATE --- */
interface UserProfileState {
  displayName: '',
  profileImage: '',
}


/* --- ACTIONS --- */
type AuthenticationActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = UserProfileState;
type ContainerActions = AuthenticationActions;

export { RootState, DomainState, ContainerActions };
