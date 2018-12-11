/*
 *
 * CommunitiesPage reducer
 *
 */

// import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { ContainerState, ContainerActions } from './types';

export const initialState: ContainerState = {
  searchParameter: '',
  sortParameter: 1,
};

function communitiesPageReducer(
  state: ContainerState = initialState,
  action: ContainerActions
): ContainerState {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTER:
      return {...state, ...{
        [action.payload.name]: action.payload.value
      }};
    default:
      return state;
  }
}

export default communitiesPageReducer;
