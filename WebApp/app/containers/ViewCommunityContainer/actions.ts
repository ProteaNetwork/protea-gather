/*
 *
 * ViewCommunityContainer actions
 *
 */

import { action, createStandardAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const setFilter = createStandardAction(ActionTypes.SET_FILTER)<string>();
