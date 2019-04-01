// import { ContainerState, ContainerActions } from './types';
import { getType } from 'typesafe-actions';
import * as authenticationActions from './actions';
import { DomainActions, DomainState } from './types';

export const initialState: DomainState = {
  walletUnlocked: false,
  ethAddress: '',
  signedPermit: '',
  accessToken: '',
  errorMessage: '',
};

function authenticationReducer(state: DomainState = initialState, action: DomainActions) {
  switch (action.type) {
    case getType(authenticationActions.saveAccessPermit):
      return { ...state, ...{ signedPermit: action.payload } };
    case getType(authenticationActions.saveAccessToken):
      return {
        ...state,
        ...{ accessToken: action.payload.accessToken },
      };
    case getType(authenticationActions.connectWallet.success):
      return {
        ...state,
        ...{ errorMessage: '' },
        ...{ walletUnlocked: true },
      };
    case getType(authenticationActions.connectWallet.failure):
      return {
        ...state,
        ...{ errorMessage: action.payload },
        ...{ walletUnlocked: false },
      };
    case getType(authenticationActions.logOut):
      return {
        ...initialState,
        ...{ walletUnlocked: state.walletUnlocked },
      };
    case getType(authenticationActions.authenticate.failure):
      return {
        ...state,
        ...{ errorMessage: action.payload },
      };
    case getType(authenticationActions.setEthAddress):
      return {
        ...state,
        ...{ethAddress: action.payload.ethAddress }
      }
    default:
      return state;
  }
}

export default authenticationReducer;
