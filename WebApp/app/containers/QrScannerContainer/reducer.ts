/*
 *
 * QrScannerContainer reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { ContainerState, ContainerActions } from './types';

export const initialState: ContainerState = {
  active: false,
};

function reducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case ActionTypes.SCAN_QR_REQUEST:
      return {
        ...state,
        active: true
      }
    case ActionTypes.SCAN_QR_SUCCESS:
      return {
        ...state,
        active: false
      }
    case ActionTypes.SCAN_QR_FAILURE:
      return {
        ...state,
        active: false
      }
    default:
      return state;
  }
}

export default reducer;
