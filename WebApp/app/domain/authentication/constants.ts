/*
 *
 * Auth constants
 *
 */

enum ActionTypes {
  AUTH_REQUEST = 'protea/authentication/AUTH_REQUEST',
  AUTH_SUCCESS = 'protea/authentication/AUTH_SUCCESS',
  AUTH_FAILURE = 'protea/authentication/AUTH_FAILURE',
  SAVE_ACCESS_PERMIT = 'protea/authentication/SAVE_ACCESS_PERMIT',
  SAVE_ACCESS_TOKEN = 'protea/authentication/SAVE_ACCESS_TOKEN',
  CONNECT_WALLET_REQUEST = 'protea/authentication/CONNECT_WALLET_REQUEST',
  CONNECT_WALLET_SUCCESS = 'protea/authentication/CONNECT_WALLET_SUCCESS',
  CONNECT_WALLET_FAILURE = 'protea/authentication/CONNECT_WALLET_FAILURE',
  LOG_OUT = 'protea/authentication/LOG_OUT',
  SET_ETH_ADDRESS = 'protea/authentication/SET_ETH_ADDRESS',
  BROWSER_SIGNING_ERROR = 'protea/authentication/BROWSER_SIGNING_ERROR',
  SET_NETWORK_ID = 'protea/authentication/SET_NETWORK_ID',
}

export default ActionTypes;
