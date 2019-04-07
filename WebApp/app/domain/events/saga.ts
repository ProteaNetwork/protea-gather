import { saveCommunity } from "domain/communities/actions";
import { take, fork, call, put, all } from "@redux-saga/core/effects";

import * as EventManagerABI from "../../../../Blockchain/build/EventManagerV1.json";


// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { ethers } from "ethers";
import { ICommunity } from "domain/communities/types";
import { saveEvent, getEventMetaAction, checkStatus, statusUpdated } from "./actions";
import { IEvent } from "./types";
import eventSchema from "./schema";
import { getEventMeta as getEventMetaApi } from "api/api";
import { blockchainResources } from "blockchainResources";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};


async function getEvents(publishedBlock: number, eventManagerAddress: string){
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const eventManager = (await new ethers.Contract(eventManagerAddress, EventManagerABI.abi, provider)).connect(signer);

  const eventCreatedFilter: EventFilter = eventManager.filters.EventCreated(null);
  eventCreatedFilter.fromBlock = publishedBlock;
  let events = await Promise.all((await provider.getLogs(eventCreatedFilter)).map(async event => {
    const parsedLog = (eventManager.interface.parseLog(event));
    const eventData = await eventManager.getEvent(parsedLog.values.index);
    const attendees = await eventManager.getRSVPdAttendees(parsedLog.values.index);

    return {
      name: eventData[0],
      maxAttendees: eventData[1],
      requiredDai: parseInt(ethers.utils.formatUnits(eventData[2], 18)),
      state: eventData[3],
      attendees: attendees,
      eventId: `${eventManagerAddress}-${parsedLog.values.index}`,
      eventManagerAddress: eventManagerAddress,
      organizer: parsedLog.values.publisher,
    }
  }))
  return events;
}

async function checkMemberStateOnChain(eventId: string){
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();

  const eventManagerAddress = eventId.split('-')[0];
  const eventIndex = eventId.split('-')[1];
  const eventManagerContract = (await new ethers.Contract(eventManagerAddress, EventManagerABI.abi, provider)).connect(signer);
  const signerAddress = await signer.getAddress();

  return (await eventManagerContract.getUserState(signerAddress, eventIndex));
}

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
    console.log
  }
}

export function* populateCommunityEvents() {
  while(true){
    const community: ICommunity = (yield take(saveCommunity)).payload;
    const events: IEvent[] = yield call(getEvents, blockchainResources.publishedBlock, community.eventManagerAddress)
    yield all(events.map(event => (put(saveEvent(event)))));
    yield all(events.map((event: IEvent) => (put(checkStatus(event.eventId)))));
    yield all(events.map(event => (put(getEventMetaAction.request(event.eventId)))));
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
}

