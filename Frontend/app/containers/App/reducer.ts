import ActionTypes  from './constants';
import { ContainerState, ContainerActions } from './types';
//import { combineReducers } from 'redux';

/*
 *
 * App reducer
 *
 */

export const initialState = {
  loggedIn: false,
  error: '',
  currentlySending: false,
  apiToken: '',
};

export function appReducer(
  state: ContainerState = initialState,
  action: ContainerActions,
): ContainerState {
  switch (action.type) {
    // case ActionTypes.SET_AUTH:
    //   return {...state, ...{loggedIn: action.payload} };
    // case ActionTypes.SAVE_TOKEN:
    //   return {...state, ...{apiToken: action.payload}};
    // case ActionTypes.REQUEST_ERROR:
    //   return {...state, ...{error: action.payload}};
    // case ActionTypes.CLEAR_ERROR:
    //   return {...state, ...{error: ''}};
    // case ActionTypes.SENDING_REQUEST:
    //   return {...state, ...{currentlySending: action.payload}}
    case ActionTypes.TOGGLE_AUTH:
      return {...state, ...{loggedIn: !state.loggedIn}}
    default:
      return state;
  }
}

export default appReducer;

// export default combineReducers<ContainerState, ContainerActions>({
//   global: appReducer,
// });


