/*
 * These are the variables that determine what our central data store (`../reducers/index.js`)
 * changes in our state.
 */

enum ActionTypes {
  SET_AUTH = 'app/Global/SET_AUTH',
  SENDING_REQUEST = 'app/Global/SENDING_REQUEST',
  LOGIN_REQUEST = 'app/Global/LOGIN_REQUEST',
  LOGIN_ERROR = 'app/Global/LOGIN_ERROR',
  SIGNUP_REQUEST = 'app/Global/SIGNUP_REQUEST',
  LOGOUT = 'app/Global/LOGOUT',
  SAVE_TOKEN = 'app/Global/SAVE_TOKEN',
  REQUEST_ERROR = 'app/Global/REQUEST_ERROR',
  CLEAR_ERROR = 'app/Global/CLEAR_ERROR'
}

export default ActionTypes
