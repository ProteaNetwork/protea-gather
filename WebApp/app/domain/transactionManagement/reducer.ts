/*
 *
 * TransactionManagement reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { DomainState, DomainActions } from './types';
import { getType } from 'typesafe-actions';
import { setPendingState } from './actions';

export const initialState: DomainState = {
  txPending: false
};

function transactionManagementReducer(state: DomainState = initialState, action: DomainActions ) {
  switch (action.type) {
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

