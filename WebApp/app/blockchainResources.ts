import { Web3Provider, JsonRpcSigner } from "ethers/providers";
import { ethers } from "ethers";
import * as CommunityFactoryABI from "../../Blockchain/build/CommunityFactoryV1.json";

export let blockchainResources = {
  publishedBlock: 0,
  approvedNetwork: false,
  networkId: 0,
  daiAddress: "0x",
  commmunityFactoryAddress: "0x"
};

export async function initBlockchainResources() {
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
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

export async function getBlockchainObjects(): Promise<{web3: any, signer: JsonRpcSigner, provider: Web3Provider}>{
  const { web3 } = window as any;
  const provider = await (new ethers.providers.Web3Provider(web3.currentProvider));
  // @ts-ignore
  await provider.ready;
  const signer = await provider.getSigner();

  if(blockchainResources.daiAddress == "0x"){
    await initBlockchainResources()
  }
  return {
    web3: web3,
    provider: provider,
    signer: signer
  }
}
