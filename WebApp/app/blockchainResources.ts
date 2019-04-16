import { Web3Provider, JsonRpcSigner } from "ethers/providers";
import { ethers } from "ethers";
import * as CommunityFactoryABI from "../../Blockchain/build/CommunityFactoryV1.json";
import { AssignmentReturn } from "@material-ui/icons";

export let blockchainResources = {
  publishedBlock: 0,
  approvedNetwork: false,
  networkId: 0,
  daiAddress: "0x",
  commmunityFactoryAddress: "0x"
};

export async function initBlockchainResourcesDeprecated() {
  const { web3, ethereum } = window as any;
  try{
    const accountArray = await ethereum.enable();
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(ethereum);

    const chainId = (await provider.getNetwork()).chainId;
    blockchainResources.networkId = chainId;

    if(chainId == 1){
      blockchainResources.daiAddress = `${process.env.MAINNET_DAI_ADDRESS}`;
      blockchainResources.commmunityFactoryAddress = `${process.env.MAINNET_COMMUNITY_FACTORY_ADDRESS}`;
      blockchainResources.approvedNetwork = true;
    } else if(chainId == 4){
      blockchainResources.daiAddress = `${process.env.RINKEBY_DAI_ADDRESS}`;
      blockchainResources.commmunityFactoryAddress = `${process.env.RINKEBY_COMMUNITY_FACTORY_ADDRESS}`;
      blockchainResources.approvedNetwork = true;
    }else {
      throw "Invalid network"
    }

    const signer = await provider.getSigner();
    const communityFactory = (await new ethers.Contract(`${blockchainResources.commmunityFactoryAddress}`, CommunityFactoryABI.abi, provider)).connect(signer);

    const publishedBlock = parseInt(ethers.utils.formatUnits(await communityFactory.publishedBlocknumber(), 0));

    blockchainResources.publishedBlock = publishedBlock;
  }
  catch(e){
    throw e;
  }
}

export async function initBlockchainResources() {
  const { web3, ethereum } = window as any;
  try{
    const accountArray = await ethereum.send('eth_requestAccounts');
    if(accountArray.code && accountArray.code == 4001){
      throw("Connection rejected");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const chainId = (await provider.getNetwork()).chainId;
    blockchainResources.networkId = chainId;

    if(chainId == 1){
      blockchainResources.daiAddress = `${process.env.MAINNET_DAI_ADDRESS}`;
      blockchainResources.commmunityFactoryAddress = `${process.env.MAINNET_COMMUNITY_FACTORY_ADDRESS}`;
      blockchainResources.approvedNetwork = true;
    } else if(chainId == 4){
      blockchainResources.daiAddress = `${process.env.RINKEBY_DAI_ADDRESS}`;
      blockchainResources.commmunityFactoryAddress = `${process.env.RINKEBY_COMMUNITY_FACTORY_ADDRESS}`;
      blockchainResources.approvedNetwork = true;
    }else {
      throw "Invalid network"
    }

    const signer = await provider.getSigner();
    const communityFactory = (await new ethers.Contract(`${blockchainResources.commmunityFactoryAddress}`, CommunityFactoryABI.abi, provider)).connect(signer);

    const publishedBlock = parseInt(ethers.utils.formatUnits(await communityFactory.publishedBlocknumber(), 0));

    blockchainResources.publishedBlock = publishedBlock;
  }
  catch(e){
    initBlockchainResourcesDeprecated();
  }
}

export async function resetBlockchainObjects(){
  blockchainResources = {
    publishedBlock: 0,
    approvedNetwork: false,
    networkId: 0,
    daiAddress: "0x",
    commmunityFactoryAddress: "0x"
  };
}

export async function getBlockchainObjects(): Promise<{web3: any, signer: JsonRpcSigner, provider: Web3Provider, ethereum: any, signerAddress: string } >{
  const { web3, ethereum } = window as any;

  try{
    if(blockchainResources.daiAddress == "0x"){
      await initBlockchainResources();
    }
    let provider = await (new ethers.providers.Web3Provider(ethereum));
    // @ts-ignore
    await provider.ready;
    const signer = await provider.getSigner();

    if(blockchainResources.daiAddress == "0x"){
      await initBlockchainResources();
    }
    const address = await signer.getAddress();
    return {
      web3: web3,
      provider: provider,
      signer: signer,
      ethereum: ethereum,
      signerAddress: address
    }
  }
  catch(e){
    throw e;
  }
}
