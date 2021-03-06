/*
 *
 * Communities reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { DomainState, DomainActions, ICommunity } from './types';
import { getType } from 'typesafe-actions';
import { getCommunityMetaAction, saveCommunity, statusUpdated, createCommunityAction, setMemberList, resetCommunitiesAction, removeCommunityAction } from './actions';

export const initialState: DomainState = {

};

function communitiesReducer(state: DomainState = initialState, action: DomainActions){
  switch (action.type){
    case getType(saveCommunity):
      return {
        ...state,
        [action.payload.tbcAddress]: {
          ...state[action.payload.tbcAddress],
          ...action.payload
        }
      }
    case getType(getCommunityMetaAction.success):
      return{
        ...state,
        [action.payload.tbcAddress]: {
          ...state[action.payload.tbcAddress],
          ...action.payload
        }
      }
    case getType(statusUpdated):
      return {
        ...state,
        [action.payload.tbcAddress]: {
          ...state[action.payload.tbcAddress],
          ...action.payload,
        }
      }
    case getType(setMemberList):
      return {
        ...state,
        [action.payload.tbcAddress]: {
          ...state[action.payload.tbcAddress],
          ...action.payload,
        }
      }
    case getType(removeCommunityAction):
      delete state[action.payload];
      return {
        ...state
      }
    case getType(resetCommunitiesAction):
      return initialState
    default:
      return state;
  }
}

export default communitiesReducer;
