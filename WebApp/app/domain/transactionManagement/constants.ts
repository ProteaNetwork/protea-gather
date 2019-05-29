/*
 *
 * TransactionManagement constants
 *
 */

enum ActionTypes {
  SET_TX_PENDING_STATE = 'protea/transactionManagement/SET_TX_PENDING_STATE',
  REFRESH_BALANCES = 'protea/transactionManagement/REFRESH_BALANCES',
  SET_BALANCES = 'protea/transactionManagement/SET_BALANCES',
  SET_TX_REMAINING_COUNT = 'protea/transactionManagement/SET_TX_REMAINING_COUNT',
  SET_TX_CONTEXT = 'protea/transactionManagement/SET_TX_CONTEXT',
  SET_COMMUNITY_MUTEX = 'protea/transactionManagement/SET_COMMUNITY_MUTEX',
  UPDATE_TOUCHED_CHAIN_DATA = 'protea/transactionManagement/UPDATE_TOUCHED_CHAIN_DATA',
  SIGN_QR_REQUEST = 'protea/transactionManagement/SIGN_QR_REQUEST',
  SIGN_QR_SUCCESS = 'protea/transactionManagement/SIGN_QR_SUCCESS',
  SIGN_QR_FAILURE = 'protea/transactionManagement/SIGN_QR_FAILURE',
  SET_QR = 'protea/transactionManagement/SET_QR',
  SEND_ERROR_REPORT_REQUEST = 'protea/transactionManagement/SEND_ERROR_REPORT_REQUEST',
  SEND_ERROR_REPORT_SUCCESS = 'protea/transactionManagement/SEND_ERROR_REPORT_SUCCESS',
  SEND_ERROR_REPORT_FAILURE = 'protea/transactionManagement/SEND_ERROR_REPORT_FAILURE',
  SET_ETH_ADDRESS = 'protea/transactionManagement/SET_ETH_ADDRESS',
}

export default ActionTypes;
