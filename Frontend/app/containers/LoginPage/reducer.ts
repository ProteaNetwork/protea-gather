/*
 *
 * LoginPage reducer
 *
 */

// import ActionTypes from './constants';
import { ContainerState, ContainerActions } from './types';

export const initialState: ContainerState = {
  default: null,
};

function loginPageReducer(state: ContainerState = initialState, action: ContainerActions ) {
  switch (action.type) {
    default:
      return state;
  }
}

export default loginPageReducer;

