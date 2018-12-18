import { action } from 'typesafe-actions';
import ActionTypes from './constants';


/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export const setAuthState = (newAuthState: boolean) =>
  action(ActionTypes.SET_AUTH, newAuthState);

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export const sendingRequest = (sending: boolean) =>
  action(ActionTypes.SENDING_REQUEST, sending);


/**
 * Tells the app we want to log in a user
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.username The username of the user to log in
 * @param  {string} data.password The password of the user to log in
 */
export const loginRequest = (data: {username: string, password: string}) =>
  action(ActionTypes.LOGIN_REQUEST, data)


/**
 * Tells the app we want to log out a user
 */
export const logout = () =>
  action(ActionTypes.LOGOUT);


/**
 * Tells the app we want to register a user
 * @param  {object} data            The data we're sending for registration
 * @param  {string} data.email      The email of the user to register
 * @param  {string} data.password   The password of the user to register
 * @param  {string} data.firstName  The first name of the user to register
 * @param  {string} data.lastName   The last name of the user to register
 */
export const signupRequest = (data: {
  email: string,
  password: string,
  firstName: string,
  lastName: string
}) =>
  action(ActionTypes.SIGNUP_REQUEST, data);


/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export const requestError = (error: string) =>
  action(ActionTypes.REQUEST_ERROR, error)


/**
 * Sets the `error` state as empty
 */
export const clearError = () =>
  action(ActionTypes.CLEAR_ERROR);


/**
 * Saves the user's token to the store
 */
export const saveToken = (token: string) =>
  action(ActionTypes.SAVE_TOKEN, token);

export const toggleAuth = () =>
  action(ActionTypes.TOGGLE_AUTH)
