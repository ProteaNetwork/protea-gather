/*
 *
 * Events reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { DomainState, DomainActions } from './types';

export const initialState: DomainState = {
  default: null,
};

// function eventsReducer(state: ContainerState = initialState, action: ContainerActions ) {
//   switch (action.type) {
//     case ActionTypes.DEFAULT_ACTION:
//       return state;
//     default:
//       return state;
//   }
// }

// export default eventsReducer;

export default combineReducers<DomainState, DomainActions>({
  default: (state = initialState, action) => {
    switch (action.type) {
      case ActionTypes.DEFAULT_ACTION:
        return state;
      default:
        return state;
    }
  },
});
