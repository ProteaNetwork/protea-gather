/**
 *
 * DashboardContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import selectDashboardContainer from './selectors';
import Dashboard from 'components/Dashboard';
import { ICommunity } from 'domain/communities/types';
import { IEvent } from 'domain/events/types';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {
  myCommunities: ICommunity[],
  myUpcomingEvents: IEvent[],
  myPastEvents: IEvent[],
  myActiveEvents: IEvent[],
  myHostingEvents: IEvent[],
  discoverEvents: IEvent[]
}

type Props = StateProps & DispatchProps & OwnProps;

const DashboardContainer: React.SFC<Props> = (props: Props) => {
  const {myCommunities, myActiveEvents, myHostingEvents, myPastEvents, myUpcomingEvents, discoverEvents} = props;
  return <Dashboard
  // @ts-ignore
  myCommunities={myCommunities}
  // @ts-ignore
  myActiveEvents={myActiveEvents}
  // @ts-ignore
  myUpcomingEvents={myUpcomingEvents}
  // @ts-ignore
  myHostingEvents={myHostingEvents}
  // @ts-ignore
  myPastEvents={myPastEvents}
  // @ts-ignore
  discoverEvents={discoverEvents}></Dashboard>;
};

const mapStateToProps = selectDashboardContainer;

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatch: dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'dashboard',
  reducer: reducer,
});
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with saga hoc
const withSaga = injectSaga<OwnProps>({
  key: 'dashboard',
  saga: saga,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashboardContainer);
