/**
 *
 * DashboardPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDashboardPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import Dashboard from 'components/Dashboard';

function DashboardPage() {
  return (
    <div>
      <Dashboard image='' name='test' ensName='test ens' tokenBalance={1} />
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  dashboardpage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'dashboardpage', reducer });
const withSaga = injectSaga({ key: 'dashboardpage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashboardPage);
