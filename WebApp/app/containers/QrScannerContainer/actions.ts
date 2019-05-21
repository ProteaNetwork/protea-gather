/*
 *
 * QrScannerContainer actions
 *
 */

import { action, createAsyncAction } from 'typesafe-actions';
import {} from './types';

import ActionTypes from './constants';

export const scanQrCodeAction = createAsyncAction(
  ActionTypes.SCAN_QR_REQUEST,
  ActionTypes.SCAN_QR_SUCCESS,
  ActionTypes.SCAN_QR_FAILURE)
  <void, string, string>();
