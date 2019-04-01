import { ethers } from 'ethers';
import { normalize } from 'normalizr';
import { call, fork, put, race, select, take, takeLatest } from 'redux-saga/effects';
import { ApplicationRootState } from 'types';
import { getUserProfile as getUserProfileApi } from '../../api/api';
import * as userProfileActions from './actions';
import ActionTypes from './constants';


// Individual exports for testing

export function* getProfileData() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const response = yield call(getUserProfileApi, apiKey);
    yield put(userProfileActions.getUserProfile.success(response.data));
  } catch (error) {
    console.log(error);
    yield put(userProfileActions.getUserProfile.failure(error.message));
  } finally {
    // yield put(sendingRequest(false))
  }
}

export function* getUserProfileFlow() {
  while (true) {
    yield take(ActionTypes.GET_PROFILE_REQUEST);
    yield call(getProfileData);

  }
}

export default function* root() {
  yield fork(getUserProfileFlow);
}

