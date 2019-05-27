/*
 *
 * Communities constants
 *
 */

enum ActionTypes {
  GET_ALL_COMMUNITIES = 'protea/communities/GET_ALL_COMMUNITIES',
  GET_META_REQUEST = 'protea/communities/GET_META_REQUEST',
  GET_META_SUCCESS = 'protea/communities/GET_META_SUCCESS',
  GET_META_FAILURE = 'protea/communities/GET_META_FAILURE',
  SAVE_COMMUNITY = 'protea/communities/SAVE_COMMUNITY',
  CHECK_STATUS = 'protea/communities/CHECK_STATUS',
  STATUS_UPDATED = 'protea/communities/STATUS_UPDATED',
  CREATE_TX_REQUEST = 'protea/communities/CREATE_TX_REQUEST',
  CREATE_TX_SUCCESS = 'protea/communities/CREATE_TX_SUCCESS',
  CREATE_TX_FAILURE = 'protea/communities/CREATE_TX_FAILURE',
  GET_COMMUNITY_REQUEST = 'protea/communities/GET_COMMUNITY_REQUEST',
  GET_COMMUNITY_SUCCESS = 'protea/communities/GET_COMMUNITY_SUCCESS',
  GET_COMMUNITY_FAILURE = 'protea/communities/GET_COMMUNITY_FAILURE',

  JOIN_COMMUNITY_TX_REQUEST = 'protea/communities/JOIN_COMMUNITY_TX_REQUEST',
  JOIN_COMMUNITY_TX_SUCCESS = 'protea/communities/JOIN_COMMUNITY_TX_SUCCESS',
  JOIN_COMMUNITY_TX_FAILURE = 'protea/communities/JOIN_COMMUNITY_TX_FAILURE',

  SET_MEMBER_LIST = 'protea/communities/SET_MEMBER_LIST',
  UPDATE_COMMUNITY_REQUEST = 'protea/communities/UPDATE_COMMUNITY_REQUEST',
  UPDATE_COMMUNITY_SUCCESS = 'protea/communities/UPDATE_COMMUNITY_SUCCESS',
  UPDATE_COMMUNITY_FAILURE = 'protea/communities/UPDATE_COMMUNITY_FAILURE',

  RESET_COMMUNITIES = 'protea/communities/RESET_COMMUNITIES',
  REMOVE_COMMUNITY = 'protea/communities/REMOVE_COMMUNITY',
}

export default ActionTypes;
