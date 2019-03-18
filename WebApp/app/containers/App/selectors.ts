import jwtDecode from 'jwt-decode';
import { createSelector } from 'reselect';
import { ApplicationRootState } from 'types';
import { initialState } from './reducer';


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

/**
 * Default selector used by App
 */

const makeSelectIsLoggedIn = () =>
  createSelector(selectIsLoggedIn, substate => {
    return substate;
  });

// export default selectApp;
export { makeSelectIsLoggedIn };
