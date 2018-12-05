import { Reducer, Store } from 'redux';
import { RouterState } from 'react-router-redux';
import { ContainerState as DashboardPageState} from '../containers/DashboardPage/types'

export interface LifeStore extends Store<{}> {
  injectedReducers?: any;
  injectedSagas?: any;
  runSaga(saga: () => IterableIterator<any>, args: any): any;
}

export interface InjectReducerParams {
  key: keyof ApplicationRootState;
  reducer: Reducer<any, any>;
}

export interface InjectSagaParams {
  key: keyof ApplicationRootState;
  saga: () => IterableIterator<any>;
  mode?: string | undefined;
}

// Your root reducer type, which is your redux state types also
export interface ApplicationRootState {
  readonly route: RouterState;
  readonly dashboardpage: DashboardPageState;
}
