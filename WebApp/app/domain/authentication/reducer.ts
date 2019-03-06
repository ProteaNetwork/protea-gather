import * as PatentListActions from './actions';
// import { ContainerState, ContainerActions } from './types';
import { getType } from 'typesafe-actions';

export const initialState = {
};

function patentReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default patentReducer;
