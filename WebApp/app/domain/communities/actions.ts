/*
 *
 * Communities actions
 *
 */

import { action, createStandardAction, createAsyncAction } from 'typesafe-actions';
import { ICommunity } from './types';

import ActionTypes from './constants';

export const getAllCommunitiesAction = createStandardAction(ActionTypes.GET_ALL_COMMUNITIES)<void>();

export const saveCommunity = createStandardAction(ActionTypes.SAVE_COMMUNITY)<ICommunity>();

export const setMemberList = createStandardAction(ActionTypes.SET_MEMBER_LIST)<{tbcAddress: string, memberList: string[]}>();

export const statusUpdated = createStandardAction(ActionTypes.STATUS_UPDATED)<{
  tbcAddress: string,
  transfersUnlocked: boolean,
  isMember: boolean,
  availableStake: number,
  memberSince: Date,
  liquidTokens: number,
  isAdmin: boolean}>();

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

export const getCommunityAction = createAsyncAction(
  ActionTypes.GET_COMMUNITY_REQUEST,
  ActionTypes.GET_COMMUNITY_SUCCESS,
  ActionTypes.GET_COMMUNITY_FAILURE
  )<string, void, string>();

export const joinCommunityAction = createAsyncAction(
  ActionTypes.JOIN_COMMUNITY_TX_REQUEST,
  ActionTypes.JOIN_COMMUNITY_TX_SUCCESS,
  ActionTypes.JOIN_COMMUNITY_TX_FAILURE,
)<{daiValue: number, tbcAddress: string, membershipManagerAddress: string}, void, string>();

