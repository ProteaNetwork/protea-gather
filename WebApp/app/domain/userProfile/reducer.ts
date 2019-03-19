// import { ContainerState, ContainerActions } from './types';
import { getType } from 'typesafe-actions';
import * as userProfileActions from './actions';

export const initialState = {
  displayName: '',
  profileImage: '',
  daiBalance: 0,
};

function userProfileReducer(state = initialState, action) {
  switch (action.type) {
    case getType(userProfileActions.getUserProfile.success):
      return {...state,
              ...action.payload};
    default:
      return state;
  }
}

export default userProfileReducer;
