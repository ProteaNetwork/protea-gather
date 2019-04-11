import * as CommunityFactoryABI from "../../../../Blockchain/build/CommunityFactoryV1.json";
import * as MembershipManagerAbi from "../../../../Blockchain/build/MembershipManagerV1.json";
import * as DaiContractAbi from "../../../../Blockchain/build/PseudoDaiToken.json";
import * as TbcContractAbi from "../../../../Blockchain/build/BasicLinearTokenManager.json";
import { ethers } from "ethers";

import { BigNumber } from "ethers/utils";
import { BlockTag } from 'ethers/providers/abstract-provider';
import { blockchainResources } from "blockchainResources";
import { getDaiValueBurn } from "domain/communities/chainInteractions";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};

// Blockchain interactions
// View/Read
export async function getTotalRemainingInUtilityTx(membershipManagerAddress: string, eventId: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();

  try{
    const signerAddress = await signer.getAddress();

    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.bigNumberify(eventId.split('-')[1]);
    const membershipManagerContract = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);

    const totalUtilityStake = await membershipManagerContract.getUtilityStake(eventManagerAddress, eventIndex);

    return parseFloat(ethers.utils.formatUnits(totalUtilityStake, 18));
  }
  catch(e){
    throw e;
  }

}

export async function getLockedCommitmentTx(membershipManagerAddress:string, eventId: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();

  try{
    const signerAddress = await signer.getAddress();

    const eventManagerAddress = eventId.split('-')[0];
    const eventIndex = ethers.utils.bigNumberify(eventId.split('-')[1]);
    const membershipManagerContract = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);

    const utilityStake = await membershipManagerContract.getMemberUtilityStake(eventManagerAddress, signerAddress, eventIndex);

    return parseFloat(ethers.utils.formatUnits(utilityStake, 18));
  }
  catch(e){
    throw e;
  }

}

export async function checkAdminState(membershipManagerAddress: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  try{
    const signerAddress = await signer.getAddress();
    const membershipManager = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);

    const isAdmin = await membershipManager.isAdmin(signerAddress);

    return isAdmin;
  }
  catch(e){
    throw e;
  }

}

export async function getAvailableStake(membershipManagerAddress: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  try{
    const membershipManager = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);
    const signerAddress = await signer.getAddress();

    const memberstate = await membershipManager.getMembershipStatus(signerAddress);

    return memberstate[2];
  }
  catch(e){
    throw e;
  }

}

export async function checkUserStateOnChain(membershipManagerAddress: string, tbcAddress: string) {
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  try{
    const membershipManager = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);
    const signerAddress = await signer.getAddress();

    const memberstate = await membershipManager.getMembershipStatus(signerAddress);

    const daiValue = await getDaiValueBurn(tbcAddress,memberstate[2]);

    return {
      isMember: parseInt(ethers.utils.formatUnits(memberstate[0],0))> 0 ? true : false,
      availableStake: ethers.utils.formatUnits(daiValue,18),
      memberSince: new Date(parseInt(ethers.utils.formatUnits(memberstate[0],0)) * 1000)
    };
    // TODO: To increase the validity of this, if the balance is zero, read the staking logs to see if user is just active;

  }
  catch(e){
    throw e;
  }

}

// Write/Publish
// Staking functions
export async function increaseMembershipStake(daiValue: BigNumber, membershipManagerAddress: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  try{
    const membershipManager = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);
    const signerAddress = await signer.getAddress();

    for(let i = 0; i < 5; i++){
      try{
        const txReceipt = await (await membershipManager.stakeMembership(daiValue.sub((1 * i)), signerAddress)).wait();
        const membershipStakedEvent = membershipManager.interface.parseLog(await(txReceipt.events.filter(
          event => event.eventSignature == membershipManager.interface.events.MembershipStaked.signature
        ))[0]);

        return membershipStakedEvent.values.tokensStaked;
      }
      catch(error){
      }
    }
    return false;
  }
  catch(e){
    throw e;
  }


}

export async function withdrawMembershipStake(daiValue: BigNumber, membershipManagerAddress: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  try{
    const membershipManager = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);
    const signerAddress = await signer.getAddress();

    for(let i = 0; i < 5; i++){
      try{
        const txReceipt = await(await membershipManager.withdrawMembership(daiValue.sub((1*i)), signerAddress)).wait()
        const membershipWithdrawnEvent = membershipManager.interface.parseLog(await(txReceipt.events.filter(
          event => event.eventSignature == membershipManager.interface.events.MembershipWithdrawn.signature
        ))[0]);
        return membershipWithdrawnEvent.values.tokensWithdrawn;
      }
      catch(error){
      }
    }
    return false;
  }
  catch(e){
    throw e;
  }

}


export async function registerUtility(utilityAddress: string, membershipManagerAddress: string) {
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  try{
    const membershipManagerContract = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);

    const txReceipt = await(await membershipManagerContract.addUtility(utilityAddress)).wait();
    // TODO: Error handling
    const utilityAddedEvent = membershipManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == membershipManagerContract.interface.events.UtilityAdded.signature
    ))[0]);

    if(utilityAddedEvent && utilityAddedEvent.values.issuer == utilityAddress){
      return true;
    }else{
      return false;
    }
  }
  catch(e){
    throw e;
  }

}


export async function setReputationReward(utilityAddress: string, membershipManagerAddress: string, rewardId: BigNumber, rewardAmount: BigNumber) {
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  try{
    const membershipManagerContract = (await new ethers.Contract(membershipManagerAddress, MembershipManagerAbi.abi, provider)).connect(signer);

    const txReceipt = await(await membershipManagerContract.setReputationRewardEvent(utilityAddress, rewardId, rewardAmount)).wait();
    const reputationRewardSetEvent = membershipManagerContract.interface.parseLog(await(txReceipt.events.filter(
      event => event.eventSignature == membershipManagerContract.interface.events.ReputationRewardSet.signature
    ))[0]);

    if(reputationRewardSetEvent && reputationRewardSetEvent.values.issuer == utilityAddress){
      return true;
    }else{
      return false;
    }
  }
  catch(e){
    throw e;
  }

}