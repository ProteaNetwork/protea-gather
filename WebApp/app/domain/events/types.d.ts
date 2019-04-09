import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { ApplicationRootState } from 'types';

interface IEvent{
  eventId: string; // eventManagerAddress-eventIndex

  eventManagerAddress: string;
  membershipManagerAddress: string;
  organizer: string;

  attendees: string[];
  maxAttendees: number
  requiredDai: number
  state: number;
  totalTokensStaked: number;
  gift: number;

  confirmedAttendees: string[];

  name: string;
  bannerImage: string;
  description: string;
  date: Date;
  memberState: Number;
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
