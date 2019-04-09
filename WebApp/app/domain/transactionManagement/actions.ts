/*
 *
 * TransactionManagement actions
 *
 */

import { createStandardAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const setPendingState = createStandardAction(ActionTypes.SET_PENDING_STATE)<Boolean>();

export const refreshBalancesAction = createStandardAction(ActionTypes.REFRESH_BALANCES)<void>()

export const setBalancesAction = createStandardAction(ActionTypes.SET_BALANCES)<{daiBalance: number, ethBalance: number, ethAddress: string}>();

export const setRemainingTxCountAction = createStandardAction(ActionTypes.SET_TX_REMAINING_COUNT)<number>();

export const setTxContextAction = createStandardAction(ActionTypes.SET_TX_CONTEXT)<string>();
