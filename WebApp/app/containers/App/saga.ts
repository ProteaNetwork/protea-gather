import {fork, call, take} from 'redux-saga/effects';

import AuthSaga from '../../domain/authentication/saga';
import UserProfileSaga from '../../domain/userProfile/saga';
import CommunitiesSaga from '../../domain/communities/saga';
import TransactionManagementSaga from '../../domain/transactionManagement/saga';
import MembershipManagementSaga from '../../domain/membershipManagement/saga';
import EventsSaga from '../../domain/events/saga';
import { ethers } from 'ethers';
import * as CommunityFactoryABI from "../../../../Blockchain/build/CommunityFactoryV1.json";
import { connectWallet } from 'domain/authentication/actions';
import { blockchainResources } from 'blockchainResources';

async function initBlockchainResources() {
  const { web3, ethereum } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const communityFactory = (await new ethers.Contract(`${process.env.COMMUNITY_FACTORY_ADDRESS}`, CommunityFactoryABI.abi, provider)).connect(signer);

  const publishedBlock = parseInt(ethers.utils.formatUnits(await communityFactory.publishedBlocknumber(), 0));

  blockchainResources.publishedBlock = publishedBlock;
}

export function* bootstrapBlockchainResources(){
  yield take(connectWallet.success);
  yield call(initBlockchainResources);
}

export default function * root() {
  // Add other global DAEMON sagas here.
  // To prevent performance bottlenecks add sagas with caution.
  yield fork(bootstrapBlockchainResources);

  yield fork(TransactionManagementSaga);

  yield fork(AuthSaga);
  yield fork(UserProfileSaga);

  yield fork(CommunitiesSaga);
  yield fork(MembershipManagementSaga);
  yield fork(EventsSaga);
}
