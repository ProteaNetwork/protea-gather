import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

interface ICommunity{
  tbcAddress: string;
  eventManagerAddress: string;
  membershipManagerAddress: string;
  bannerImage: string;
  name: string;
  tokenSymbol: string;
  gradientDenominator: number;
  contributionRate: number;
  description: string;
  isMember: boolean;
  transfersUnlocked: boolean;
  availableStake: number;
  memberSince: Date;
  liquidTokens: number;
  isAdmin: boolean;
  comLogo: string
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
