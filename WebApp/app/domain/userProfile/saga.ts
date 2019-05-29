import { ethers } from 'ethers';
import { normalize } from 'normalizr';
import { call, fork, put, race, select, take, takeLatest, delay } from 'redux-saga/effects';
import { ApplicationRootState } from 'types';
import { getUserProfile as getUserProfileApi, updateProfile as updateProfileApi, sendFeedback as sendFeedbackApi } from '../../api/api';
import * as userProfileActions from './actions';
import ActionTypes from './constants';
import { setUserProfile, setPendingStateAction, sendFeedbackAction } from './actions';
import { getBlockchainObjects } from 'blockchainResources';
import { IMember } from 'domain/membershipManagement/types';


// Individual exports for testing
export function* getProfileData() {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  const {signerAddress} = yield call(getBlockchainObjects)
  try {
    const response = (yield call(getUserProfileApi, signerAddress, apiKey)).data;
    yield put(userProfileActions.getUserProfile.success(response));
  } catch (error) {
    console.error(error);
    yield put(userProfileActions.getUserProfile.failure(error.message));
  } finally {
    // yield put(sendingRequest(false))
  }
}

export function* setProfileData(data: IMember) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  const {signerAddress} = yield call(getBlockchainObjects);
  data.ethAddress = signerAddress;
  try {
    const userData = (yield call(updateProfileApi, data, apiKey)).data;
    yield put(setPendingStateAction("success"));
    yield put(setUserProfile.success(userData));
    yield delay(2000);
    yield put(setPendingStateAction("ready"));

  }
  catch (error) {
    yield put(setUserProfile.failure(error));
    yield put(setPendingStateAction("failure"));
    yield delay(2000);
    yield put(setPendingStateAction("ready"));
    return false;
  }
}


export function* sendFeedback(data: {address: string, feedback: string, browser: string}) {
  const apiKey = yield select((state: ApplicationRootState) => state.authentication.accessToken);
  try {
    const userData = (yield call(sendFeedbackApi, data, apiKey)).data;
    yield put(setPendingStateAction("success"));
    yield put(sendFeedbackAction.success(userData));
    yield delay(2000);
    yield put(setPendingStateAction("ready"));

  }
  catch (error) {
    yield put(sendFeedbackAction.failure(error));
    yield put(setPendingStateAction("failure"));
    yield delay(2000);
    yield put(setPendingStateAction("ready"));
    return false;
  }
}

export function* setProfileDataListener() {
  while(true){
    const profileData = (yield take(setUserProfile.request)).payload;
    yield put(setPendingStateAction("request"));
    yield call(setProfileData, profileData)
  }
}

export function* sendFeedbackListener() {
  while(true){
    const feedbackData = (yield take(sendFeedbackAction.request)).payload;
    yield put(setPendingStateAction("request"));
    yield call(sendFeedback, feedbackData)
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
  yield fork(setProfileDataListener);
  yield fork(sendFeedbackListener);
}

