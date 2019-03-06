import ActionTypes  from './constants';

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

function appReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_AUTH:
      return {...state, ...{loggedIn: action.payload} };
    case ActionTypes.SAVE_TOKEN:
      return {...state, ...{apiToken: action.payload}};
    case ActionTypes.REQUEST_ERROR:
      return {...state, ...{error: action.payload}};
    case ActionTypes.CLEAR_ERROR:
      return {...state, ...{error: ''}};
    case ActionTypes.SENDING_REQUEST:
      return {...state, ...{currentlySending: action.payload}};
    case ActionTypes.SAVE_USER:
      return {...state, ...{userId: action.payload}};
    default:
      return state;
  }
}

export default appReducer;
