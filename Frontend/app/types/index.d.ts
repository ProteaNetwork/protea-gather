import { Reducer, Store } from 'redux';
import { ContainerState as GlobalState } from '../containers/App/types'
import { ContainerState as DashboardPageState } from '../containers/DashboardPage/types'
import { ContainerState as CommunitiesPageState } from '../containers/CommunitiesPage/types'
import { ContainerState as CommunityPageState } from '../containers/CommunityPage/types'
import { ContainerState as EventsPageState } from '../containers/EventsPage/types'
import { ContainerState as EventPageState } from '../containers/EventPage/types'

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
  readonly global: GlobalState;
  readonly dashboardpage: DashboardPageState;
  readonly communitiespage: CommunitiesPageState;
  readonly communitypage: CommunityPageState;
  readonly eventspage: CommunitiesPageState;
  readonly eventpage: CommunitiesPageState;
}
