
import { abi as CommunityFactoryABI } from "../../../../Blockchain/build/CommunityFactoryV1.json";
import { abi as MembershipManagerAbi} from "../../../../Blockchain/build/MembershipManagerV1.json";
import { abi as DaiContractAbi} from "../../../../Blockchain/build/PseudoDaiToken.json";
import { abi as TbcContractAbi} from "../../../../Blockchain/build/BasicLinearTokenManager.json";

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
    debugger;
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
    // TODO: Error handling
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
