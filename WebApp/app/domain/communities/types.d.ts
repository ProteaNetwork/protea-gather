import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

interface ICommunity{
  tbcAddress: string;
  eventManagerAddress: string;
  membershipManagerAddress: string;
  banner: string;
  name: string;
  tokenSymbol: string;
  description: string;
  tags: any;
  isMember: boolean;
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
