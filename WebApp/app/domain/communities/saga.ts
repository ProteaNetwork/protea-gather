import { fork, take, call, put, select, all } from "redux-saga/effects";
import { getAllCommunities, saveCommunity, getCommunityMetaAction, checkStatus, statusUpdated } from "./actions";

import * as CommunityFactoryABI from "../../../../Blockchain/build/CommunityFactoryV1.json";
import * as MembershipManagerAbi from "../../../../Blockchain/build/MembershipManagerV1.json";
import { ethers } from "ethers";
import { getCommunityMeta as getCommunityMetaApi } from "api/api";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { blockchainResources } from "blockchainResources";
import { ICommunity } from "./types";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};


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

export function* checkIfUserIsMember(){
  while(true){
    const community: ICommunity = (yield take(checkStatus)).payload;
    const isMember = yield call(checkUserStateOnChain, community.membershipManagerAddress);
    yield put(statusUpdated({tbcAddress: community.tbcAddress, isMember: isMember}));
  }
}

export function* getCommunityMeta() {
  while(true){
    const request = yield take(getCommunityMetaAction.request);
    try{
      const communityMeta = yield call(getCommunityMetaApi, request.payload);
      yield put(getCommunityMetaAction.success(communityMeta.data))
    }
    catch(error) {
      console.log("No meta found");
    }
  }
}

export function* fetchAllCommunities() {
  while(true){
    yield take(getAllCommunities);

    const communities = yield call(getCommunities, blockchainResources.publishedBlock);
    yield all(communities.map(com => (put(saveCommunity(com)))))

    yield all(communities.map((com: ICommunity) => (put(checkStatus({tbcAddress: com.tbcAddress, membershipManagerAddress: com.membershipManagerAddress})))))

    yield all(communities.map(com => (put(getCommunityMetaAction.request(com.tbcAddress)))))
  }
}

export default function* root() {
  yield fork(fetchAllCommunities);
  yield fork(getCommunityMeta);
  yield fork(checkIfUserIsMember);
}
