import { fork, take, call, put, select, all, delay } from "redux-saga/effects";
import { checkStatus, increaseMembershipAction, withdrawMembershipAction, getMembersAction } from "./actions";

// Ethers standard event filter type is missing the blocktags
import { getTokenBalance, checkTransferApprovalState, burnTokens, mintTokens, getTokenVolumeBuy, getDaiValueBurn, getTokenVolumeSell, getTotalSupply, getGradientDenominator, getPoolBalance, getContributionRate, BLTMColateralToTokenBuying, BLTMcolateralToTokenSelling, BLTMRewardForBurn, getDaiValueMint, BLTMPriceToMint, BLTMSqrt, BLTMCurveIntegral, BLTMInverseCurveIntegral, BLTMExportPriceCalculation, BLTMCalculateTargetTokens } from "domain/communities/chainInteractions";
import { increaseMembershipStake, checkUserStateOnChain, withdrawMembershipStake, getAvailableStake, checkAdminState, getMembersTx } from "./chainInteractions";
import { statusUpdated, setMemberList } from "domain/communities/actions";
import { ethers } from "ethers";
import { setRemainingTxCountAction, setTxContextAction, setCommunityMutexAction } from "domain/transactionManagement/actions";
import { retry } from "redux-saga/effects";
import { BigNumber } from "ethers/utils";
import { ApplicationRootState } from "types";
import { getUserProfile as getUserProfileApi } from "api/api";
import { IMember } from "./types";

// Meta
export function* checkMemberStates(membershipManagerAddress: string, tbcAddress: string){
  const memberData = yield call(checkUserStateOnChain, membershipManagerAddress, tbcAddress);
  const approvalState = yield call(checkTransferApprovalState, tbcAddress);
  const liquidTokens =  ethers.utils.formatUnits(yield call(getTokenBalance, tbcAddress), 18);
  const isAdmin =  yield call(checkAdminState, membershipManagerAddress);
  const totalSupply = ethers.utils.formatUnits(yield call(getTotalSupply, tbcAddress), 18);
  const gradient = ethers.utils.formatUnits(yield call(getGradientDenominator, tbcAddress), 0);
  const poolBalance = ethers.utils.formatUnits(yield call(getPoolBalance, tbcAddress), 18);
  const contribution = ethers.utils.formatUnits(yield call(getContributionRate, tbcAddress), 0);

  yield put(statusUpdated(
    {
      tbcAddress: tbcAddress,
      transfersUnlocked: approvalState,
      liquidTokens: liquidTokens,
      isAdmin: isAdmin,
      gradientDenominator: gradient,
      totalSupply: totalSupply,
      poolBalance: poolBalance,
      contributionRate: contribution,
      ...memberData
    }));
}

export function* resolveMembersMeta(ethAddress: string) {
  try{
    const apiToken = yield select((state: ApplicationRootState) => state.authentication.accessToken);
    return (yield call(getUserProfileApi, ethAddress, apiToken));
  }
  catch(error){
    return false;
  }
}


// CRUD
export function* increaseMembership(communityData: {tbcAddress:string, daiValue: number, membershipManagerAddress: string}){
  try{
    if(typeof(communityData.daiValue) == "string"){
      communityData.daiValue = parseFloat(communityData.daiValue)
    }

    const contributionRate:number  = parseInt(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].contributionRate)}`);
    const totalSupplyBN: BigNumber = ethers.utils.parseUnits(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].totalSupply)}`, 18)
    const gradientDenominator: number = parseInt(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].gradientDenominator)}`);
    const poolBalance: BigNumber = ethers.utils.parseUnits(`${yield select((state: ApplicationRootState) => state.communities[communityData.tbcAddress].poolBalance)}`, 18);

    const liquidTokenBalanceBN = yield call(getTokenBalance, communityData.tbcAddress);
    const liquidTokensValuationBN = yield call(getDaiValueBurn, communityData.tbcAddress, liquidTokenBalanceBN);

    let mintedVolume: BigNumber = ethers.utils.bigNumberify(0);


    let daiValueBN = ethers.utils.parseUnits(`${communityData.daiValue}`, 18);
    let tokenVolume = yield call(BLTMCalculateTargetTokens, daiValueBN, gradientDenominator, contributionRate, totalSupplyBN);

    yield put(setCommunityMutexAction(communityData.tbcAddress));

    //Calculate root puchase volume
    const targetDaiBN = yield call(BLTMExportPriceCalculation, daiValueBN,  parseInt(`${contributionRate}`), totalSupplyBN, poolBalance, gradientDenominator);


    if(liquidTokenBalanceBN.eq(0)){
      // If no tokens have been minted
      yield put(setRemainingTxCountAction(2));
      const priceToMint = yield call(BLTMPriceToMint, tokenVolume, totalSupplyBN, gradientDenominator, poolBalance);
      const asNormal = ethers.utils.formatUnits(priceToMint, 18);
      const finalTotal = parseFloat(asNormal).toFixed(4)

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
      const finalTotal = parseFloat(asNormal).toFixed(4)
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

    const mintedDaiValue = yield retry(5, 500, getDaiValueBurn, communityData.tbcAddress, mintedVolume);
    yield retry(5, 2000, increaseMembershipStake, mintedDaiValue, communityData.membershipManagerAddress)
    yield put(setRemainingTxCountAction(0));

    return true;
  }
  catch(e){
    throw e;
  }
}

export function* withdrawMembership(communityData: {tbcAddress:string, daiValue: number, membershipManagerAddress: string}){
  try{
    const daiValueBN = ethers.utils.parseUnits(`${communityData.daiValue}`, 18);

    const liquidTokenBalanceBN = yield call(getTokenBalance, communityData.tbcAddress);
    const tokenVolume = yield retry(5, 2000, getTokenVolumeSell, communityData.tbcAddress, daiValueBN);

    let withdrawTokenVolume: BigNumber = ethers.utils.bigNumberify(0);

    yield put(setCommunityMutexAction(communityData.tbcAddress));
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
      yield put(setTxContextAction(`Withdrawing ${parseFloat(ethers.utils.formatUnits(daiFromMembershipNeededBN, 18)).toFixed(2)} Dai worth of tokens from membership` ));
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
    throw e
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
    }else{
      yield put(setRemainingTxCountAction(0));
      yield put(withdrawMembershipAction.failure(result));
    }
  }
}

export function* getCommunityMembers(tbcAddress: string, membershipManagerAddress: string){
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  const memberList: IMember[] = yield call(getMembersTx, membershipManagerAddress);
  const fetchedMetaData = yield all(memberList.map(member => (call(getUserProfileApi, member.ethAddress, apiKey))))
  const castMembers: IMember[] = fetchedMetaData.map(metaResponse => metaResponse.response.status == 200 ? {ethAddress: metaResponse.data.ethAddress, displayName: metaResponse.data.displayName, profileImage: metaResponse.data.profileImage} : undefined);
  yield put(setMemberList({tbcAddress: tbcAddress, memberList: castMembers}));
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
