import { createAsyncAction } from 'typesafe-actions';
import ActionTypes from './constants';

export const getUserProfile = createAsyncAction(
  ActionTypes.GET_PROFILE_REQUEST,
  ActionTypes.GET_PROFILE_SUCCESS,
  ActionTypes.GET_PROFILE_FAILURE)
  <void, {}, string>();
