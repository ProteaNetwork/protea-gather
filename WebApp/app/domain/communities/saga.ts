import { fork, take, call, put, select, all, delay, takeLatest } from "redux-saga/effects";
import {
  getAllCommunitiesAction,
  saveCommunity,
  getCommunityMetaAction,
  createCommunityAction,
  getCommunityAction,
  joinCommunityAction,
  updateCommunityAction,
} from "./actions";
import { ethers } from "ethers";
import {
  getCommunityMeta as getCommunityMetaApi,
  createCommunity as createCommunityApi,
  updateCommunity as updateCommunityApi
 } from "api/api";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { ICommunity } from "./types";
import { ApplicationRootState } from "types";
import { forwardTo } from "utils/history";
import { getCommunityFromChain, publishCommunityToChain, getCommunitiesFromChain, updateTransferApproval, mintTokens, getTokenVolumeBuy, getDaiValueBurn, checkTransferApprovalState, getTokenBalance } from "./chainInteractions";
import { checkStatus, getMembersAction } from "domain/membershipManagement/actions";
import { setRemainingTxCountAction, setTxContextAction } from "domain/transactionManagement/actions";
import { registerUtility, setReputationReward, increaseMembershipStake } from "domain/membershipManagement/chainInteractions";
import { retry } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { BigNumber } from "ethers/utils";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};

// Meta
export function* getCommunityMeta(requestData) {
  try{
    const communityMeta = yield call(getCommunityMetaApi, requestData);
    yield put(getCommunityMetaAction.success(communityMeta.data))
  }
  catch(error) {
    yield put(getCommunityMetaAction.failure(error))
  }
}

// Executors
export function* fetchCommunity(tbcAddress){
  const fetchedAddresses = yield call(getCommunityFromChain, tbcAddress);
  if(fetchedAddresses){
    yield put(getCommunityAction.success());
    yield fork(resolveCommunity,  {
      ...fetchedAddresses
    });
  }else{
    yield put(getCommunityAction.failure("Community not found"))
  }

}
export function* resolveCommunity(community){
  yield put(saveCommunity(community));
  yield put(checkStatus({tbcAddress: community.tbcAddress, membershipManagerAddress: community.membershipManagerAddress}));
  yield put(getMembersAction({tbcAddress: community.tbcAddress, membershipManagerAddress: community.membershipManagerAddress}));
  yield put(getCommunityMetaAction.request(community.tbcAddress));
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

export function* updateCommunityInDB(community: ICommunity){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    return (yield call(updateCommunityApi, community, apiKey));
  }
  catch(error) {
    yield put(createCommunityAction.failure(error.message));
    return false;
  }
}

export function* createCommunity() {
  while(true){
    let newCommunity: ICommunity = (yield take(createCommunityAction.request)).payload;
    try{
      yield put(setRemainingTxCountAction(3));
      yield put(setTxContextAction(`Publishing your community to the chain` ));
      newCommunity = {
        ...newCommunity,
        ...(yield retry(5, 2000, publishCommunityToChain, newCommunity.name, newCommunity.tokenSymbol, newCommunity.gradientDenominator, newCommunity.contributionRate))
      }

      yield put(setRemainingTxCountAction(2));
      yield put(setTxContextAction(`Registering the events management module` ));

      yield retry(5, 2000, registerUtility, newCommunity.eventManagerAddress, newCommunity.membershipManagerAddress)

      yield put(setRemainingTxCountAction(1));
      yield put(setTxContextAction(`Setting reputation tracking on the events module` ));
      yield retry(5, 2000, setReputationReward,
        newCommunity.eventManagerAddress,
        newCommunity.membershipManagerAddress,
        ethers.utils.parseUnits('0', 0),
        ethers.utils.parseUnits(`${newCommunity['reputationForAttendance']}`, 0),
      )

      yield put(setRemainingTxCountAction(0));
      yield put(setTxContextAction(`Storing images & meta data`));
      yield call(createCommunityInDB, newCommunity);

      yield put(createCommunityAction.success());
      yield call(forwardTo, `/communities/${newCommunity.tbcAddress}`);
    }
    catch(error){
      yield put(createCommunityAction.failure(error.message))
    }
  }
}

export function* joinCommunity(){
  while(true){
    const communityData = (yield take(joinCommunityAction.request)).payload;
    try{
      const approvalState = yield call(checkTransferApprovalState, communityData.tbcAddress)
      if(!approvalState){
        yield put(setRemainingTxCountAction(3));
        yield put(setTxContextAction("Unlocking Dai transfers to the community"));
        yield retry(5, 2000, updateTransferApproval, true, communityData.tbcAddress)
      }
      const tokenVolume = yield retry(5, 2000, getTokenVolumeBuy, communityData.tbcAddress, ethers.utils.parseUnits(`${communityData.daiValue}`, 18));
      const liquidTokenBalanceBN = yield call(getTokenBalance, communityData.tbcAddress);
      let mintedVolume: BigNumber = ethers.utils.bigNumberify(0);
      if(liquidTokenBalanceBN.eq(0)){
        // If no tokens have been minted
        yield put(setRemainingTxCountAction(2));
        yield put(setTxContextAction(`Purchasing ${communityData.daiValue} Dai worth of community tokens.`));
        mintedVolume = yield retry(5, 2000, mintTokens, tokenVolume, communityData.tbcAddress);
      }else if(liquidTokenBalanceBN.lt(tokenVolume)){
        // A mint occured externally to this user, price has changed so mint whats needed
        yield put(setRemainingTxCountAction(2));
        yield put(setTxContextAction(`Purchasing ${communityData.daiValue} Dai worth of community tokens.`));
        mintedVolume = yield retry(5, 2000, mintTokens, tokenVolume.sub(liquidTokenBalanceBN), communityData.tbcAddress);
      }else if(liquidTokenBalanceBN.gte(tokenVolume)){
        // Theres enough for the mint
        mintedVolume = tokenVolume;
      }

      // stake
      yield put(setRemainingTxCountAction(1));
      yield put(setTxContextAction(`Reserving community tokens for membership.`));
      const mintedDaiValue = yield retry(5, 2000, getDaiValueBurn, communityData.tbcAddress, mintedVolume);
      yield retry(5, 2000, increaseMembershipStake, mintedDaiValue, communityData.membershipManagerAddress)

      yield put(setRemainingTxCountAction(0));
      yield put(joinCommunityAction.success());
    }
    catch(e){
      yield put(setRemainingTxCountAction(0));
      yield put(joinCommunityAction.failure(e));
    }
  }
}

// Listeners
export function* getAllCommunitiesListener() {
  while(true){
    yield take(getAllCommunitiesAction);

    const communities = yield call(getCommunitiesFromChain);
    yield all(communities.map(com => (fork(resolveCommunity, com))))
  }
}

export function* getCommunityListener(){
  while(true){
    const tbcAddress = (yield take(getCommunityAction.request)).payload;
    yield fork(fetchCommunity, tbcAddress);
  }
}

export function* updateCommunity(community: ICommunity) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    yield call(updateCommunityApi, community, apiKey);
    yield put(updateCommunityAction.success());
    yield call(forwardTo, `/communities/${community.tbcAddress}`);
  } catch (error) {
    yield put(updateCommunityAction.failure(error.message));
  }
}

export function* updateCommunityListener(){
  while(true){
    const action = yield take(getType(updateCommunityAction.request));
    yield fork(updateCommunity, action.payload);
  }
}

export function* getCommunityMetaListener() {
  while(true){
    const requestData = (yield take(getCommunityMetaAction.request)).payload;
    yield fork(getCommunityMeta, requestData);
  }
}

export default function* root() {
  yield fork(getAllCommunitiesListener);
  yield fork(getCommunityMetaListener);
  yield fork(createCommunity);
  yield fork(getCommunityListener);
  yield fork(updateCommunityListener);
  yield fork(joinCommunity);
}
