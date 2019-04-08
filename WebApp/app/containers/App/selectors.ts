import jwtDecode from 'jwt-decode';
import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { makeSelectTxPending, makeSelectTxRemaining, makeSelectTxContext } from 'domain/transactionManagement/selectors';


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
const selectEthAddress = (state: ApplicationRootState) => state.authentication.ethAddress ? state.authentication.ethAddress : "0x";

const selectProfileImage = (state: ApplicationRootState) => state.userProfile.profileImage;

const selectDisplayName = (state: ApplicationRootState) => state.userProfile.displayName;


/**
 * Default selector used by App
 */
const makeSelectIsLoggedIn = createSelector(selectIsLoggedIn, substate => {
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


// Root
const selectApp = createSelector(
  makeSelectEthAddress, makeSelectIsLoggedIn, makeSelectProfileImage, makeSelectDisplayName, makeSelectTxPending, makeSelectTxRemaining, makeSelectTxContext,
  (ethAddress, isLoggedIn, profileImage, displayName, txPending, txRemaining, txContext) => ({
    ethAddress: ethAddress,
    isLoggedIn: isLoggedIn,
    profileImage: profileImage,
    displayName: displayName,
    txPending: txPending,
    txRemaining: txRemaining,
    txContext: txContext
  }
))

export { makeSelectIsLoggedIn, makeSelectEthAddress };
export default selectApp;
