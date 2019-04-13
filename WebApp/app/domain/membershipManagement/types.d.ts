import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';
import { ICommunity } from 'domain/communities/types';

export interface IMemberArray{
  [key: string]: IMember;
}

export interface IMember{
  ethAddress: string;
  name: string;
  profileImage: string;
}

/* --- STATE --- */
interface CommunitiesState {

}

/* --- ACTIONS --- */
type CommunitiesActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = CommunitiesState;
type DomainActions = CommunitiesActions;

export { RootState, DomainState, DomainActions, ICommunity };
