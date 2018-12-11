/*
 *
 * DashboardPage reducer
 *
 */

// import { combineReducers } from 'redux';

// import ActionTypes from './constants';
import { ContainerState, ContainerActions } from './types';

export const initialState: ContainerState = {
  test: 'string',
};

function dashboardPageReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    default:
      return state;
  }
}

export default dashboardPageReducer;

// export default combineReducers<ContainerState, ContainerActions>({
//   default: (state = initialState, action: ContainerActions) => {
//     switch (action.type) {
//       case ActionTypes.DEFAULT_ACTION:
//         return state;
//       default:
//         return state;
//     }
//   },
// });
