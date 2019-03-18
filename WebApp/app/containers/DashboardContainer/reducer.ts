/*
 *
 * DashboardContainer reducer
 *
 */

import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { ContainerActions, ContainerState } from './types';

export const initialState: ContainerState = {
  default: null,
};

// function dashboardContainerReducer(state: ContainerState = initialState, action: ContainerActions ) {
//   switch (action.type) {
//     case ActionTypes.DEFAULT_ACTION:
//       return state;
//     default:
//       return state;
//   }
// }

// export default dashboardContainerReducer;

export default combineReducers<ContainerState, ContainerActions>({
  default: (state = initialState, action) => {
    switch (action.type) {
      case ActionTypes.DEFAULT_ACTION:
        return state;
      default:
        return state;
    }
  },
});
