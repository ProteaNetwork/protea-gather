/*
 *
 * MembershipManagement constants
 *
 */

enum ActionTypes {
  CHECK_STATUS = 'protea/membershipManagement/CHECK_STATUS',
  STATUS_UPDATED = 'protea/membershipManagement/STATUS_UPDATED',

  INCREASE_MEMBERSHIP_TX_REQUEST = 'protea/membershipManagement/INCREASE_MEMBERSHIP_TX_REQUEST',
  INCREASE_MEMBERSHIP_TX_SUCCESS = 'protea/membershipManagement/INCREASE_MEMBERSHIP_TX_SUCCESS',
  INCREASE_MEMBERSHIP_TX_FAILURE = 'protea/membershipManagement/INCREASE_MEMBERSHIP_TX_FAILURE',

  WITHDRAW_MEMBERSHIP_TX_REQUEST = 'protea/membershipManagement/WITHDRAW_MEMBERSHIP_TX_REQUEST',
  WITHDRAW_MEMBERSHIP_TX_SUCCESS = 'protea/membershipManagement/WITHDRAW_MEMBERSHIP_TX_SUCCESS',
  WITHDRAW_MEMBERSHIP_TX_FAILURE = 'protea/membershipManagement/WITHDRAW_MEMBERSHIP_TX_FAILURE',

  GET_MEMBERS = 'protea/membershipManagement/GET_MEMBERS',
}

export default ActionTypes;
