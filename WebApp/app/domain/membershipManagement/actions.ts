/*
 *
 * MembershipManagement actions
 *
 */

import { action, createStandardAction, createAsyncAction } from 'typesafe-actions';

import ActionTypes from './constants';

export const checkStatus = createStandardAction(ActionTypes.CHECK_STATUS)<{tbcAddress: string, membershipManagerAddress: string}>();

export const increaseMembershipAction = createAsyncAction(
  ActionTypes.INCREASE_MEMBERSHIP_TX_REQUEST,
  ActionTypes.INCREASE_MEMBERSHIP_TX_SUCCESS,
  ActionTypes.INCREASE_MEMBERSHIP_TX_FAILURE,
)<{daiValue: number, tbcAddress: string, membershipManagerAddress: string}, void, string>();

export const withdrawMembershipAction = createAsyncAction(
  ActionTypes.WITHDRAW_MEMBERSHIP_TX_REQUEST,
  ActionTypes.WITHDRAW_MEMBERSHIP_TX_SUCCESS,
  ActionTypes.WITHDRAW_MEMBERSHIP_TX_FAILURE,
)<{daiValue: number, tbcAddress: string, membershipManagerAddress: string}, void, string>();

