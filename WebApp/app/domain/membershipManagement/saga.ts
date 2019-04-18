import { fork, take, call, put, select, all, delay } from "redux-saga/effects";
import { checkStatus, increaseMembershipAction, withdrawMembershipAction, getMembersAction } from "./actions";

// Ethers standard event filter type is missing the blocktags
import { getTokenBalance, checkTransferApprovalState, burnTokens, mintTokens, getTokenVolumeBuy, getDaiValueBurn, getTokenVolumeSell } from "domain/communities/chainInteractions";
import { increaseMembershipStake, checkUserStateOnChain, withdrawMembershipStake, getAvailableStake, checkAdminState, getMembersTx } from "./chainInteractions";
import { statusUpdated, setMemberList } from "domain/communities/actions";
import { ethers } from "ethers";
import { setRemainingTxCountAction, setTxContextAction } from "domain/transactionManagement/actions";
import { retry } from "redux-saga/effects";
import { BigNumber } from "ethers/utils";

// Meta
export function* checkMemberStates(membershipManagerAddress: string, tbcAddress: string){
  const memberData = yield call(checkUserStateOnChain, membershipManagerAddress, tbcAddress);
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
    const daiValueBN = ethers.utils.parseUnits(`${communityData.daiValue}`, 18);
    console.log(ethers.utils.formatUnits(daiValueBN, 18))
    const liquidTokenBalanceBN = yield call(getTokenBalance, communityData.tbcAddress);
    const liquidTokensValuationBN = yield call(getDaiValueBurn, communityData.tbcAddress, liquidTokenBalanceBN);
    let mintedVolume: BigNumber = ethers.utils.bigNumberify(0);
    // This is the volume after contribution
    let tokenVolume = yield retry(5, 2000, getTokenVolumeBuy, communityData.tbcAddress, daiValueBN);
    if(liquidTokenBalanceBN.eq(0)){
      // If no tokens have been minted
      yield put(setRemainingTxCountAction(2));
      yield put(setTxContextAction(`Purchasing ${communityData.daiValue} Dai worth of community tokens.`));
      mintedVolume = yield retry(5, 2000, mintTokens, tokenVolume, communityData.tbcAddress);
    }else if(liquidTokensValuationBN.lt(daiValueBN)){
      // A mint occured externally to this user, price has changed so mint whats needed
      const remainingToPuchaseDaiBN = daiValueBN.sub(liquidTokensValuationBN);
      tokenVolume = yield retry(5, 2000, getTokenVolumeBuy, communityData.tbcAddress, remainingToPuchaseDaiBN);
      yield put(setRemainingTxCountAction(2));
      yield put(setTxContextAction(`Purchasing ${parseFloat(ethers.utils.formatUnits(remainingToPuchaseDaiBN,18)).toFixed(2)} Dai worth of community tokens.`));

      yield retry(5, 2000, mintTokens, tokenVolume, communityData.tbcAddress);
      mintedVolume = yield call(getTokenBalance, communityData.tbcAddress);
    }else if(liquidTokenBalanceBN.gte(tokenVolume)){
      // Theres enough for the mint
      mintedVolume = tokenVolume;
    }

    // stake
    yield put(setRemainingTxCountAction(1));
    yield put(setTxContextAction(`Reserving community tokens for membership.`));
    yield delay(500);

    const mintedDaiValue = yield retry(5, 2000, getDaiValueBurn, communityData.tbcAddress, mintedVolume);
    yield retry(5, 2000, increaseMembershipStake, mintedDaiValue, communityData.membershipManagerAddress)
    yield put(setRemainingTxCountAction(0));

    return true;
  }
  catch(e){
    return e;
  }
}

export function* withdrawMembership(communityData: {tbcAddress:string, daiValue: number, membershipManagerAddress: string}){
  try{
    const daiValueBN = ethers.utils.parseUnits(`${communityData.daiValue}`, 18);

    const liquidTokenBalanceBN = yield call(getTokenBalance, communityData.tbcAddress);
    const tokenVolume = yield retry(5, 2000, getTokenVolumeSell, communityData.tbcAddress, daiValueBN);

    let withdrawTokenVolume: BigNumber = ethers.utils.bigNumberify(0);
    if(liquidTokenBalanceBN.eq(0)){
       // Unstake
      yield put(setTxContextAction(`Withdrawing ${communityData.daiValue} Dai worth of tokens from membership` ));
      yield put(setRemainingTxCountAction(2));
      yield retry(5, 2000, withdrawMembershipStake, ethers.utils.parseUnits(`${communityData.daiValue}`, 18), communityData.membershipManagerAddress)
      withdrawTokenVolume = yield call(getTokenBalance, communityData.tbcAddress);
    }else if(liquidTokenBalanceBN.lt(tokenVolume)){
      // If theres not enough liquid tokens to sell for the DAI request then run again
      // TODO: calculate how much dai to actually withdraw for the target amount

      const daiFromMembershipNeededBN = yield call(getDaiValueBurn, communityData.tbcAddress, tokenVolume.sub(liquidTokenBalanceBN));
      yield put(setTxContextAction(`Withdrawing ${communityData.daiValue} Dai worth of tokens from membership` ));
      yield put(setRemainingTxCountAction(2));
      yield retry(5, 2000, withdrawMembershipStake, daiFromMembershipNeededBN, communityData.membershipManagerAddress)
      withdrawTokenVolume = yield call(getTokenBalance, communityData.tbcAddress);
    }else if(liquidTokenBalanceBN.gte(tokenVolume)){
      withdrawTokenVolume = tokenVolume;
    }

    yield put(setTxContextAction(`Exchanging community tokens for Dai` ));
    yield put(setRemainingTxCountAction(1));
    yield delay(2000);

    yield retry(5, 2000, burnTokens, withdrawTokenVolume, communityData.tbcAddress);
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
    const result = yield retry(5, 2000, increaseMembership, communityData);
    if(result === true){
      // Trigger resolve community
      yield put(increaseMembershipAction.success());
      // yield put(getCommunityAction.request(communityData.tbcAddress))
    }else{
      yield put(setRemainingTxCountAction(0));
      yield put(increaseMembershipAction.failure(result));
    }
  }
}

export function* withdrawMembershipListener(){
  while(true){
    const communityData = (yield take(withdrawMembershipAction.request)).payload;
    const result = yield retry(5, 2000, withdrawMembership, communityData);
    if(result === true){
      // Trigger resolve community
      yield put(withdrawMembershipAction.success());
      // yield put(getCommunityAction.request(communityData.tbcAddress))
    }else{
      yield put(setRemainingTxCountAction(0));
      yield put(withdrawMembershipAction.failure(result));
    }
  }
}

export function* getCommunityMembers(tbcAddress: string, membershipManagerAddress: string){
  const memberList = yield call(getMembersTx, membershipManagerAddress);
  yield put(setMemberList({tbcAddress: tbcAddress, memberList: memberList}));
}

export function* checkMemberStatusListener(){
  while(true){
    const communityData = (yield take(checkStatus)).payload;
    yield fork(checkMemberStates, communityData.membershipManagerAddress, communityData.tbcAddress);
  }
}

export function* getCommunityMembersListener(){
  while(true){
    const communityData = (yield take(getMembersAction)).payload;
    yield fork(getCommunityMembers, communityData.tbcAddress, communityData.membershipManagerAddress);
  }
}

export default function* root() {
  yield fork(checkMemberStatusListener);
  yield fork(increaseMembershipListener);
  yield fork(withdrawMembershipListener);
  yield fork(getCommunityMembersListener);
}
