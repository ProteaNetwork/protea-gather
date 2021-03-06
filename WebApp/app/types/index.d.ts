import { Reducer, Store } from 'redux';
import { ContainerState as GlobalState } from '../containers/App/types';
import { DomainState as AuthenticationState } from '../domain/authentication/types';
import { DomainState as UserProfileState } from '../domain/userProfile/types';
import { DomainState as EventsState} from '../domain/events/types';
import { DomainState as CommunitiesState} from '../domain/communities/types';
import { DomainState as MembershipManagementState} from '../domain/membershipManagement/types';
import { DomainState as TransactionManagementState} from '../domain/transactionManagement/types';
import { ContainerState as DashboardState } from '../containers/DashboardContainer/types';
import { ContainerState as EventsPageContainerState } from '../containers/EventsPageContainer/types';
import { ContainerState as ViewEventPageContainerState } from '../containers/ViewEventContainer/types';
import { ContainerState as CommunitiesPageContainerState } from '../containers/CommunitiesPageContainer/types';
import { ContainerState as ViewCommunityPageContainerState } from '../containers/ViewCommunityContainer/types';
import { ContainerState as QrScannerContainerState } from '../containers/QrScannerContainer/types';

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
  // Domains
  readonly authentication: AuthenticationState;
  readonly userProfile: UserProfileState;
  readonly events: EventsState;
  readonly communities: CommunitiesState;
  readonly membershipManagement: MembershipManagementState;
  readonly transactionManagement: TransactionManagementState

  // Pages
  readonly dashboard: DashboardState;
  readonly eventPage: EventsPageContainerState;
  readonly viewEventPage: ViewEventPageContainerState;
  readonly communitiesPage: CommunitiesPageContainerState;
  readonly viewCommunityPage: ViewCommunityPageContainerState;

  // Utils
  readonly qrScannerContainer: QrScannerContainerState;
}
