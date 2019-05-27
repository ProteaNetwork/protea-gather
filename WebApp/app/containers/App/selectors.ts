import jwtDecode from 'jwt-decode';
import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { makeSelectTxPending, makeSelectTxRemaining, makeSelectTxContext } from 'domain/transactionManagement/selectors';
import { blockchainResources } from 'blockchainResources';


/**
 * Direct selector to the user state domain
 */
const selectIsLoggedIn = (state: ApplicationRootState) => {
  const accessToken = state.authentication.accessToken;
  try {
    const decodedToken = jwtDecode(accessToken);
    const isLoggedIn = (Date.now() / 1000 < decodedToken.exp);
    return isLoggedIn;
  } catch (error) {
    return false;
  }
};

/**
 * Other specific selectors
 */
const selectEthAddress = (state: ApplicationRootState) => state.transactionManagement.ethAddress ? state.transactionManagement.ethAddress : "0x";

const selectQrData = (state: ApplicationRootState) => state.transactionManagement.qrData ? state.transactionManagement.qrData : "";

const selectDaiBalance = (state: ApplicationRootState) => state.transactionManagement.daiBalance ? state.transactionManagement.daiBalance : 0;

const selectProfileImage = (state: ApplicationRootState) => state.userProfile.profileImage;

const selectDisplayName = (state: ApplicationRootState) => state.userProfile.displayName;

const selectNetworkState = () => blockchainResources.approvedNetwork;

const selectNetworkId = () => blockchainResources.networkId;

/**
 * Default selector used by App
 */
const makeSelectIsLoggedIn = createSelector(selectIsLoggedIn, substate => {
  return substate;
});

const makeQrData = createSelector(selectQrData, substate => {
  return substate;
});

export const makeDaiBalance = createSelector(selectDaiBalance, substate => {
  return substate;
});

const makeSelectProfileImage = createSelector(selectProfileImage, substate => {
  return substate;
});

const makeSelectDisplayName = createSelector(selectDisplayName, substate => {
  return substate;
});

const makeSelectEthAddress = createSelector(selectEthAddress, substate => {
  return substate;
})

const makeSelectNetworkState = createSelector(selectNetworkState, substate => {
  return substate;
})


const makeSelectNetworkId = createSelector(selectNetworkId, substate => {
  return substate;
})

// Root
const selectApp = createSelector(
  makeSelectEthAddress, makeSelectIsLoggedIn, makeSelectProfileImage, makeSelectDisplayName, makeSelectTxPending, makeSelectTxRemaining, makeSelectTxContext, makeSelectNetworkState, makeSelectNetworkId, makeQrData, makeDaiBalance,
  (ethAddress, isLoggedIn, profileImage, displayName, txPending, txRemaining, txContext, networkReady, networkId, qrData, daiBalance) => ({
    ethAddress: ethAddress,
    isLoggedIn: isLoggedIn,
    profileImage: profileImage,
    displayName: displayName,
    txPending: txPending,
    txRemaining: txRemaining,
    txContext: txContext,
    networkReady: networkReady,
    networkId: networkId,
    qrData: qrData,
    daiBalance: daiBalance
  }
))

export { makeSelectIsLoggedIn, makeSelectEthAddress };
export default selectApp;
