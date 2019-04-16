/*
 *
 * EventPageContainer reducer
 *
 */

import { ContainerActions, ContainerState } from './types';
import { setFilter } from './actions';
import { getType } from 'typesafe-actions';

export const initialState: ContainerState = {
  filter: ""
};


function reducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    case getType(setFilter):
      return {
        ...state,
        filter: action.payload
      }
    default:
      return state;
  }
}


export default reducer;
