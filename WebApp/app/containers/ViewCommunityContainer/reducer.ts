/*
 *
 * ViewCommunityContainer reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { ContainerState, ContainerActions } from './types';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  default: null,
};

function viewCommunityContainerReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    default:
      return state;
  }
}

export default viewCommunityContainerReducer;

