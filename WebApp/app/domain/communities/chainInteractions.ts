
import { abi as CommunityFactoryABI } from "../../../../Blockchain/build/CommunityFactoryV1.json";
import { abi as MembershipManagerAbi} from "../../../../Blockchain/build/MembershipManagerV1.json";
import { abi as DaiContractAbi} from "../../../../Blockchain/build/PseudoDaiToken.json";
import { abi as TbcContractAbi} from "../../../../Blockchain/build/BasicLinearTokenManagerV2.json";

import { ethers } from "ethers";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { blockchainResources, getBlockchainObjects } from "blockchainResources";
import { BigNumber, Interface } from "ethers/utils";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};

// View/Read
export async function checkTransferApprovalState(tbcAddress: string){
  try{
    const {provider, signer, signerAddress} = await getBlockchainObjects();
    // @ts-ignore  // It's copied code, whats its problem
    const daiContract = (await new ethers.Contract(`${blockchainResources.daiAddress}`, DaiContractAbi, provider)).connect(signer);

    const approval: BigNumber = await daiContract.allowance(signerAddress, tbcAddress);
    return approval.gt(ethers.utils.parseUnits("1000", 18))
  }
  catch(e){
    throw e;
  }
}

export async function getPoolBalance(tbcAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    // @ts-ignore  // It's copied code, whats its problem
    const daiContract = (await new ethers.Contract(`${blockchainResources.daiAddress}`, DaiContractAbi, provider)).connect(signer);
    const balance = await daiContract.balanceOf(tbcAddress);
    return balance;
  }
  catch(error){
    throw error;
  }
}

export async function checkUserStateOnChain(membershipManagerAddress: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const membershipManager = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi, provider)).connect(signer);
    const signerAddress = await signer.getAddress();

    const memberstate = await membershipManager.getMembershipStatus(signerAddress);


    return {
      isMember: parseInt(ethers.utils.formatUnits(memberstate[0],0))> 0 ? true : false,
      availableStake: ethers.utils.formatUnits(memberstate[2],18),
      memberSince: new Date(parseInt(ethers.utils.formatUnits(memberstate[0],0)) * 1000)
    };
    // TODO: To increase the validity of this, if the balance is zero, read the staking logs to see if user is just active;

  }
  catch(e){
    throw e;
  }

}

export async function getCommunitiesFromChain() {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const communityFactory = (await new ethers.Contract(`${blockchainResources.commmunityFactoryAddress}`, CommunityFactoryABI, provider)).connect(signer);

    const filterCommunitiesCreated:EventFilter = communityFactory.filters.CommunityCreated(null, null, null);
    filterCommunitiesCreated.fromBlock = blockchainResources.publishedBlock;
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
  catch(e){
    throw e;
  }

}

export async function getCommunityFromChain(tbcAddress: string) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const communityFactory = (await new ethers.Contract(`${blockchainResources.commmunityFactoryAddress}`, JSON.stringify(CommunityFactoryABI), provider)).connect(signer);

    const filterCommunitiesCreated:EventFilter = communityFactory.filters.CommunityCreated(null, null, tbcAddress);
    filterCommunitiesCreated.fromBlock = blockchainResources.publishedBlock;
    const parsedLog = communityFactory.interface.parseLog((await provider.getLogs(filterCommunitiesCreated))[0]);
    return {
      tbcAddress: parsedLog.values.tokenManager,
      eventManagerAddress: parsedLog.values.utilities[0],
      membershipManagerAddress: parsedLog.values.membershipManager
    }
  }
  catch(error){
    throw error;
  }
}

export async function getDaiValueMint(tbcAddress: string, tokenVolume: BigNumber){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    return (await tbcContract.priceToMint(tokenVolume));
  }
  catch(error){
    throw error;
  }
}

export async function getDaiValueBurn(tbcAddress: string, tokenVolume: BigNumber){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    return (await tbcContract.rewardForBurn(tokenVolume));
  }
  catch(error){
    throw error;
  }
}

export async function getTokenVolumeBuy(tbcAddress: string, daiValue: BigNumber){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const tokenVolume = await tbcContract.colateralToTokenBuying(daiValue);
    return tokenVolume;
  }
  catch(error){
    throw error;
  }
}

export async function getTokenVolumeSell(tbcAddress: string, daiValue: BigNumber){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const tokenVolume = await tbcContract.colateralToTokenSelling(daiValue);
    return tokenVolume;
  }
  catch(error){
    throw error;
  }
}

export async function getTokenBalance(tbcAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const signerAddress = await signer.getAddress();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const tokenVolume = await tbcContract.balanceOf(signerAddress);
    return tokenVolume;
  }
  catch(error){
    throw error;
  }
}

export async function getContributionRate(tbcAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const contributionRate = await tbcContract.contributionRate();
    return contributionRate;
  }
  catch(error){
    throw error;
  }
}

export async function getTotalSupply(tbcAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const totalSupply = await tbcContract.totalSupply();
    return totalSupply;
  }
  catch(error){
    throw error;
  }
}

export async function getRevenueTarget(tbcAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const revenueTarget = await tbcContract.revenueTarget();
    return revenueTarget;
  }
  catch(error){
    throw error;
  }
}

export async function getGradientDenominator(tbcAddress: string){
  try{
    const {provider, signer} = await getBlockchainObjects();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const gradientDenominator = await tbcContract.gradientDenominator();
    return gradientDenominator;
  }
  catch(error){
    throw error;
  }
}



// Write/Publish
export async function publishCommunityToChain(name: string, tokenSymbol: string, gradientDenominator: number, contributionRate: number) {
  try{
    const {provider, signer} = await getBlockchainObjects();
    const communityFactory = (await new ethers.Contract(`${blockchainResources.commmunityFactoryAddress}`, JSON.stringify(CommunityFactoryABI), provider)).connect(signer);
    const signerAddress = await signer.getAddress();
    const txReceipt = await(await communityFactory.createCommunity(name, tokenSymbol, signerAddress, gradientDenominator, contributionRate)).wait();

    const communityCreatedEvent = communityFactory.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == communityFactory.interface.events.CommunityCreated.signature
    ))[0]);

    return {
      tbcAddress: communityCreatedEvent.values.tokenManager,
      membershipManagerAddress: communityCreatedEvent.values.membershipManager,
      eventManagerAddress: communityCreatedEvent.values.utilities[0]
    }
  }
  catch(e){
    throw e;
  }
}

export async function updateTransferApproval(unlock: boolean, tbcAddress: string){

  const targetValue = unlock ? ethers.constants.MaxUint256 : ethers.constants.Zero

  try{
    const {provider, signer} = await getBlockchainObjects();
    const daiContract = (await new ethers.Contract(`${blockchainResources.daiAddress}`, JSON.stringify(DaiContractAbi), provider)).connect(signer);
    const txReceipt = await(await daiContract.approve(tbcAddress, targetValue)).wait();
    // TODO: check event to confirm
    return true;
  }
  catch(error){
    throw error;
  }
}

// Mint & Burn functions
export async function mintTokens(tokenVolume: BigNumber, tbcAddress: string){

  try{
    const {provider, signer} = await getBlockchainObjects();
    const signerAddress = await signer.getAddress();
    const tbcContract = (await new ethers.Contract(tbcAddress, TbcContractAbi, provider)).connect(signer);
    const txReceipt = await(await tbcContract.mint(signerAddress, tokenVolume)).wait()
    const mintTransferEvents = (await(txReceipt.events.filter(
      event => event.eventSignature == tbcContract.interface.events.Transfer.signature
    ))).map(transferEvent => tbcContract.interface.parseLog(transferEvent))

    const mintEvent = mintTransferEvents.filter(parsedEvent => (parsedEvent.values.from == ethers.constants.AddressZero && parsedEvent.values.to == signerAddress))[0];
    return mintEvent.values.value;
  }
  catch(error){
    throw error;
  }
}

export async function burnTokens(tokenVolume: BigNumber, tbcAddress: string){

  try{
    const {provider, signer} = await getBlockchainObjects();
    const signerAddress = await signer.getAddress();
    const tbcContract = (await new ethers.Contract(tbcAddress, JSON.stringify(TbcContractAbi), provider)).connect(signer);
    const txReceipt = await(await tbcContract.burn(tokenVolume)).wait()
    const burntTransferEvents = (await(txReceipt.events.filter(
      event => event.eventSignature == tbcContract.interface.events.Transfer.signature
    ))).map(transferEvent => tbcContract.interface.parseLog(transferEvent));

    const burnEvent = burntTransferEvents.filter(parsedEvent => (parsedEvent.values.from == signerAddress && parsedEvent.values.to == ethers.constants.AddressZero))[0];
    return burnEvent.values.value;
  }
  catch(error){
      throw error;
  }
}



// Basic Linear pricing
export function BLTMExportPriceCalculation(daiValue: BigNumber, contributionRate: number, totalSupply: BigNumber, poolBalance: BigNumber, gradientDenominator: number){
  const targetTokens = BLTMCalculateTargetTokens(daiValue, gradientDenominator, contributionRate, totalSupply);
  return BLTMPriceToMint(targetTokens, totalSupply, gradientDenominator, poolBalance)
}

export function BLTMPriceToMint(numTokens: BigNumber, totalSupply: BigNumber, gradientDenominator: number, poolBalance: BigNumber) {
  // return curveIntegral(totalSupply_.add(_numTokens)).sub(poolBalance_);
  let rawDai: BigNumber = BLTMCurveIntegral(totalSupply.add(numTokens), gradientDenominator).sub(poolBalance);
  return rawDai.add(rawDai.div(100)); // Adding 1 percent
}

/// @dev                Returns the required collateral amount for a volume of bonding curve tokens
/// @return             Potential return collateral corrected for decimals
export function BLTMRewardForBurn(numTokens: BigNumber, totalSupply: BigNumber, gradientDenominator: number, poolBalance: BigNumber) {
  return poolBalance.sub(BLTMCurveIntegral(totalSupply.sub(numTokens), gradientDenominator));
}

export function BLTMColateralToTokenBuying(colateralTokenOffered: BigNumber, totalSupply: BigNumber, gradientDenominator: number, withContribution: boolean)  {
  let correctedForContribution: BigNumber = withContribution ? colateralTokenOffered.sub(colateralTokenOffered.div(101)) : colateralTokenOffered; // Removing 1 percent
  return BLTMInverseCurveIntegral(BLTMCurveIntegral(totalSupply, gradientDenominator).add(correctedForContribution), gradientDenominator).sub(totalSupply);
}

export function BLTMcolateralToTokenSelling(collateralTokenNeeded: BigNumber, totalSupply: BigNumber, gradientDenominator: number) {
  return totalSupply.sub(
      BLTMInverseCurveIntegral(BLTMCurveIntegral(totalSupply, gradientDenominator).sub(collateralTokenNeeded),gradientDenominator)
  )
}

export function BLTMCurveIntegral(_x: BigNumber, gradientDenominator: number): BigNumber{
  const scaling = ethers.utils.bigNumberify("1000000000000000000")
  return ((_x.mul(_x)).div(2*gradientDenominator).add(0).div(scaling));
}

export function BLTMInverseCurveIntegral(_x: BigNumber, gradientDenominator: number): BigNumber{
  // return BLTMSqrt(2*_x*gradientDenominator*(10**18));
  const scaling = ethers.utils.bigNumberify("1000000000000000000")
  return BLTMSqrt(((_x.mul(2)).mul(gradientDenominator)).mul(scaling));
}

export function BLTMSqrt(_x: BigNumber): BigNumber {
  if (_x.eq(0)) return ethers.utils.bigNumberify(0);
  else if (_x.lte(3)) return ethers.utils.bigNumberify(1);

  let z: BigNumber = (_x.add(1)).div(2);
  let y: BigNumber = _x;
  while (z.lt(y))
  /// @why3 invariant { to_int !_z = div ((div (to_int arg_x) (to_int !_y)) + (to_int !_y)) 2 }
  /// @why3 invariant { to_int arg_x < (to_int !_y + 1) * (to_int !_y + 1) }
  /// @why3 invariant { to_int arg_x < (to_int !_z + 1) * (to_int !_z + 1) }
  /// @why3 variant { to_int !_y }
  {
      y = z;
      z = ((_x.div(z)).add(z)).div(2);
  }
  return y;
}


export function BLTMCalculateTargetTokens(requestedDai: BigNumber, gradientDenominator: number, contributionRate: number, totalSupply: BigNumber){
  try{
    const gradient = ethers.utils.parseUnits(`${(1/gradientDenominator)}`, 18);
    // console.log("Gradient", ethers.utils.formatUnits(gradient ,18))
    const userShare = (ethers.utils.parseUnits("100", 18).sub(ethers.utils.parseUnits(`${contributionRate}`, 18))).div(100);
    // console.log("userShare", ethers.utils.formatUnits(userShare ,18))

    // Quadratic roots
    const a = ethers.utils.parseUnits(`${(100 + contributionRate)}`, 18).mul(userShare).div(ethers.utils.parseUnits(`1`, 18)).div(100);
    // console.log("a", ethers.utils.formatUnits(a ,18))
    const b = ((totalSupply.mul(2)).mul(userShare)).div(ethers.utils.parseUnits(`1`, 18));
    // console.log("b", ethers.utils.formatUnits(b ,18))

    const bSquared = (b.pow(2)).div(ethers.utils.parseUnits('1', 18));
    // console.log("foo", ethers.utils.formatUnits(foo ,18))
    const arg1 = (a.mul(4).mul(requestedDai)).div(gradient.mul(ethers.utils.parseUnits('0.5', 18)));
    const arg1Scaled = arg1.mul(ethers.utils.parseUnits(`1`, 18))

    // console.log("bar", ethers.utils.formatUnits(bar, 18))
    const arg = bSquared.add(arg1Scaled);
    // console.log("arg", ethers.utils.formatUnits(arg ,18))
    const sqrt_arg = BLTMSqrt(arg).mul(ethers.utils.parseUnits(`1`, 9));
    // console.log("sqrt_arg", ethers.utils.formatUnits(sqrt_arg ,18))
    const tokens = (sqrt_arg.sub(b).mul(ethers.utils.parseUnits('1', 18))).div(a.mul(2));
    // console.log("tokens", ethers.utils.formatUnits(tokens ,18))
    return tokens
  }
  catch(e){
    return e;
  }

}
