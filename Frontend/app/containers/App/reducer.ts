import { fromJS } from 'immutable';
import { SET_AUTH, SAVE_TOKEN, REQUEST_ERROR, CLEAR_ERROR, SENDING_REQUEST } from './constants';

/*
 *
 * App reducer
 *
 */

export const initialState = fromJS({
  loggedIn: false,
  error: '',
  currentlySending: false,
  apiToken: '',
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH:
      return state.setIn(['loggedIn'], action.newAuthState);
    case SAVE_TOKEN:
      return state.setIn(['apiToken'], action.token);
    case REQUEST_ERROR:
      return state.setIn(['error'], action.error);
    case CLEAR_ERROR:
      return state.setIn(['error'], '');
    case SENDING_REQUEST:
      return state.setIn(['currentlySending'], action.sending)
    default:
      return state;
  }
}

export default appReducer;
