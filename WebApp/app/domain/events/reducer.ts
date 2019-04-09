/*
 *
 * Events reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { DomainState, DomainActions } from './types';
import { saveEvent, getEventMetaAction, statusUpdated } from './actions';
import { getType } from 'typesafe-actions';

export const initialState: DomainState = {
};

function eventsReducer(state: DomainState = initialState, action: DomainActions ) {
  switch (action.type) {
    case getType(saveEvent):
      return{
        ...state,
        [action.payload.eventId]: {
          ...state[action.payload.eventId],
          ...action.payload
        }
      }
    case getType(getEventMetaAction.success):
      return {
        ...state,
        [action.payload.eventId]: {
          ...state[action.payload.eventId],
          ...action.payload
        }
      }
    case getType(statusUpdated):
      return {
        ...state,
        [action.payload.eventId]: {
          ...state[action.payload.eventId],
          ...action.payload,
        }
      }
    default:
      return state;
  }
}

export default eventsReducer;

