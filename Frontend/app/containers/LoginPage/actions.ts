/*
 *
 * LoginPage actions
 *
 */

import { action } from 'typesafe-actions';
import { } from './types';

import ActionTypes from './constants';

export const toggleAuthState = () => action(ActionTypes.TOGGLE_AUTH);
