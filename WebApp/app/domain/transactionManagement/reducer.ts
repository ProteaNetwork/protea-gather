/*
 *
 * TransactionManagement reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { DomainState, DomainActions } from './types';
import { getType } from 'typesafe-actions';
import { setPendingState, setBalancesAction, setRemainingTxCountAction, setTxContextAction, setCommunityMutexAction, setQrAction } from './actions';

export const initialState: DomainState = {
  txPending: false,
  daiBalance: 0,
  ethBalance: 0,
  ethAddress: "0x",
  txRemaining: 0,
  txContext: '',
  communityMutex: '',
  qrData: ""
};

function transactionManagementReducer(state: DomainState = initialState, action: DomainActions ) {
  switch (action.type) {
    case getType(setQrAction):
      return {
        ...state,
        qrData: action.payload
      }
    case getType(setCommunityMutexAction):
      return {
        ...state,
        communityMutex: action.payload
      }
    case getType(setTxContextAction):
      return {
        ...state,
        txContext: action.payload
      }
    case getType(setRemainingTxCountAction):
      return {
        ...state,
        txRemaining: action.payload
      }
    case getType(setBalancesAction):
      return {
        ...state,
        ...action.payload
      }
    case getType(setPendingState):
      return{
        ...state,
        txPending: action.payload
      }
    default:
      return state;
  }
}

export default transactionManagementReducer;

