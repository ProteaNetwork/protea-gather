/*
 *
 * User Profile constants
 *
 */

enum ActionTypes {
  GET_PROFILE_REQUEST = 'protea/userProfile/GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'protea/userProfile/GET_PROFILE_SUCCESS',
  GET_PROFILE_FAILURE = 'protea/userProfile/GET_PROFILE_FAILURE',
  SET_PROFILE_REQUEST = 'protea/userProfile/SET_PROFILE_REQUEST',
  SET_PROFILE_SUCCESS = 'protea/userProfile/SET_PROFILE_SUCCESS',
  SET_PROFILE_FAILURE = 'protea/userProfile/SET_PROFILE_FAILURE',
  SEND_FEEDBACK_REQUEST = 'protea/userProfile/SEND_FEEDBACK_REQUEST',
  SEND_FEEDBACK_SUCCESS = 'protea/userProfile/SEND_FEEDBACK_SUCCESS',
  SEND_FEEDBACK_FAILURE = 'protea/userProfile/SEND_FEEDBACK_FAILURE',
  SET_PENDING_RESPONSE = 'protea/userProfile/SET_PENDING_RESPONSE',
}

export default ActionTypes;
