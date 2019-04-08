/*
 *
 * Events constants
 *
 */

enum ActionTypes {
  EVENT_META_REQUEST = 'protea/events/EVENT_META_REQUEST',
  EVENT_META_SUCCESS = 'protea/events/EVENT_META_SUCCESS',
  EVENT_META_FAILURE = 'protea/events/EVENT_META_FAILURE',
  SAVE_EVENT = 'protea/events/SAVE_EVENT',
  CHECK_STATUS = 'protea/events/CHECK_STATUS',
  STATUS_UPDATED = 'protea/events/STATUS_UPDATED',

  EVENT_CREATE_TX_REQUEST = 'protea/events/EVENT_CREATE_TX_REQUEST',
  EVENT_CREATE_TX_SUCCESS = 'protea/events/EVENT_CREATE_TX_SUCCESS',
  EVENT_CREATE_TX_FAILURE = 'protea/events/EVENT_CREATE_TX_FAILURE',
}

export default ActionTypes;
