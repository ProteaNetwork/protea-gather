/*
 *
 * TransactionManagement actions
 *
 */

import { createStandardAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const setPendingState = createStandardAction(ActionTypes.SET_PENDING_STATE)<Boolean>();
