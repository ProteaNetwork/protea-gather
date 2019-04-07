import { takeLatest, put, race, take, fork, call } from "redux-saga/effects";
import { setPendingState, refreshBalancesAction, setBalancesAction, setTxContextAction } from "./actions";
import * as DaiContractAbi from "../../../../Blockchain/build/PseudoDaiToken.json";
import { ethers } from "ethers";

// Ethers standard event filter type is missing the blocktags
import { BlockTag } from 'ethers/providers/abstract-provider';

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: BlockTag;
  toBlock?: BlockTag
};
// Blockchain
async function checkBalancesOnChain() {
  const { web3 } = window as any;
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = await provider.getSigner();
  const daiContract = (await new ethers.Contract(`${process.env.DAI_ADDRESS}`, DaiContractAbi.abi, provider)).connect(signer);

  const daiBalance = parseFloat(ethers.utils.formatUnits((await daiContract.balanceOf(signer.getAddress())), 18));
  const ethBalance = parseFloat(ethers.utils.formatEther(await signer.getBalance()));
  return {
    daiBalance: daiBalance,
    ethBalance: ethBalance,
  };
}


// Generators
// Meta
export function* refreshBalances(){
  const newBalances = yield call(checkBalancesOnChain);
  yield put(setBalancesAction(newBalances));
}

// State managers
export function* toggleTXPendingFlag(action) {
  try {
    yield put(setPendingState(true));

    yield race({
      success: take(action.type.replace('TX_REQUEST', 'TX_SUCCESS')),
      failure: take(action.type.replace('TX_REQUEST', 'TX_FAILURE'))
    })
    yield put(setTxContextAction(`` ));
    yield put(refreshBalancesAction())
  } catch (error) {
  } finally {
    yield put(setPendingState(false));
  }
}

// Listeners
export function* txPendingListener() {
  yield takeLatest(action => (action.type.endsWith('TX_REQUEST')), toggleTXPendingFlag);
}

export function* refreshBalancesListener() {
  while(true){
    yield take(refreshBalancesAction);
    yield call(refreshBalances);
  }
}

export default function* TransactionManagementSaga() {
  yield put(setPendingState(false));
  yield fork(txPendingListener);
  yield fork(refreshBalancesListener);
}
