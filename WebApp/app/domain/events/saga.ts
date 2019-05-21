import { ethers } from "ethers";
import { take, fork, call, put, all, select, delay, race } from "@redux-saga/core/effects";

import { saveCommunity } from "domain/communities/actions";
import { ICommunity } from "domain/communities/types";
import {
  saveEvent,
  getEventMetaAction,
  checkStatus,
  statusUpdated,
  createEventAction,
  startEventAction,
  endEventAction,
  cancelEventAction,
  changeEventLimitAction,
  manualConfirmAttendeesAction,
  rsvpAction,
  cancelRsvpAction,
  confirmAttendanceAction,
  claimGiftAction,
  getEventAction,
  updateEventAction
} from "./actions";
import { IEvent } from "./types";
import {
  getEventMeta as getEventMetaApi,
  createEvent as createEventApi,
  updateEvent as updateEventApi,
} from "api/api";
import { getEventsTx, checkMemberStateOnChain, publishEventToChain, getEvent, changeEventLimitTx, rsvpTx, cancelRsvpTx, startEventTx, confirmAttendanceTx, endEventTx, claimGiftTx, cancelEventTx, manualConfirmAttendeesTx } from "./chainInteractions";
import { setTxContextAction, setRemainingTxCountAction, setCommunityMutexAction } from "domain/transactionManagement/actions";
import { ApplicationRootState } from "types";
import { forwardTo } from "utils/history";

import { getLockedCommitmentTx, getTotalRemainingInUtilityTx } from "domain/membershipManagement/chainInteractions";
import { retry } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { blockchainResources, scanQrCode, verifySignature } from "blockchainResources";
import { scanQrCodeAction } from "containers/QrScannerContainer/actions";


export function* checkMemberState(eventId: string, membershipManagerAddress: string) {
  let memberState = yield call(checkMemberStateOnChain, eventId);
  let stakedTokens = memberState > 0 ? yield call(getLockedCommitmentTx, membershipManagerAddress, eventId) : 0;
  let totalTokensStaked = yield call(getTotalRemainingInUtilityTx, membershipManagerAddress, eventId);
  yield put(statusUpdated({ eventId: eventId, memberState: memberState, stakedTokens: stakedTokens, totalTokensStaked: totalTokensStaked }));
}

export function* populateCommunityEvents(community: ICommunity) {
  let events: IEvent[] = yield call(getEventsTx, community.eventManagerAddress)
  events = events.map(event => {
    event.membershipManagerAddress = community.membershipManagerAddress
    return event;
  })

  yield all(events.map(event => fork(resolveEvent, event.eventId, event.membershipManagerAddress)))
}

export function* getEventMeta(requestData) {
  try {
    const eventMeta = yield call(getEventMetaApi, requestData);
    yield put(getEventMetaAction.success(eventMeta.data));
  }
  catch (error) {
    yield put(getEventMetaAction.failure(error));
  }
}

export function* populateCommunityEventsListener() {
  while (true) {
    const community: ICommunity = (yield take(saveCommunity)).payload;
    yield fork(populateCommunityEvents, community);
  }
}

export function* resolveEvent(eventId: string, membershipManagerAddress: string) {
  let eventData = yield call(getEvent, eventId);
  eventData.membershipManagerAddress = membershipManagerAddress;
  eventData.communityName =  yield select((state: ApplicationRootState) => state.communities[eventData.tbcAddress].name);
  eventData.comLogo =  yield select((state: ApplicationRootState) => state.communities[eventData.tbcAddress].comLogo);
  yield put(saveEvent(eventData));
  yield put(checkStatus({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  yield put(getEventMetaAction.request(eventId));
}

// CRUD
export function* createEventInDb(event: IEvent) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    return (yield call(createEventApi, event, apiKey));
  }
  catch (error) {
    yield put(createEventAction.failure(error.message));
    return false;
  }
}

export function* createEvent() {
  while (true) {
    let newEvent: IEvent = (yield take(createEventAction.request)).payload;

    yield put(setTxContextAction(`Publishing your event to the chain`));
    yield put(setRemainingTxCountAction(1));
    try {
      newEvent = {
        ...newEvent,
        ...(yield retry(
          5,
          2000,
          publishEventToChain,
          newEvent.eventManagerAddress,
          newEvent.name,
          ethers.utils.bigNumberify(newEvent.maxAttendees),
          ethers.utils.parseUnits(`${newEvent.requiredDai}`, 18)))
      }

      yield put(setRemainingTxCountAction(0));
      yield put(setTxContextAction(`Storing images & meta data`));
      yield call(createEventInDb, newEvent);
      yield delay(500);

      yield put(createEventAction.success());
      yield call(forwardTo, `/events/${newEvent.eventId}`);
    }
    catch (error) {
      yield put(createEventAction.failure(error.message))
    }
  }
}

export function* startEvent(eventId: string, membershipManagerAddress: string) {
  try {
    yield put(setTxContextAction(`Starting the event`));
    yield put(setRemainingTxCountAction(1));

    yield retry(5, 2000, startEventTx, eventId);

    yield put(startEventAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(startEventAction.failure(e));
  }
}

export function* endEvent(eventId: string, membershipManagerAddress: string) {
  try {
    yield put(setTxContextAction(`Ending the event`));
    yield put(setRemainingTxCountAction(1));

    yield call(endEventTx, eventId);

    yield put(endEventAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(endEventAction.failure(e));
  }
}

export function* cancelEvent(eventId: string, membershipManagerAddress: string) {
  try {
    yield put(setTxContextAction(`Cancelling event`));
    yield put(setRemainingTxCountAction(1));

    yield retry(5, 2000, cancelEventTx, eventId);

    yield put(cancelEventAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(cancelEventAction.failure(e));
  }
}

export function* changeEventLimit(eventId: string, limit: number, membershipManagerAddress: string) {
  try {
    yield put(setTxContextAction(`Setting new max participant limit`));
    yield put(setRemainingTxCountAction(1));

    yield retry(5, 2000, changeEventLimitTx, eventId, limit);

    yield put(changeEventLimitAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(changeEventLimitAction.failure(e));
  }
}

export function* manualConfirmAttendees(eventId: string, attendees: string[], membershipManagerAddress: string) {
  try {
    yield put(setTxContextAction(`Confirming your list of attendees`));
    yield put(setRemainingTxCountAction(1));

    yield retry(5, 2000, manualConfirmAttendeesTx, eventId, attendees);

    yield put(manualConfirmAttendeesAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(manualConfirmAttendeesAction.failure(e));
  }
}


export function* rsvp(eventId: string, membershipManagerAddress: string, tbcAddress: string) {
  try {
    yield put(setTxContextAction(`RSVPing to the event`));
    yield put(setRemainingTxCountAction(1));
    yield put(setCommunityMutexAction(tbcAddress));

    yield retry(5, 2000, rsvpTx, eventId);

    yield put(rsvpAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(rsvpAction.failure(e));
  }
}

export function* cancelRsvp(eventId: string, membershipManagerAddress: string, tbcAddress: string) {
  try {
    yield put(setTxContextAction(`Cancelling RSVP`));
    yield put(setRemainingTxCountAction(1));
    yield put(setCommunityMutexAction(tbcAddress));

    yield retry(5, 2000, cancelRsvpTx, eventId);

    yield put(cancelRsvpAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(cancelRsvpAction.failure(e));
  }
}

export function* confirmAttendance(eventId: string, membershipManagerAddress: string, tbcAddress: string) {
  try {
    if(!blockchainResources.isMetaMask){
      yield put(scanQrCodeAction.request());
      const { fetchedMessage, failure } = yield race({
        failure: take(scanQrCodeAction.failure),
        fetchedMessage: take(scanQrCodeAction.success),
      });
      if(fetchedMessage){
        const organizer = yield select((state: ApplicationRootState) => state.events[eventId].organizer);
        const signer = yield call(verifySignature, eventId, fetchedMessage);
        if(signer != organizer){
          throw "Invalid QR data";
        }
      }else if(failure){
        throw failure
      }else{
        throw "Unknown scan error"
      }

    }
    yield put(setTxContextAction(`Confirming attendance to event`));
    yield put(setRemainingTxCountAction(1));

    yield put(setCommunityMutexAction(tbcAddress));

    yield retry(5, 2000, confirmAttendanceTx, eventId);

    yield put(confirmAttendanceAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(confirmAttendanceAction.failure(e));
  }
}

export function* claimGift(eventId: string, membershipManagerAddress: string, eventState: number, tbcAddress: string) {
  try {
    if (eventState == 3) {
      yield put(setTxContextAction(`Claiming gift of tokens for attending`));
    } else if (eventState == 4) {
      yield put(setTxContextAction(`Returning staked tokens`));
    }

    yield put(setRemainingTxCountAction(1));
    yield put(setCommunityMutexAction(tbcAddress));

    yield retry(5, 2000, claimGiftTx, eventId);

    yield put(claimGiftAction.success());
    yield delay(5000);
    yield put(getEventAction({ eventId: eventId, membershipManagerAddress: membershipManagerAddress }));
  }
  catch (e) {
    yield put(claimGiftAction.failure(e));
  }
}

// Listeners
export function* getEventListener() {
  while (true) {
    const eventData = (yield take(getEventAction)).payload;
    yield fork(resolveEvent, eventData.eventId, eventData.membershipManagerAddress);
  }
}

export function* getEventMetaListener() {
  while (true) {
    const requestData = (yield take(getEventMetaAction.request)).payload;
    yield fork(getEventMeta, requestData);
  }
}

export function* checkMemberStateListener() {
  while (true) {
    const eventData = (yield take(checkStatus)).payload;
    yield fork(checkMemberState, eventData.eventId, eventData.membershipManagerAddress);
  }
}

export function* startEventListener() {
  while (true) {
    const eventData = (yield take(startEventAction.request)).payload;
    yield fork(startEvent, eventData.eventId, eventData.membershipManagerAddress);
  }
}

export function* endEventListener() {
  while (true) {
    const eventData = (yield take(endEventAction.request)).payload;
    yield fork(endEvent, eventData.eventId, eventData.membershipManagerAddress);
  }
}

export function* cancelEventListener() {
  while (true) {
    const eventData = (yield take(cancelEventAction.request)).payload;
    yield fork(cancelEvent, eventData.eventId, eventData.membershipManagerAddress);
  }
}

export function* changeEventLimitListener() {
  while (true) {
    const eventData = (yield take(changeEventLimitAction.request)).payload;
    yield fork(changeEventLimit, eventData.eventId, eventData.limit, eventData.membershipManagerAddress);
  }
}

export function* manualConfirmAttendeeListener() {
  while (true) {
    const eventData = (yield take(manualConfirmAttendeesAction.request)).payload;
    yield fork(manualConfirmAttendees, eventData.eventId, eventData.attendees, eventData.membershipManagerAddress);
  }
}

export function* rsvpListener() {
  while (true) {
    const eventData = (yield take(rsvpAction.request)).payload;
    yield fork(rsvp, eventData.eventId, eventData.membershipManagerAddress, eventData.tbcAddress);
  }
}

export function* cancelRsvpListener() {
  while (true) {
    const eventData = (yield take(cancelRsvpAction.request)).payload;
    yield fork(cancelRsvp, eventData.eventId, eventData.membershipManagerAddress, eventData.tbcAddress);
  }
}

export function* confirmAttendanceListener() {
  while (true) {
    const eventData = (yield take(confirmAttendanceAction.request)).payload;

    yield fork(confirmAttendance, eventData.eventId, eventData.membershipManagerAddress, eventData.tbcAddress);
  }
}

export function* claimGiftListener() {
  while (true) {
    const eventData = (yield take(claimGiftAction.request)).payload;
    yield fork(claimGift, eventData.eventId, eventData.membershipManagerAddress, eventData.state, eventData.tbcAddress);
  }
}

export function* updateEvent(event: IEvent) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(updateEventApi, event, apiKey);
    yield put(updateEventAction.success());
    yield call(forwardTo, `/events/${event.eventId}`);
  } catch (error) {
    yield put(updateEventAction.failure(error.message));
  }
}

export function* updateEventListener() {
  while (true) {
    const action = yield take(getType(updateEventAction.request));
    yield fork(updateEvent, action.payload);
  }
}

export default function* root() {
  yield fork(populateCommunityEventsListener);
  yield fork(checkMemberStateListener);
  yield fork(getEventMetaListener);
  yield fork(getEventListener);
  yield fork(createEvent);
  yield fork(updateEventListener);

  yield fork(startEventListener);
  yield fork(endEventListener);
  yield fork(cancelEventListener);
  yield fork(changeEventLimitListener);
  yield fork(manualConfirmAttendeeListener);
  yield fork(rsvpListener);
  yield fork(cancelRsvpListener);
  yield fork(confirmAttendanceListener);
  yield fork(claimGiftListener);
}



// memberhsi 0x1202687EA1422c8ECf63bf4b366001BA1f0cf860
// event "0x853409477090D89e8291997d167dA0cFb665f962-4"
