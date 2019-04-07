/*
 *
 * TransactionManagement reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { DomainState, DomainActions } from './types';
import { getType } from 'typesafe-actions';
import { setPendingState, setBalancesAction, setRemainingTxCountAction, setTxContextAction } from './actions';

export const initialState: DomainState = {
  txPending: false,
  daiBalance: 0,
  ethBalance: 0,
  txRemaining: 0,
  txContext: ''
};

function transactionManagementReducer(state: DomainState = initialState, action: DomainActions ) {
  switch (action.type) {
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

