import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import ActionTypes from './constants';

export const authenticate = createAsyncAction(
  ActionTypes.AUTH_REQUEST,
  ActionTypes.AUTH_SUCCESS,
  ActionTypes.AUTH_FAILURE)
  <void, void, string>();

export const saveAccessPermit = createStandardAction(ActionTypes.SAVE_ACCESS_PERMIT)<string>();

export const saveAccessToken = createStandardAction(ActionTypes.SAVE_ACCESS_TOKEN)<{accessToken: string}>();


export const setEthAddress = createStandardAction(ActionTypes.SET_ETH_ADDRESS)<{ethAddress: string}>();

export const connectWallet = createAsyncAction(
  ActionTypes.CONNECT_WALLET_REQUEST,
  ActionTypes.CONNECT_WALLET_SUCCESS,
  ActionTypes.CONNECT_WALLET_FAILURE)
  <void, void, string>();

export const logOut = createStandardAction(ActionTypes.LOG_OUT)();
