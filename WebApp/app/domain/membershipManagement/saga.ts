import { fork, take, call, put, select, all, delay } from "redux-saga/effects";
import { checkStatus, increaseMembershipAction, withdrawMembershipAction } from "./actions";
import { getCommunityMeta as getCommunityMetaApi } from "api/api";
import { createCommunity as createCommunityApi } from "api/api";

// Ethers standard event filter type is missing the blocktags
import { ICommunity } from "./types";
import { getTokenBalance, checkTransferApprovalState, burnTokens, mintTokens, getTokenVolumeBuy, getDaiValueBurn } from "domain/communities/chainInteractions";
import { increaseMembershipStake, checkUserStateOnChain, withdrawMembershipStake, getAvailableStake, checkAdminState } from "./chainInteractions";
import { statusUpdated, getCommunityAction } from "domain/communities/actions";
import { ethers } from "ethers";
import { setRemainingTxCountAction, setTxContextAction } from "domain/transactionManagement/actions";

// Meta
export function* checkIfUserIsMember(membershipManagerAddress: string, tbcAddress: string){
  const memberData = yield call(checkUserStateOnChain, membershipManagerAddress);
  const approvalState = yield call(checkTransferApprovalState, tbcAddress);
  const liquidTokens =  ethers.utils.formatUnits(yield call(getTokenBalance, tbcAddress), 18);
  const isAdmin =  yield call(checkAdminState, membershipManagerAddress);

  yield put(statusUpdated(
    {
      tbcAddress: tbcAddress,
      transfersUnlocked: approvalState,
      liquidTokens: liquidTokens,
      isAdmin: isAdmin,
      ...memberData
    }));
}

// CRUD
export function* increaseMembership(communityData: {tbcAddress:string, daiValue: number, membershipManagerAddress: string}){
  try{
    // mint
    yield put(setRemainingTxCountAction(2));
    yield put(setTxContextAction(`Purchasing ${communityData.daiValue} Dai worth of community tokens.`));
    const tokenVolume = yield call(getTokenVolumeBuy, communityData.tbcAddress, ethers.utils.parseUnits(`${communityData.daiValue}`, 18));
    const mintedVolume = yield call(mintTokens, tokenVolume, communityData.tbcAddress);

    // stake
    yield put(setRemainingTxCountAction(1));
    yield put(setTxContextAction(`Reserving community tokens for membership.`));
    yield delay(500);

    const mintedDaiValue = yield call(getDaiValueBurn, communityData.tbcAddress, mintedVolume);
    yield call(increaseMembershipStake, mintedDaiValue, communityData.membershipManagerAddress)
    yield put(setRemainingTxCountAction(0));

    return true;
  }
  catch(e){
    return e;
  }
}

export function* withdrawMembership(communityData: {tbcAddress:string, daiValue: number, membershipManagerAddress: string}){
  try{
    // Unstake
    yield put(setTxContextAction(`Withdrawing ${communityData.daiValue} Dai worth of tokens from membership` ));
    yield put(setRemainingTxCountAction(2));
    const membersTokens = yield call(getAvailableStake, communityData.membershipManagerAddress);
    const daiValue = yield call(getDaiValueBurn, communityData.tbcAddress, membersTokens);
    yield call(withdrawMembershipStake, daiValue, communityData.membershipManagerAddress)

    yield put(setTxContextAction(`Exchanging community tokens for Dai` ));
    yield put(setRemainingTxCountAction(1));
    yield delay(500);

    const tokenBalance = yield call(getTokenBalance, communityData.tbcAddress);
    yield call(burnTokens, tokenBalance, communityData.tbcAddress);
    yield put(setRemainingTxCountAction(0));

    return true;
  }
  catch(e){
    return e
  }
}

// Listeners
export function* increaseMembershipListener(){
  while(true){
    const communityData = (yield take(increaseMembershipAction.request)).payload;
    // mint
    const result = yield call(increaseMembership, communityData);
    if(result === true){
      // Trigger resolve community
      yield put(increaseMembershipAction.success());
      yield put(getCommunityAction.request(communityData.tbcAddress))
    }else{
      yield put(setRemainingTxCountAction(0));
      yield put(increaseMembershipAction.failure(result));
    }
  }
}

export function* withdrawMembershipListener(){
  while(true){
    const communityData = (yield take(withdrawMembershipAction.request)).payload;
    const result = yield call(withdrawMembership, communityData);
    if(result === true){
      // Trigger resolve community
      yield put(withdrawMembershipAction.success());
      yield put(getCommunityAction.request(communityData.tbcAddress))
    }else{
      yield put(setRemainingTxCountAction(0));
      yield put(withdrawMembershipAction.failure(result));
    }
  }
}

// Listeners
export function* checkIfUserIsMemberListener(){
  while(true){
    const communityData = (yield take(checkStatus)).payload;
    yield fork(checkIfUserIsMember, communityData.membershipManagerAddress, communityData.tbcAddress);
  }
}

export default function* root() {
  yield fork(checkIfUserIsMemberListener);
  yield fork(increaseMembershipListener);
  yield fork(withdrawMembershipListener);
}
