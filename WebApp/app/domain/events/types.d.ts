import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';
import { IMember } from 'domain/membershipManagement/types';

interface IEvent{
  eventId: string; // eventManagerAddress-eventIndex

  eventManagerAddress: string;
  membershipManagerAddress: string;
  tbcAddress: string;

  communityName: string;
  comLogo: string;

  organizer: string;

  attendees: IMember[];
  maxAttendees: number
  requiredDai: number
  state: number;
  totalTokensStaked: number;
  gift: number;

  confirmedAttendees: string[];

  name: string;
  bannerImage: string;
  description: string;
  eventDate: Date;
  memberState: Number;

  networkId: number;
}

/* --- STATE --- */
interface EventsState {
  [eventID: string]: IEvent;
}

/* --- ACTIONS --- */
type EventsActions = ActionType<typeof actions>;

/* --- EXPORTS --- */

type RootState = ApplicationRootState;
type DomainState = EventsState;
type DomainActions = EventsActions;

export { RootState, DomainState, DomainActions, IEvent };
