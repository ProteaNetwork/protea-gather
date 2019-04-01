import jwtDecode from 'jwt-decode';
import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';


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
const selectEthAddress = (state: ApplicationRootState) => state.authentication.ethAddress;

const selectProfileImage = (state: ApplicationRootState) => state.userProfile.profileImage;

const selectDisplayName = (state: ApplicationRootState) => state.userProfile.displayName;

/**
 * Default selector used by App
 */
const makeSelectIsLoggedIn = () =>
  createSelector(selectIsLoggedIn, substate => {
    return substate;
  });

const makeSelectEthAddress = () => {
  createSelector(selectEthAddress, substate => {
    return substate;
  })
}

// Root

const selectApp = createSelector(selectEthAddress, selectIsLoggedIn, selectProfileImage, selectDisplayName,
  (ethAddress, isLoggedIn, profileImage, displayName) => ({
    ethAddress: ethAddress,
    isLoggedIn: isLoggedIn,
    profileImage: profileImage,
    displayName: displayName
  }
))

export { makeSelectIsLoggedIn, makeSelectEthAddress };
export default selectApp;
