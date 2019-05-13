import { createAsyncAction } from 'typesafe-actions';
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
