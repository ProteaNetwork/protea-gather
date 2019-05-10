/*
 *
 * TransactionManagement actions
 *
 */

import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const setPendingState = createStandardAction(ActionTypes.SET_PENDING_STATE)<Boolean>();

export const refreshBalancesAction = createStandardAction(ActionTypes.REFRESH_BALANCES)<void>()

export const setBalancesAction = createStandardAction(ActionTypes.SET_BALANCES)<{daiBalance: number, ethBalance: number, ethAddress: string}>();

export const setRemainingTxCountAction = createStandardAction(ActionTypes.SET_TX_REMAINING_COUNT)<number>();

export const setTxContextAction = createStandardAction(ActionTypes.SET_TX_CONTEXT)<string>();

export const setCommunityMutexAction = createStandardAction(ActionTypes.SET_COMMUNITY_MUTEX)<string>();

export const updateTouchedChainDataAction = createStandardAction(ActionTypes.UPDATE_TOUCHED_CHAIN_DATA)<void>();

export const setQrAction = createStandardAction(ActionTypes.SET_QR)<string>();

export const signQrAction = createAsyncAction(
  ActionTypes.SIGN_QR_REQUEST,
  ActionTypes.SIGN_QR_SUCCESS,
  ActionTypes.SIGN_QR_FAILURE
)<string, void, string>();

