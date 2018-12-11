/*
 *
 * CommunitiesPage actions
 *
 */

import { action } from 'typesafe-actions';
import ActionTypes from './constants';

export const updateFilter = (filterParameter: {name: string, value: string | number}) =>
  action(ActionTypes.UPDATE_FILTER, filterParameter);
