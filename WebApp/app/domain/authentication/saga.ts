import { ethers } from 'ethers';
import jwtDecode from 'jwt-decode';
import { eventChannel } from 'redux-saga';
import { call, cancel, delay, fork, put, race, select, take } from 'redux-saga/effects';
import { ApplicationRootState } from 'types';
import { forwardTo } from 'utils/history';
import Web3 from 'web3';
import { getPermit as getPermitApi, login } from '../../api/api';
import * as userProfileActions from '../userProfile/actions';
import * as authenticationActions from './actions';
import ActionTypes from './constants';
import { refreshBalances } from 'domain/transactionManagement/saga';
import { refreshBalancesAction } from 'domain/transactionManagement/actions';
import { initBlockchainResources, blockchainResources, getBlockchainObjects } from 'blockchainResources';

export function* getPermit() {
  const {signer, signerAddress} = yield call(getBlockchainObjects)

  try {
    // console.log('getting new permit');
    const permitResponse = yield call(getPermitApi, signerAddress);
    const signedPermit = yield signer.signMessage(permitResponse.data.permit);
    yield put(authenticationActions.saveAccessPermit(signedPermit));
    return signedPermit;
  } catch (error) {
    // TODO: What should we do in this case?
    console.log(error);
  }
}

export function* getAccessToken(signedPermit, ethAddress) {
  try {
    const apiToken = yield call(login, signedPermit, ethAddress);
    alert("getting token")
    yield put(authenticationActions.saveAccessToken(apiToken.data));
    return apiToken.data;
  } catch (error) {
    if (error.message.includes('Authentication Error')) {
      yield put(authenticationActions.logOut());
      yield put(authenticationActions.authenticate.failure('Looks like something went wrong. Please sign another message'));
    } else {
      yield put(authenticationActions.authenticate.failure('The server did not respond. Try again.'));
    }
  }
}

export function* refreshTokenPoller() {
  while (true) {
    const signedMessage = yield select((state: ApplicationRootState) => state.authentication.signedPermit);
    const apiToken = yield select((state: ApplicationRootState) => state.authentication.accessToken);
    const { ethereum } = window as any;
    const accountArray = yield call(ethereum.send, 'eth_requestAccounts');
    if(accountArray.code && accountArray.code == 4001){
      throw("Connection rejected");
    }

    let delayDuration;
    let decodedToken;
    try {
      decodedToken = yield call(jwtDecode, apiToken);
    } catch (error) {
      // console.log(`Unable to decode token. Refreshing...`);
      const newToken = yield call(getAccessToken, signedMessage, accountArray[0]);
      decodedToken = yield call(jwtDecode, newToken);
    }

    delayDuration = (decodedToken.exp - Date.now() / 1000) * 0.9;
    // Only refresh the token when it is nearing expiry.
    if ((Date.now() / 1000) + (delayDuration + 1) > decodedToken.exp) {
      // console.log(`Token is expiring soon. Refreshing...`);
      yield call(getAccessToken, signedMessage, accountArray[0]);
      // console.log(`access token updated`);
    } else {
      // console.log(`token not refreshed, going to sleep for ${delayDuration}`);
      yield delay(delayDuration * 1000);
    }
  }
}

export function* loginFlow() {
  while (yield take(ActionTypes.AUTH_REQUEST)) {
    const { ethereum } = window as any;

    try {
      const response = yield call(getPermit);
      const accountArray = yield call(ethereum.send, 'eth_requestAccounts');
      if(accountArray.code && accountArray.code == 4001){
        throw("Connection rejected");
      }
      yield call(getAccessToken, response, accountArray[0]);
      yield put(userProfileActions.getUserProfile.request());
      yield fork(refreshTokenPoller);
      yield put(refreshBalancesAction());
      yield call(forwardTo, '/dashboard'); // TODO: have this only redirect when on log in
    } catch (error) {
      yield put(authenticationActions.authenticate.failure(error.message));
      console.log(error);
    }
  }
}

export function* connectWallet() {
  let { web3 } = window as any;
  const {ethAddress, ethereum } = yield call(getBlockchainObjects);
  if (ethereum) {
    try {
      yield put(authenticationActions.setEthAddress({ethAddress : ethAddress}));
      yield put(authenticationActions.connectWallet.success());
    } catch (error) {
      yield put(authenticationActions.connectWallet.failure(error.message));
    }
  } else if (web3) {
    web3 = new ethers.providers.Web3Provider(ethereum);
    yield put(authenticationActions.connectWallet.success());
  } else {
    yield put(authenticationActions.connectWallet.failure('Non-Ethereum browser detected. You should consider trying MetaMask!'));
  }
}

// Exported for testing purposes
export const addressChangeEventChannel = eventChannel(emit => {
  try{
    const { ethereum } = window as any;
    ethereum.on('accountsChanged', () => {
      emit('Wallet Address changed');
    });
  }
  catch(e){
    emit("Error")
  }
  return () => { };
});

export function* addressChangeListener() {
  while (true) {
    const newAddress = yield take(addressChangeEventChannel);
    yield put(authenticationActions.setEthAddress({ethAddress : newAddress}));
    yield put(authenticationActions.logOut());
    yield fork(connectWallet)
  }
}

export default function* rootAuthenticationSaga() {
  while (true) {
    // Start a task to unlock the wallet.
    const connectWalletTask = yield fork(connectWallet);

    // Wait till a response comes back a response on the wallet.
    const { success } = yield race({
      cancel: take(ActionTypes.CONNECT_WALLET_FAILURE),
      success: take(ActionTypes.CONNECT_WALLET_SUCCESS),
    });

    if (success) {
      // Cancel the task that we started
      yield cancel(connectWalletTask);

      // Start the addressChange listener
      yield fork(addressChangeListener);

      // Check store for existing signed message
      const signedMessage = yield select((state: ApplicationRootState) => state.authentication.signedPermit);
      let watcher;
      if (!signedMessage) {
        // Start the login listener
        watcher = yield fork(loginFlow);
      } else {
        // Start the refresh token listener
        watcher = yield fork(refreshTokenPoller);
      }

      // Wait till we receive a logout event
      yield take(ActionTypes.LOG_OUT);
      yield cancel(watcher);
    } else {
      yield delay(2000);
    }
  }
}
