import { saveCommunity } from "domain/communities/actions";
import { take, fork, call, put, all, select, delay } from "@redux-saga/core/effects";

import { ICommunity } from "domain/communities/types";
import { saveEvent, getEventMetaAction, checkStatus, statusUpdated, createEventAction } from "./actions";
import { IEvent } from "./types";
import { getEventMeta as getEventMetaApi } from "api/api";
import { getEvents, checkMemberStateOnChain, publishEventToChain } from "./chainInteractions";
import { setTxContextAction, setRemainingTxCountAction } from "domain/transactionManagement/actions";
import { ApplicationRootState } from "types";
import { forwardTo } from "utils/history";

import { createEvent as createEventApi } from "api/api";
import { ethers } from "ethers";


export function* checkMemberState(eventId){
  const memberState = yield call(checkMemberStateOnChain, eventId);
  yield put(statusUpdated({eventId: eventId, memberState: memberState}));
}

export function* getEventMeta(requestData){
  try{
    const eventMeta = yield call(getEventMetaApi, requestData);
    yield put(getEventMetaAction.success(eventMeta.data));
  }
  catch(error){
    yield put(getEventMetaAction.failure(error));
  }
}

export function* populateCommunityEvents() {
  while(true){
    const community: ICommunity = (yield take(saveCommunity)).payload;
    const events: IEvent[] = yield call(getEvents, community.eventManagerAddress)
    yield all(events.map(event => (put(saveEvent(event)))));
    yield all(events.map((event: IEvent) => (put(checkStatus(event.eventId)))));
    yield all(events.map(event => (put(getEventMetaAction.request(event.eventId)))));
  }
}

// CRUD
export function* createEventInDb(event: IEvent){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try{
    return (yield call(createEventApi, event, apiKey));
  }
  catch(error){
    yield put(createEventAction.failure(error.message));
    return false;
  }
}

export function* createEvent(){
  while(true){
    let newEvent: IEvent = (yield take(createEventAction.request)).payload;

    yield put(setTxContextAction(`Publishing your event to the chain` ));
    yield put(setRemainingTxCountAction(1));
    try{
      newEvent = {
        ...newEvent,
        ...(yield call(
          publishEventToChain,
          newEvent.eventManagerAddress,
          newEvent.name,
          ethers.utils.bigNumberify(newEvent.maxAttendees),
          ethers.utils.parseUnits(`${newEvent.requiredDai}`, 18)))
      }
      // newEvent = {
      //   ...newEvent,
      //   eventId: "0x-0",
      //   organizer: "0x",
      //   name: "test",
      //   state: 1,

      // }
      yield put(setRemainingTxCountAction(0));
      yield put(setTxContextAction(`Storing images & meta data` ));
      yield call(createEventInDb, newEvent);
      yield delay(500);

      yield put(createEventAction.success());
      yield call(forwardTo, `/events/${newEvent.eventId}`);
    }
    catch(error){
      yield put(createEventAction.failure(error.message))
    }
  }
}

// Listeners
export function* getEventMetaListener(){
  while(true){
    const requestData = (yield take(getEventMetaAction.request)).payload;
    yield fork(getEventMeta, requestData);
  }
}

export function* checkMemberStateListener(){
  while(true){
    const eventId = (yield take(checkStatus)).payload;
    yield fork(checkMemberState, eventId);
  }
}

export default function* root() {
  yield fork(populateCommunityEvents);
  yield fork(checkMemberStateListener);
  yield fork(getEventMetaListener);
  yield fork(createEvent);
}

