import { takeLatest, put, race, take, fork } from "redux-saga/effects";
import { setPendingState } from "./actions";

export function* toggleTXPendingFlag(action) {
  try {
    yield put(setPendingState(true));
    yield race({
      success: take(action.type.replace('TX_REQUEST', 'TX_SUCCESS')),
      failure: take(action.type.replace('TX_REQUEST', 'TX_FAILURE'))
    })
  } catch (error) {
  } finally {
    yield put(setPendingState(false));
  }
}

export function* txPendingListener() {
  yield takeLatest(action => (action.type.endsWith('TX_REQUEST')), toggleTXPendingFlag);
}


export default function* TransactionManagementSaga() {
  yield put(setPendingState(false));
  yield fork(txPendingListener);
}
