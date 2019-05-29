import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import ActionTypes from './constants';
import { IMember } from 'domain/membershipManagement/types';

export const getUserProfile = createAsyncAction(
  ActionTypes.GET_PROFILE_REQUEST,
  ActionTypes.GET_PROFILE_SUCCESS,
  ActionTypes.GET_PROFILE_FAILURE)
  <void, {}, string>();

export const setUserProfile = createAsyncAction(
  ActionTypes.SET_PROFILE_REQUEST,
  ActionTypes.SET_PROFILE_SUCCESS,
  ActionTypes.SET_PROFILE_FAILURE)
  <IMember, {}, string>();

export const sendFeedbackAction = createAsyncAction(
  ActionTypes.SEND_FEEDBACK_REQUEST,
  ActionTypes.SEND_FEEDBACK_SUCCESS,
  ActionTypes.SEND_FEEDBACK_FAILURE)
  <{address: string, feedback: string, browser: string}, {}, string>();

export const setPendingStateAction = createStandardAction(ActionTypes.SET_PENDING_RESPONSE)<string>();
