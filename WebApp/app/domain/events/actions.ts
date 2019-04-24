/*
 *
 * Events actions
 *
 */

import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import { IEvent } from './types';

import ActionTypes from './constants';

export const saveEvent = createStandardAction(ActionTypes.SAVE_EVENT)<IEvent>();

export const checkStatus = createStandardAction(ActionTypes.CHECK_STATUS)<{eventId: string, membershipManagerAddress: string}>();

export const statusUpdated = createStandardAction(ActionTypes.STATUS_UPDATED)<{eventId:string, memberState: number, stakedTokens: number, totalTokensStaked: number}>();

export const getEventAction = createStandardAction(ActionTypes.GET_EVENT)<{eventId: string, membershipManagerAddress: string}>();

export const getEventMetaAction = createAsyncAction(
  ActionTypes.EVENT_META_REQUEST,
  ActionTypes.EVENT_META_SUCCESS,
  ActionTypes.EVENT_META_FAILURE
)<string, IEvent, string>();

export const createEventAction = createAsyncAction(
  ActionTypes.EVENT_CREATE_TX_REQUEST,
  ActionTypes.EVENT_CREATE_TX_SUCCESS,
  ActionTypes.EVENT_CREATE_TX_FAILURE,
)<IEvent, void, string>();

export const updateEventAction = createAsyncAction(
  ActionTypes.UPDATE_EVENT_REQUEST,
  ActionTypes.UPDATE_EVENT_SUCCESS,
  ActionTypes.UPDATE_EVENT_FAILURE,
)<IEvent, void, string>();

export const startEventAction = createAsyncAction(
  ActionTypes.START_EVENT_TX_REQUEST,
  ActionTypes.START_EVENT_TX_SUCCESS,
  ActionTypes.START_EVENT_TX_FAILURE,
)<{eventId: string, membershipManagerAddress: string}, void, string>();

export const endEventAction = createAsyncAction(
  ActionTypes.END_EVENT_TX_REQUEST,
  ActionTypes.END_EVENT_TX_SUCCESS,
  ActionTypes.END_EVENT_TX_FAILURE,
)<{eventId: string, membershipManagerAddress: string}, void, string>();

export const cancelEventAction = createAsyncAction(
  ActionTypes.CANCEL_EVENT_TX_REQUEST,
  ActionTypes.CANCEL_EVENT_TX_SUCCESS,
  ActionTypes.CANCEL_EVENT_TX_FAILURE,
)<{eventId: string, membershipManagerAddress: string}, void, string>();

export const changeEventLimitAction = createAsyncAction(
  ActionTypes.CHANGE_LIMIT_TX_REQUEST,
  ActionTypes.CHANGE_LIMIT_TX_SUCCESS,
  ActionTypes.CHANGE_LIMIT_TX_FAILURE,
)<{eventId: string, limit: number, membershipManagerAddress: string}, void, string>();

export const manualConfirmAttendeesAction = createAsyncAction(
  ActionTypes.MANUAL_CONFIRM_ATTEND_TX_REQUEST,
  ActionTypes.MANUAL_CONFIRM_ATTEND_TX_SUCCESS,
  ActionTypes.MANUAL_CONFIRM_ATTEND_TX_FAILURE,
)<{eventId: string, attendees: string[], membershipManagerAddress: string}, void, string>();

export const rsvpAction = createAsyncAction(
  ActionTypes.RSVP_TX_REQUEST,
  ActionTypes.RSVP_TX_SUCCESS,
  ActionTypes.RSVP_TX_FAILURE,
)<{eventId: string, membershipManagerAddress: string, tbcAddress: string}, void, string>();

export const cancelRsvpAction = createAsyncAction(
  ActionTypes.CANCEL_RSVP_TX_REQUEST,
  ActionTypes.CANCEL_RSVP_TX_SUCCESS,
  ActionTypes.CANCEL_RSVP_TX_FAILURE,
)<{eventId: string, membershipManagerAddress: string, tbcAddress: string}, void, string>();

export const confirmAttendanceAction = createAsyncAction(
  ActionTypes.CONFIRM_ATTENDANCE_TX_REQUEST,
  ActionTypes.CONFIRM_ATTENDANCE_TX_SUCCESS,
  ActionTypes.CONFIRM_ATTENDANCE_TX_FAILURE,
)<{eventId: string, membershipManagerAddress: string, tbcAddress: string}, void, string>();

export const claimGiftAction = createAsyncAction(
  ActionTypes.CLAIM_GIFT_TX_REQUEST,
  ActionTypes.CLAIM_GIFT_TX_SUCCESS,
  ActionTypes.CLAIM_GIFT_TX_FAILURE,
)<{eventId: string, membershipManagerAddress: string, state: number, tbcAddress: string}, void, string>();
