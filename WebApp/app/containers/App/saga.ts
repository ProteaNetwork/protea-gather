import {fork, call, take} from 'redux-saga/effects';

import AuthSaga from '../../domain/authentication/saga';
import UserProfileSaga from '../../domain/userProfile/saga';
import CommunitiesSaga from '../../domain/communities/saga';
import TransactionManagementSaga from '../../domain/transactionManagement/saga';
import MembershipManagementSaga from '../../domain/membershipManagement/saga';
import EventsSaga from '../../domain/events/saga';


export default function * root() {
  // Add other global DAEMON sagas here.
  // To prevent performance bottlenecks add sagas with caution.

  yield fork(TransactionManagementSaga);

  yield fork(AuthSaga);
  yield fork(UserProfileSaga);

  yield fork(CommunitiesSaga);
  yield fork(MembershipManagementSaga);
  yield fork(EventsSaga);
}
