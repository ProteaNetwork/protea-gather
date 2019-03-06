/*
 * These are the variables that determine what our central data store (`../reducers/index.js`)
 * changes in our state.
 */

enum ActionTypes {
  SET_AUTH = 'SET_AUTH',
  SENDING_REQUEST = 'SENDING_REQUEST',
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_ERROR = 'LOGIN_ERROR',
  SIGNUP_REQUEST = 'SIGNUP_REQUEST',
  LOGOUT = 'LOGOUT',
  SAVE_TOKEN = 'SAVE_TOKEN',
  REQUEST_ERROR = 'REQUEST_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  SAVE_USER = 'SAVE_USER',
}

export default ActionTypes
