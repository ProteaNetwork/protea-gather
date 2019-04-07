import { put } from "redux-saga/effects";
import { refreshBalancesAction } from "domain/transactionManagement/actions";


export default function* viewCommunityContainerWatcherSaga() {
  yield put(refreshBalancesAction())
}
