/*
 *
 * TransactionManagement constants
 *
 */

enum ActionTypes {
  SET_PENDING_STATE = 'protea/transactionManagement/SET_PENDING_STATE',
  REFRESH_BALANCES = 'protea/transactionManagement/REFRESH_BALANCES',
  SET_BALANCES = 'protea/transactionManagement/SET_BALANCES',
  SET_TX_REMAINING_COUNT = 'protea/transactionManagement/SET_TX_REMAINING_COUNT',
  SET_TX_CONTEXT = 'protea/transactionManagement/SET_TX_CONTEXT',
  SET_COMMUNITY_MUTEX = 'protea/transactionManagement/SET_COMMUNITY_MUTEX',
  UPDATE_TOUCHED_CHAIN_DATA = 'protea/transactionManagement/UPDATE_TOUCHED_CHAIN_DATA',
}

export default ActionTypes;
