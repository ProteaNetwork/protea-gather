import * as DaiContractAbi from "../../../../Blockchain/build/PseudoDaiToken.json";

import { ethers } from "ethers";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';
import { BigNumber } from "ethers/utils";
import { blockchainResources } from "blockchainResources";

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};

export async function resolveENSaddress(potentialName: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  return await (provider.resolveName(potentialName));
}

export async function findENSaddress(accountAddress: string){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  return await (provider.lookupAddress(accountAddress));
}

export async function checkBalancesOnChain() {
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const daiContract = (await new ethers.Contract(`${blockchainResources.daiAddress}`, DaiContractAbi.abi, provider)).connect(signer);
  const signerAddress = await signer.getAddress();

  const daiBalance = parseFloat(ethers.utils.formatUnits((await daiContract.balanceOf(signerAddress)), 18));
  const ethBalance = parseFloat(ethers.utils.formatEther(await signer.getBalance()));
  return {
    daiBalance: daiBalance,
    ethBalance: ethBalance,
    ethAddress: signerAddress
  };
}

export async function mintDai(){
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const daiContract = (await new ethers.Contract(`${blockchainResources.daiAddress}`, DaiContractAbi.abi, provider)).connect(signer);
  const signerAddress = await signer.getAddress();

  const txReceipt = await(await daiContract.mint()).wait();
  return;
}
