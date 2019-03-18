import window from'./window.mock';
import * as authenticationActions from '../actions';
import * as userProfileActions from '../../userProfile/actions';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import {  login } from '../../../api/api';
import { forwardTo } from '../../../utils/history';
import jwtDecode from 'jwt-decode';

import {
  connectWallet,
  getPermit,
  addressChangeListener,
  getAccessToken,
  addressChangeEventChannel,
  loginFlow,
  refreshTokenPoller,
} from '../saga';

import authenticationReducer, { initialState } from '../reducer'
import { testAddress } from 'web3-utils/types';

describe('getAccessToken', () => {
  it('returns an access token for a valid permit', async () => {
    return expectSaga(getAccessToken, '0xMockValidPermit', window.ethereum.selectedAddress)
      .withReducer(authenticationReducer, initialState)
      .provide([
        [ matchers.call(login, '0xMockValidPermit', window.ethereum.selectedAddress),
          {data: {accessToken: 'FakeAccessToken'}}
        ]
      ])
      .put(authenticationActions.saveAccessToken({accessToken: 'FakeAccessToken'}))
      .hasFinalState({
        walletUnlocked: false,
        signedPermit: '',
        accessToken: 'FakeAccessToken',
        errorMessage: '' })
      .returns({ accessToken: 'FakeAccessToken' })
      .silentRun()
  })

  it('fails on invalid permit', () => {
    const error = new Error('Authentication Error');
    const startingState = {...initialState, ...{signedPermit: '0xMockInvalidPermit'}}
    return expectSaga(getAccessToken, startingState.signedPermit, window.ethereum.selectedAddress)
      .withReducer(authenticationReducer, )
      .provide([
        [matchers.call(login, '0xMockInvalidPermit', window.ethereum.selectedAddress), throwError(error)]
      ])
      .put(authenticationActions.logOut())
      .put(authenticationActions.authenticate.failure('Looks like something went wrong. Please sign another message'))
      .hasFinalState({
        walletUnlocked: false,
        signedPermit: '',
        accessToken: '',
        errorMessage: 'Looks like something went wrong. Please sign another message' })
      .silentRun()
  })

  it('fails on the server side', () => {
    const error = new Error();
    return expectSaga(getAccessToken, '0xMockInvalidPermit', window.ethereum.selectedAddress)
      .withReducer(authenticationReducer, initialState)
      .provide([
        [matchers.call(login, '0xMockInvalidPermit', window.ethereum.selectedAddress), throwError(error)]
      ])
      .put(authenticationActions.authenticate.failure('The server did not respond. Try again.'))
      .hasFinalState({
        walletUnlocked: false,
        signedPermit: '',
        accessToken: '',
        errorMessage: 'The server did not respond. Try again.' })
      .silentRun()
  })
})

describe('connectWallet', () => {
  it('successfully calls the wallet connect if available', () => {
    return expectSaga(connectWallet)
      .withReducer(authenticationReducer, initialState)
      .provide([
        [matchers.call(ethereum.enable), ["0x"]],
        [matchers.fork(refreshTokenPoller), {}]
      ])
      .put(authenticationActions.connectWallet.success())
      .hasFinalState({
        walletUnlocked: true,
        signedPermit: '',
        accessToken: '',
        errorMessage: '' })
      .silentRun()
  })

  it('fails gracefully when the user denies authorization', () => {
    const error = new Error('you did not accept')
    return expectSaga(connectWallet)
      .withReducer(authenticationReducer, initialState)
      .provide([
        [matchers.call(ethereum.enable), throwError(error)]
      ])
      .put(authenticationActions.connectWallet.failure(error.message))
      .hasFinalState({
        walletUnlocked: false,
        signedPermit: '',
        accessToken: '',
        errorMessage: 'you did not accept' })
      .silentRun()
  })

  test.todo('test with window.ethereum as undefined, but still valid web3')

  test.todo('test with window.ethereum as undefined, and window.web3 undefined')
})

//This saga only runs when the user is logged in
describe('addressChangeListener', () => {
  it('logs the user out if their address changes', () => {
    const loggedInState = {
      walletUnlocked: true,
      signedPermit: '0xFAKE_PERMIT',
      accessToken: '0xFAKE_PERMIT',
      errorMessage: '',
    }

    // Helper function to only return one event on the channel.
    // This simulates the user's address changing
    function provideEvent(event) {
      let consumed = false;

      return {
        take({ channel }, next) {
          if (channel === addressChangeEventChannel && !consumed) {
            consumed = true;
            return event;
          }

          return next();
        },
      };
    }

    return expectSaga(addressChangeListener)
      .withReducer(authenticationReducer, loggedInState)
      .provide([provideEvent('Wallet Address changed')])
      .put(authenticationActions.logOut())
      .hasFinalState({
        walletUnlocked: true,
        signedPermit: '',
        accessToken: '',
        errorMessage: '' })
      .silentRun()
  })
})

describe('loginFlow', () => {
  it('logs the user in and sends them to the dashboard', () => {
    return expectSaga(loginFlow)
      .withReducer(authenticationReducer, {...initialState, walletUnlocked: true})
      .provide([
        [matchers.call(getPermit), "0xSIGNED_PERMIT"],
        [matchers.call(getAccessToken, "0xSIGNED_PERMIT", window.ethereum.selectedAddress), {}],
        // mock the poller fork to avoid having to mock it's dependencies
        [matchers.fork.fn(refreshTokenPoller), {}]
      ])
      .put(userProfileActions.getUserProfile.request())
      .fork(refreshTokenPoller)
      .call(forwardTo, '/dashboard')
      .dispatch(authenticationActions.authenticate.request())
      .silentRun()
  })
})

describe('refreshTokenPoller', () => {
  // TODO: check that after 10 seconds, the refresh is sent and the tokens are updated, then kill saga prematurely

  // it('refreshes an accessToken that is expiring soon and goes to sleep', () => {
  //   // This is necessary because the reducer sees only it's slice of state
  //   // The saga on the other hand can read from anywhere in the state tree
  //   const loggedInState = {
  //     authentication : {
  //       ...initialState,
  //       walletUnlocked: true,
  //       signedPermit: '0xVALID_PERMIT',
  //       accessToken: '0xEXPIRING_SOON' }
  //   }

  //   const aboutToExpireToken = {
  //     userId: 'SOME_ID',
  //     iat: (Date.now() / 1000) - (55*60), //issued 55 minutes ago
  //     exp: (Date.now() / 1000) + 10, //expiring in 10 seconds
  //     iss: 'FAKE_ISSUER',
  //     sub: '0xFAKE_SUBJECT',
  //   };

  //   const justIssuedToken = {
  //     userId: 'SOME_ID',
  //     iat: (Date.now() / 1000) - 1, //issued 1 sec ago
  //     exp: (Math.trunc(Date.now() / 1000) + (60*60)), //expiring in 1 hour
  //     iss: 'FAKE_ISSUER',
  //     sub: '0xFAKE_SUBJECT'
  //   };

  //   return expectSaga(refreshTokenPoller)
  //     .withReducer(authenticationReducer, loggedInState)
  //     .provide([
  //       [matchers.call(jwtDecode, '0xEXPIRING_SOON'), aboutToExpireToken],
  //       [matchers.call(getAccessToken, "0xSIGNED_PERMIT", window.ethereum.selectedAddress), '0xFRESHLY_ISSUED'],
  //       [matchers.call(jwtDecode, '0xFRESHLY_ISSUED'), justIssuedToken],
  //     ])
  //     .silentRun()
  // })
})

describe('getPermit', () => {
  test.todo('test the getPermit')
})

describe('rootAuthenticationSaga', () => {
  test.todo('test the rootAuthenticationSaga');
})
