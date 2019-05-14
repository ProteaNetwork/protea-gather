import { ethers } from 'ethers';
import { normalize } from 'normalizr';
import { call, fork, put, race, select, take, takeLatest } from 'redux-saga/effects';
import { ApplicationRootState } from 'types';
import { getUserProfile as getUserProfileApi, updateProfile as updateProfileApi } from '../../api/api';
import * as userProfileActions from './actions';
import ActionTypes from './constants';
import { setUserProfile } from './actions';
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
    console.log(error);
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
    yield put(setUserProfile.success(userData))
  }
  catch (error) {
    yield put(setUserProfile.failure(error.message));
    return false;
  }
}

export function* setProfileDataListener() {
  while(true){
    const profileData = (yield take(setUserProfile.request)).payload;
    yield call(setProfileData, profileData)
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
}

