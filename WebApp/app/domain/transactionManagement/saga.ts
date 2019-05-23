import { takeLatest, put, race, take, fork, call, select } from "redux-saga/effects";
import { refreshBalancesAction, setBalancesAction, setTxContextAction, setRemainingTxCountAction, updateTouchedChainDataAction, setCommunityMutexAction, setQrAction, signQrAction, sendErrorReportAction, setTxPendingState } from "./actions";
import { checkBalancesOnChain, mintDai } from "./chainInteractions";
import { getAllCommunitiesAction, getCommunityAction } from "domain/communities/actions";
import { delay } from "redux-saga/effects";
import { blockchainResources, signMessage, getBlockchainObjects } from "blockchainResources";
import { ApplicationRootState } from "types";
import { sendErrorReport as sendErrorReportApi } from "api/api";
import { IError } from "./types";



// Generators
// Meta
export function* refreshBalances(){
  let newBalances = yield call(checkBalancesOnChain);
  if(newBalances.daiBalance == 0 && blockchainResources.networkId != 1){
    yield put(setTxPendingState(true));
    yield put(setRemainingTxCountAction(1));
    yield put(setTxContextAction(`Setting up with pseudo dai`));
    yield call(mintDai);
    yield put(setTxPendingState(false));
    yield put(setRemainingTxCountAction(0));
    newBalances = yield call(checkBalancesOnChain);
  }
  yield put(setBalancesAction(newBalances));
}

// State managers
export function* toggleTXPendingFlag(action) {
  try {
    yield put(setTxPendingState(true));

    const {success, failure} = yield race({
      success: take(action.type.replace('TX_REQUEST', 'TX_SUCCESS')),
      failure: take(action.type.replace('TX_REQUEST', 'TX_FAILURE'))
    })

    if(failure){
      yield put(sendErrorReportAction.request(failure.payload))
    }

    yield put(setRemainingTxCountAction(0));
    yield put(setTxContextAction(`Updating data from the chain`));
    // TODO: Automatic update of previously looked up event & community
    yield delay(5000);
    yield put(updateTouchedChainDataAction());
    yield delay(2000);
    yield put(setTxContextAction(``));

    yield put(refreshBalancesAction())
  } catch (error) {
  } finally {
    yield put(setTxPendingState(false));
  }
}

export function* signQr(message: string){
  try{
    const signedMessage = yield call(signMessage, message);
    yield put(setQrAction(signedMessage));
    yield put(signQrAction.success());
  }
  catch(e){
    yield put(signQrAction.failure(e));
  }
}

// Listeners
export function* signQrListener(){
  while(true){
    const message = (yield take(signQrAction.request)).payload
    yield fork(signQr, message);
  }
}

export function* updatePostTxListener(){
  while(true){
    yield take(updateTouchedChainDataAction);
    const tbcAddress = yield select((state: ApplicationRootState) => state.transactionManagement.communityMutex);
    if(tbcAddress != ''){
      yield put(getCommunityAction.request(tbcAddress));
      yield call(refreshBalances);
      yield put(setCommunityMutexAction(''));
    }
  }
}

export function* txPendingListener() {
  yield takeLatest(action => (action.type.endsWith('TX_REQUEST')), toggleTXPendingFlag);
}

export function* refreshBalancesListener() {
  while(true){
    yield take(refreshBalancesAction);
    yield call(refreshBalances);
  }
}

export function* sendErrorReportListener(){
  while(true){
    const errorMessage = (yield take(sendErrorReportAction.request)).payload;
    const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
    const {signerAddress} = yield call(getBlockchainObjects);
    const error: IError = {reporterAddress: signerAddress.toString(), errorMessage: JSON.stringify(errorMessage)}
    try{
      yield call(sendErrorReportApi, error, apiKey);
      yield put(sendErrorReportAction.success())
    }
    catch(e){
      yield put(sendErrorReportAction.failure(e))
    }
  }
}

export default function* TransactionManagementSaga() {
  yield put(setTxPendingState(false));
  yield put(setCommunityMutexAction(''));
  yield put(setQrAction(''));
  yield fork(txPendingListener);
  yield fork(refreshBalancesListener);
  yield fork(updatePostTxListener);
  yield fork(signQrListener);
  yield fork(sendErrorReportListener);
}
