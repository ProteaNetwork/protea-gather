/*
 *
 * Events actions
 *
 */

import { action, createStandardAction, createAsyncAction } from 'typesafe-actions';
import { IEvent } from './types';

import ActionTypes from './constants';

export const saveEvent = createStandardAction(ActionTypes.SAVE_EVENT)<IEvent>();

export const checkStatus = createStandardAction(ActionTypes.CHECK_STATUS)<string>();

export const statusUpdated = createStandardAction(ActionTypes.STATUS_UPDATED)<{eventId:string, memberState: Number}>();

export const getEventMetaAction = createAsyncAction(
  ActionTypes.EVENT_META_REQUEST,
  ActionTypes.EVENT_META_SUCCESS,
  ActionTypes.EVENT_META_FAILURE
)<string, IEvent, string>();
