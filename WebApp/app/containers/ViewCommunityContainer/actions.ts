/*
 *
 * ViewCommunityContainer actions
 *
 */

import { action, createStandardAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const fetchCommunity = createStandardAction(ActionTypes.FETCH_COMMUNITY)<string>();
