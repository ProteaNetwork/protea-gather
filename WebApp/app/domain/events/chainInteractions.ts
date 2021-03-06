import { abi as EventManagerABI } from "../../../../Blockchain/build/EventManagerV1.json";

import { ethers } from "ethers";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { BigNumber } from "ethers/utils";
import { blockchainResources, getBlockchainObjects } from "blockchainResources";
import { IMember } from "domain/membershipManagement/types.js";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};


// View
export async function getEventConfirmedAttendees(eventId: string): Promise<string[]>{
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.bigNumberify(eventId.split('-')[1]);
    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);

    const filterMemberAttended:EventFilter = eventManagerContract.filters.MemberAttended(eventIndex, null);
    filterMemberAttended.fromBlock = blockchainResources.publishedBlock;
    const attendees = (await provider.getLogs(filterMemberAttended)).map(event => {
      const parsedLog = (eventManagerContract.interface.parseLog(event));
      return parsedLog.values.member
    });

    return attendees;
  }
  catch(e){
    throw e;
  }

}


export async function getEvent(eventId: string){
  const eventManagerAddress = eventId.split('-')[0];
  const eventIndex = eventId.split('-')[1];

  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);

    const eventData = await eventManagerContract.getEvent(eventIndex);
    const attendees: IMember[] = (await eventManagerContract.getRSVPdAttendees(eventIndex)).map(ethAddress => ({ethAddress: ethAddress, profileImage:"", name: ""}));
    const organizer = await eventManagerContract.getOrganiser(eventIndex);
    const tbcAddress = await eventManagerContract.tokenManager();

    let confirmedAttendees:string[] = [];
    if(eventData[3] > 1){
      confirmedAttendees = await getEventConfirmedAttendees(eventId);
    }

    return {
      name: eventData[0],
      maxAttendees: eventData[1],
      requiredDai: parseFloat(ethers.utils.formatUnits(eventData[2], 18)),
      state: eventData[3],
      attendees: attendees,
      confirmedAttendees: confirmedAttendees,
      eventId: eventId,
      eventManagerAddress: eventManagerAddress,
      tbcAddress: tbcAddress,
      organizer: organizer
    }
  }
  catch(e){
    throw e;
  }

}

export async function getEventsTx(eventManagerAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);

    const eventCreatedFilter: EventFilter = eventManagerContract.filters.EventCreated(null);
    eventCreatedFilter.fromBlock = blockchainResources.publishedBlock;
    let events = await Promise.all((await provider.getLogs(eventCreatedFilter)).map(async event => {
      const parsedLog = (eventManagerContract.interface.parseLog(event));
      const eventData = await eventManagerContract.getEvent(parsedLog.values.index);
      const attendees: IMember[] = (await eventManagerContract.getRSVPdAttendees(parsedLog.values.index)).map(ethAddress => ({ethAddress: ethAddress, profileImage:"", name: ""}));
      let confirmedAttendees:string[] = [];
      if(eventData[3] > 1){
        confirmedAttendees = await getEventConfirmedAttendees(`${eventManagerAddress}-${parsedLog.values.index}`);
      }
      return {
        name: eventData[0],
        gift: parseFloat(ethers.utils.formatUnits(eventData[4], 18)),
        maxAttendees: eventData[1],
        requiredDai: parseFloat(ethers.utils.formatUnits(eventData[2], 18)),
        state: eventData[3],
        attendees: attendees,
        confirmedAttendees: confirmedAttendees,
        eventId: `${eventManagerAddress}-${parsedLog.values.index}`,
        eventManagerAddress: eventManagerAddress,
        organizer: parsedLog.values.publisher,
      }
    }))
    return events;
  }
  catch(e){
    throw e;
  }

}

export async function checkMemberStateOnChain(eventId: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = eventId.split('-')[1];
    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);
    const signerAddress = await signer.getAddress();

    return (await eventManagerContract.getUserState(signerAddress, eventIndex));
  }
  catch(e){
    throw e;
  }

}

export async function getCommunityAddressTx(eventManagerAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);
    return (await eventManagerContract.tokenManager());
  }
  catch(e){
    throw e;
  }
}


// Write/Publish
export async function publishEventToChain(eventManagerAddress: string, name: string, maxAttendees: BigNumber, requiredDai: BigNumber) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);
    const signerAddress = await signer.getAddress();

    const txReceipt = await(await eventManagerContract.createEvent(name, maxAttendees, signerAddress, requiredDai)).wait();
    // TODO: Error handling
    const eventCreatedEvent = eventManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.EventCreated.signature
    ))[0]);

    return {
      eventId: `${eventManagerAddress}-${parseInt(ethers.utils.formatUnits(eventCreatedEvent.values.index, 0))}`,
      organizer: eventCreatedEvent.values.publisher,
      name: name,
      state: 1
    }
  }
  catch(e){
    throw e;
  }

}

// Controls

export async function startEventTx(eventId: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();

    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);


    const txReceipt = await(await eventManagerContract.startEvent(eventIndex)).wait();
    // TODO: Error handling
    const eventStartedEvent = eventManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.EventStarted.signature
    ))[0]);

    return
  }
  catch(e){
    throw e;
  }

}

export async function endEventTx(eventId: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();

    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);


    const txReceipt = await(await eventManagerContract.endEvent(eventIndex)).wait();
    // TODO: Error handling
    const eventConcludedEvent = eventManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.EventConcluded.signature
    ))[0]);

    return
  }
  catch(e){
    throw e;
  }

}

export async function cancelEventTx(eventId: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();

    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);


    const txReceipt = await(await eventManagerContract.cancelEvent(eventIndex)).wait();
    // TODO: Error handling
    const eventConcludedEvent = eventManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.EventConcluded.signature
    ))[0]);

    return
  }
  catch(e){
    throw e;
  }

}


export async function changeEventLimitTx(eventId: string, limit: number) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const limitBn = ethers.utils.bigNumberify(limit);

    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);
    const txReceipt = await(await eventManagerContract.changeParticipantLimit(eventIndex, limitBn)).wait();
    return;
  }
  catch(e){
    throw e;
  }

}


export async function manualConfirmAttendeesTx(eventId: string, attendees: string[]) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);


    const txReceipt = await(await eventManagerContract.organiserConfirmAttendance(eventIndex, attendees)).wait();
    // TODO: Error handling
    const memberAttendedEvents = await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.MemberAttended.signature
    )).map(log => eventManagerContract.interface.parseLog(log));

    return
  }
  catch(e){
    throw e;
  }

}


export async function rsvpTx(eventId: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);
    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);


    const txReceipt = await(await eventManagerContract.rsvp(eventIndex)).wait();
    // TODO: Error handling
    const memberRegisteredEvent = eventManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.MemberRegistered.signature
    ))[0]);

    return
  }
  catch(e){
    throw e;
  }

}

export async function cancelRsvpTx(eventId: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);


    const txReceipt = await(await eventManagerContract.cancelRsvp(eventIndex)).wait();
    // TODO: Error handling
    const memberCancelledEvent = eventManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.MemberCancelled.signature
    ))[0]);

    return
  }
  catch(e){
    throw e;
  }

}

export async function confirmAttendanceTx(eventId: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);


    const txReceipt = await(await eventManagerContract.confirmAttendance(eventIndex)).wait();
    // TODO: Error handling
    const memberAttendedEvent = eventManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == eventManagerContract.interface.events.MemberAttended.signature
    ))[0]);

    return
  }
  catch(e){
    throw e;
  }

}

export async function claimGiftTx(eventId: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const signerAddress = await signer.getAddress();
    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.parseUnits(eventId.split('-')[1], 0);

    const eventManagerContract = (await new ethers.Contract(eventManagerAddress, JSON.stringify(EventManagerABI), provider)).connect(signer);

    const txReceipt = await(await eventManagerContract.claimGift(signerAddress, eventIndex)).wait();
    // TODO: Error handling

    return
  }
  catch(e){
    throw e;
  }

}
