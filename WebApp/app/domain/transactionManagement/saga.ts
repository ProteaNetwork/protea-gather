import { takeLatest, put, race, take, fork, call } from "redux-saga/effects";
import { setPendingState, refreshBalancesAction, setBalancesAction, setTxContextAction, setRemainingTxCountAction } from "./actions";
import { checkBalancesOnChain, mintDai } from "./chainInteractions";
import { getAllCommunitiesAction } from "domain/communities/actions";
import { delay } from "redux-saga/effects";



// Generators
// Meta
export function* refreshBalances(){
  let newBalances = yield call(checkBalancesOnChain);
  if(newBalances.daiBalance == 0){
    yield put(setPendingState(true));
    yield put(setRemainingTxCountAction(1));
    yield put(setTxContextAction(`Setting up with pseudo dai`));
    yield call(mintDai);
    yield put(setPendingState(true));
    yield put(setRemainingTxCountAction(0));
    newBalances = yield call(checkBalancesOnChain);


  }
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
    yield put(setTxContextAction(`Updating data from the chain`));
    // TODO: Automatic update of previously looked up event & community
    yield delay(5000);
    yield put(getAllCommunitiesAction());
    yield delay(2000);

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
