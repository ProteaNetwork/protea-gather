import { fork, take, call, put, select, all, delay, takeLatest } from "redux-saga/effects";
import {
  getAllCommunitiesAction,
  saveCommunity,
  getCommunityMetaAction,
  createCommunityAction,
  getCommunityAction,
  joinCommunityAction,
  updateCommunityAction,
  resetCommunitiesAction,
  removeCommunityAction,
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
import { getCommunityFromChain, publishCommunityToChain, getCommunitiesFromChain, updateTransferApproval, mintTokens, getTokenVolumeBuy, getDaiValueBurn, checkTransferApprovalState, getTokenBalance, getDaiValueMint, BLTMCalculateTargetTokens, BLTMPriceToMint, BLTMExportPriceCalculation } from "./chainInteractions";
import { checkStatus, getMembersAction } from "domain/membershipManagement/actions";
import { setRemainingTxCountAction, setTxContextAction, setCommunityMutexAction } from "domain/transactionManagement/actions";
import { registerUtility, setReputationReward, increaseMembershipStake } from "domain/membershipManagement/chainInteractions";
import { retry } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { BigNumber } from "ethers/utils";
import { blockchainResources } from "blockchainResources";
import { removeEventAction, resetEventsAction } from "domain/events/actions";
import { setEthAddress } from "domain/authentication/actions";

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
  yield put(saveCommunity({...community, networkId: blockchainResources.networkId}));
  yield put(checkStatus({tbcAddress: community.tbcAddress, membershipManagerAddress: community.membershipManagerAddress}));
  yield put(getMembersAction({tbcAddress: community.tbcAddress, membershipManagerAddress: community.membershipManagerAddress}));
  yield put(getCommunityMetaAction.request(community.tbcAddress));
}

// CRUD
export function* createCommunityInDB(community: ICommunity){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try{
    return (yield call(createCommunityApi, {...community, networkId: blockchainResources.networkId}, apiKey));
  }
  catch(error){
    yield put(createCommunityAction.failure(error.message));
    return false;
  }
}

export function* updateCommunityInDB(community: ICommunity){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    return (yield call(updateCommunityApi, {...community, networkId: blockchainResources.networkId}, apiKey));
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

export function* joinCommunity(communityData: {tbcAddress:string, daiValue: number, membershipManagerAddress: string}){
  try{
    const approvalState = yield call(checkTransferApprovalState, communityData.tbcAddress)
    if(!approvalState){
      yield put(setRemainingTxCountAction(3));
      yield put(setTxContextAction("Unlocking Dai transfers to the community"));
      yield retry(5, 2000, updateTransferApproval, true, communityData.tbcAddress)
      yield delay(2000);
    }

    // Typescript randomly casts this as a number despite casting or typing
    const contributionRate:number  = parseInt(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].contributionRate)}`);
    const totalSupplyBN: BigNumber = ethers.utils.parseUnits(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].totalSupply)}`, 18)
    const gradientDenominator: number = parseInt(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].gradientDenominator)}`);
    const poolBalance: BigNumber = ethers.utils.parseUnits(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].poolBalance)}`, 18);

    const liquidTokenBalanceBN = yield call(getTokenBalance, communityData.tbcAddress);
    const liquidTokensValuationBN = yield call(getDaiValueBurn, communityData.tbcAddress, liquidTokenBalanceBN);

    let mintedVolume: BigNumber = ethers.utils.bigNumberify(0);

    const daiValueBN = ethers.utils.parseUnits(`${communityData.daiValue}`, 18);
    let tokenVolume = yield call(BLTMCalculateTargetTokens, daiValueBN, gradientDenominator, contributionRate, totalSupplyBN);

    //Calculate root puchase volume
    const targetDaiBN = yield call(BLTMExportPriceCalculation, daiValueBN,  parseInt(`${contributionRate}`), totalSupplyBN, poolBalance, gradientDenominator);

    if(liquidTokenBalanceBN.eq(0)){
      // If no tokens have been minted
      yield put(setRemainingTxCountAction(2));
      const priceToMint = yield call(BLTMPriceToMint, tokenVolume, totalSupplyBN, gradientDenominator, poolBalance);
      const asNormal = ethers.utils.formatUnits(priceToMint, 18);
      const finalTotal = parseFloat(asNormal).toFixed(4);
      yield put(setTxContextAction(`Purchasing ${parseFloat(`${communityData.daiValue}`).toFixed(2)} Dai worth of community tokens. (incl. Contributions): ${finalTotal} Dai`));

      mintedVolume = yield retry(5, 2000, mintTokens, tokenVolume, communityData.tbcAddress);
      mintedVolume = mintedVolume.sub(mintedVolume.div(100).mul(contributionRate))
    }else if(liquidTokensValuationBN.gte(targetDaiBN)){
      yield put(setTxContextAction(`Roughly enough to stake`));
      yield delay(1000);
      mintedVolume = liquidTokenBalanceBN;

    }else if(liquidTokensValuationBN.gt(0) && liquidTokensValuationBN.lt(daiValueBN)){
      // A mint occured externally to this user, price has changed so mint whats needed
      const remainingToPuchaseDaiBN = daiValueBN.sub(liquidTokensValuationBN);
      tokenVolume = yield retry(5, 2000, getTokenVolumeBuy, communityData.tbcAddress, remainingToPuchaseDaiBN);
      const priceToMint = yield call(BLTMExportPriceCalculation, remainingToPuchaseDaiBN,  parseInt(`${contributionRate}`), totalSupplyBN, poolBalance, gradientDenominator);
      const asNormal = ethers.utils.formatUnits(priceToMint, 18);
      const finalTotal = parseFloat(asNormal).toFixed(4);
      yield put(setRemainingTxCountAction(2));

      yield put(setTxContextAction(`Purchasing ${parseFloat(ethers.utils.formatUnits(remainingToPuchaseDaiBN, 18)).toFixed(2)} Dai worth of community tokens. (incl. Contributions): ${finalTotal} Dai`));
      yield retry(5, 2000, mintTokens, tokenVolume, communityData.tbcAddress);

      mintedVolume = yield call(getTokenBalance, communityData.tbcAddress);
      // Removing contribution
    }else if(liquidTokenBalanceBN.gte(tokenVolume)){
      // Theres enough for the mint
      mintedVolume = tokenVolume;
    }

    // stake
    yield put(setRemainingTxCountAction(1));
    yield put(setTxContextAction(`Reserving community tokens for membership.`));
    yield delay(2000);

    const mintedDaiValue = yield retry(5, 2000, getDaiValueBurn, communityData.tbcAddress, mintedVolume);
    yield retry(5, 2000, increaseMembershipStake, mintedDaiValue, communityData.membershipManagerAddress)

    yield put(setRemainingTxCountAction(0));
    return true;
  }
  catch(e){
    throw e;
  }
}

export function* getAllCommumunities(){
  const communitiesFromState = yield select((state: ApplicationRootState) => state.communities);
  const previousAddress = yield select((state: ApplicationRootState) => state.authentication.ethAddress);
  let communities = yield call(getCommunitiesFromChain);
  if(previousAddress != blockchainResources.signerAddress){
    yield put(resetCommunitiesAction());
    yield put(resetEventsAction());
    yield put(setEthAddress({ethAddress : blockchainResources.signerAddress}));
    yield delay(2000);
    yield put(getAllCommunitiesAction());
  }else if(Object.keys(communitiesFromState).length > 0){
    const toRemove = Object.keys(communitiesFromState).filter(key => communitiesFromState[key].networkId && communitiesFromState[key].networkId != blockchainResources.networkId);
    yield all(toRemove.map(address => put(removeCommunityAction(address))));
    const eventsFromState = yield select((state: ApplicationRootState) => state.events);
    if(Object.keys(eventsFromState).length > 0){
      const eventsToRemove = Object.keys(eventsFromState).filter(eventKey => toRemove.indexOf(eventsFromState[eventKey].tbcAddress) >= 0 || eventsFromState[eventKey].networkId != blockchainResources.networkId);
      eventsToRemove.length > 0 ? yield all(eventsToRemove.map(address => put(removeEventAction(address)))) : null;
    }

    const resolvedCommunities = Object.keys(communitiesFromState).filter(key => communitiesFromState[key].networkId && communitiesFromState[key].networkId == blockchainResources.networkId && communitiesFromState[key].description).map(validKey => communitiesFromState[validKey]);
    yield all(resolvedCommunities.map(resolvedCommunity => put(saveCommunity(resolvedCommunity))));
    const resolvedAddresses = resolvedCommunities.map(community => community.tbcAddress);
    communities = communities.filter(com => resolvedAddresses.indexOf(com.tbcAddress) < 0)
    yield all(communities.map(com => (fork(resolveCommunity, com))))
  }else{
    yield all(communities.map(com => (fork(resolveCommunity, com))))
  }
}

// Listeners
export function* joinCommunityListener() {
  while(true){
    const communityData = (yield take(joinCommunityAction.request)).payload;
    yield put(setCommunityMutexAction(communityData.tbcAddress));

    const result = yield retry(5, 2000, joinCommunity, communityData);
    if(result === true){
      // Trigger resolve community
      yield put(joinCommunityAction.success());
    }else{
      yield put(setRemainingTxCountAction(0));
      yield put(joinCommunityAction.failure(result));
    }
  }
}

export function* getAllCommunitiesListener() {
  while(true){
    yield take(getAllCommunitiesAction);
    yield call(getAllCommumunities);
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
  yield fork(joinCommunityListener);
}
