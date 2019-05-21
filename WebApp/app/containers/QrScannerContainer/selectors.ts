import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';

/**
 * Direct selector to the qrScannerContainer state domain
 */

const selectQrScannerContainerDomain = (state: ApplicationRootState) => {
  return state ? state : initialState;
};

const selectQrState = (state: ApplicationRootState) => state.qrScannerContainer.active;

/**
 * Other specific selectors
 */

/**
 * Default selector used by QrScannerContainer
 */

export const makeSelectQrState = createSelector(selectQrState, substate => {
    return substate;
  });

