import { fork, take, call, put, select, all } from "redux-saga/effects";
import { getAllCommunities, saveCommunity, getCommunityMetaAction, checkStatus, statusUpdated, createCommunityAction } from "./actions";

import * as CommunityFactoryABI from "../../../../Blockchain/build/CommunityFactoryV1.json";
import * as MembershipManagerAbi from "../../../../Blockchain/build/MembershipManagerV1.json";
import { ethers } from "ethers";
import { getCommunityMeta as getCommunityMetaApi } from "api/api";
import { createCommunity as createCommunityApi } from "api/api";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { blockchainResources } from "blockchainResources";
import { ICommunity } from "./types";
import { ApplicationRootState } from "types";
import { forwardTo } from "utils/history";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};

// Blockchain interactions

// View/Read
async function checkUserStateOnChain(membershipManagerAddress: string) {
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const membershipManager = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);

  const memberstate = await membershipManager.getMembershipStatus(signer.getAddress());
  // var date = new Date(parseInt(ethers.utils.formatUnits(memberstate[0],0))*1000);

  return parseInt(ethers.utils.formatUnits(memberstate[0],0))> 0 ? true : false;
  // TODO: To increase the validity of this, if the balance is zero, read the staking logs to see if user is just active;

}

async function getCommunities(publishedBlock: number) {
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const communityFactory = (await new ethers.Contract(`${process.env.COMMUNITY_FACTORY_ADDRESS}`, CommunityFactoryABI.abi, provider)).connect(signer);

  const filterCommunitiesCreated:EventFilter = communityFactory.filters.CommunityCreated(null, null, null);
  filterCommunitiesCreated.fromBlock = publishedBlock;
  const communities = (await provider.getLogs(filterCommunitiesCreated)).map(e => {
    const parsedLog = (communityFactory.interface.parseLog(e));
    return {
      tbcAddress: parsedLog.values.tokenManager,
      eventManagerAddress: parsedLog.values.utilities[0],
      membershipManagerAddress: parsedLog.values.membershipManager
    }
  });
  return communities
}

// Write/Publish
async function publishCommunityToChain(name: string, tokenSymbol: string, gradientDenominator: number, contributionRate: number) {
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const communityFactory = (await new ethers.Contract(`${process.env.COMMUNITY_FACTORY_ADDRESS}`, CommunityFactoryABI.abi, provider)).connect(signer);
  const transactionReceipt = await(await communityFactory.createCommunity(name, tokenSymbol, signer.getAddress(), gradientDenominator, contributionRate)).wait();
  // TODO: Error handling
  const communityCreatedEvent = communityFactory.interface.parseLog(await(transactionReceipt.events.filter(
    event => event.eventSignature == communityFactory.interface.events.CommunityCreated.signature
  ))[0]);

  return {
    tbcAddress: communityCreatedEvent.values.tokenManager,
    membershipManagerAddress: communityCreatedEvent.values.membershipManager,
    eventManagerAddress: communityCreatedEvent.values.utilities[0]
  }
}


// Generators
// Meta
export function* checkIfUserIsMember(community){
  const isMember = yield call(checkUserStateOnChain, community.membershipManagerAddress);
  yield put(statusUpdated({tbcAddress: community.tbcAddress, isMember: isMember}));
}


// Executors
export function* getCommunityMeta(requestData) {
  try{
    const communityMeta = yield call(getCommunityMetaApi, requestData);
    yield put(getCommunityMetaAction.success(communityMeta.data))
  }
  catch(error) {
    console.log("No meta found");
  }
}


export function* fetchAllCommunities() {
  while(true){
    yield take(getAllCommunities);
    yield
    const communities = yield call(getCommunities, blockchainResources.publishedBlock);
    yield all(communities.map(com => (put(saveCommunity(com)))))

    yield all(communities.map((com: ICommunity) => (put(checkStatus({tbcAddress: com.tbcAddress, membershipManagerAddress: com.membershipManagerAddress})))))

    yield all(communities.map(com => (put(getCommunityMetaAction.request(com.tbcAddress)))))
  }
}

// CRUD
export function* createCommunityInDB(community: ICommunity){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try{
    return (yield call(createCommunityApi, community, apiKey));
  }
  catch(error){
    yield put(createCommunityAction.failure(error.message));
    return false;
  }
}

export function* createCommunity() {
  while(true){
    let newCommunity: ICommunity = (yield take(createCommunityAction.request)).payload;

    try{
      newCommunity = {
        ...newCommunity,
        ...(yield call(publishCommunityToChain, newCommunity.name, newCommunity.tokenSymbol, newCommunity.gradientDenominator, newCommunity.contributionRate))
      }
      yield call(createCommunityInDB, newCommunity);
      yield put(createCommunityAction.success());
      yield call(forwardTo, `/communities/${newCommunity.tbcAddress}`);
    }
    catch(error){
      yield put(createCommunityAction.failure(error.message))
    }
  }
}

// Listeners
export function* getCommunityMetaListener() {
  while(true){
    const requestData = (yield take(getCommunityMetaAction.request)).payload;
    yield fork(getCommunityMeta, requestData);
  }
}

export function* checkIfUserIsMemberListener(){
  while(true){
    const community: ICommunity = (yield take(checkStatus)).payload;
    yield fork(checkIfUserIsMember, community);
  }
}

export default function* root() {
  yield fork(fetchAllCommunities);
  yield fork(getCommunityMetaListener);
  yield fork(checkIfUserIsMemberListener);
  yield fork(createCommunity);
}
