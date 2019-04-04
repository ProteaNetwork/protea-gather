/*
 *
 * Communities actions
 *
 */

import { action, createStandardAction, createAsyncAction } from 'typesafe-actions';
import { ICommunity } from './types';

import ActionTypes from './constants';

export const getAllCommunities = createStandardAction(ActionTypes.GET_ALL_COMMUNITIES)<void>();

export const saveCommunity = createStandardAction(ActionTypes.SAVE_COMMUNITY)<ICommunity>();

export const checkStatus = createStandardAction(ActionTypes.CHECK_STATUS)<{tbcAddress: string, membershipManagerAddress: string}>();

export const statusUpdated = createStandardAction(ActionTypes.STATUS_UPDATED)<{tbcAddress: string, isMember: boolean}>();

export const getCommunityMetaAction = createAsyncAction(
  ActionTypes.GET_META_REQUEST,
  ActionTypes.GET_META_SUCCESS,
  ActionTypes.GET_META_FAILURE)
  <string, ICommunity, string>();

export const createCommunityAction = createAsyncAction(
  ActionTypes.CREATE_TX_REQUEST,
  ActionTypes.CREATE_TX_SUCCESS,
  ActionTypes.CREATE_TX_FAILURE,
)<ICommunity, void, string>();
