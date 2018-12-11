import history from '../../utils/history';
import {take, call, put, race, fork} from 'redux-saga/effects'

import ActionTypes from  './constants';
import { login, signUp } from '../../api/api';
import { requestError, setAuthState, saveToken, sendingRequest, clearError } from './actions';

export function * authorize ({email, password}) {
  yield put(sendingRequest(true))
  yield put(clearError());

  try {
    let response;
    response = yield call(login, email, password);
    return response
  } catch (error) {
    // If we get an error we send Redux the appropriate action and return
    yield put(requestError(error.message));
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put(sendingRequest(false))
  }
}

export function * register (email, password, firstName, lastName) {
  yield put(sendingRequest(true))

  try {
    let response;
    response = yield call(signUp, email, password, firstName, lastName);
    return response
  } catch (error) {

    // If we get an error we send Redux the appropiate action and return
    yield put(requestError(error.message))

    return false
  } finally {
    // When done, we tell Redux we're not in the middle of a request any more
    yield put(sendingRequest(false))
  }
}

export function * loginFlow () {
  // Because sagas are generators, doing `while (true)` doesn't block our program
  // Basically here we say "this saga is always listening for actions"
  while (true) {
    // And we're listening for `LOGIN_REQUEST` actions and destructuring its payload
    const request = yield take(ActionTypes.LOGIN_REQUEST)
    const {email, password} = request.data

    // A `LOGOUT` action may happen while the `authorize` effect is going on, which may
    // lead to a race condition. This is unlikely, but just in case, we call `race` which
    // returns the "winner", i.e. the one that finished first
    const winner = yield race({
      auth: call(authorize, {email, password}),
      logout: take(ActionTypes.LOGOUT)
    })

    // If `authorize` was the winner...
    if (winner.auth) {
      // TODO Figure out a better way to return
      const {data} = winner.auth;
      if (data.status === 'SUCCESS') {
        yield put(setAuthState(true));
        yield put(saveToken(data.token));
        forwardTo('/dashboard');
      } else {
        yield put(requestError('E-mail or password is incorrect'));
      }
    }
  }
}

export function * logoutFlow () {
  while (true) {
    yield take(ActionTypes.LOGOUT)
    yield put(setAuthState(false))
    yield put(saveToken(''));
    forwardTo('/')
  }
}

export function * signupFlow () {
  while (true) {
    const request = yield take(ActionTypes.SIGNUP_REQUEST)

    const {email, password, firstName, lastName} = request.data;
    yield call(register, email, password, firstName, lastName)

    forwardTo('/login')
  }
}

export default function * root () {
  yield fork(loginFlow);
  yield fork(logoutFlow);
  yield fork(signupFlow);
}

function forwardTo (location) {
  history.push(location)
}
