/**
 *
 * DashboardContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import makeSelectDashboardContainer from './selectors';

interface OwnProps {}

interface DispatchProps {}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

const DashboardContainer: React.SFC<Props> = (props: Props) => {
  return <Fragment>Dashboard Container</Fragment>;
};

const mapStateToProps = createStructuredSelector({
  dashboardContainer: makeSelectDashboardContainer(),
});

function mapDispatchToProps(dispatch: Dispatch) {
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
