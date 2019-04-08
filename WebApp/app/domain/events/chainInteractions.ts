import * as EventManagerABI from "../../../../Blockchain/build/EventManagerV1.json";

import { ethers } from "ethers";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { BigNumber } from "ethers/utils";
import { blockchainResources } from "blockchainResources";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};


export async function getEvents(eventManagerAddress: string){
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const eventManager = (await new ethers.Contract(eventManagerAddress, EventManagerABI.abi, provider)).connect(signer);

  const eventCreatedFilter: EventFilter = eventManager.filters.EventCreated(null);
  eventCreatedFilter.fromBlock = blockchainResources.publishedBlock;
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

export async function checkMemberStateOnChain(eventId: string){
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();

  const eventManagerAddress = eventId.split('-')[0];
  const eventIndex = eventId.split('-')[1];
  const eventManagerContract = (await new ethers.Contract(eventManagerAddress, EventManagerABI.abi, provider)).connect(signer);
  const signerAddress = await signer.getAddress();

  return (await eventManagerContract.getUserState(signerAddress, eventIndex));
}


// Write/Publish
export async function publishEventToChain(eventManagerAddress: string, name: string, maxAttendees: BigNumber, requiredDai: BigNumber) {
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const eventManagerContract = (await new ethers.Contract(eventManagerAddress, EventManagerABI.abi, provider)).connect(signer);
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
