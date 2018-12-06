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

const communities = [{
    name: 'name',
    tokens: 69,
    logo: 'blank',
    id: '1',
    onClick: (id) => console.log(id)
  }, {
    name: 'another name',
    tokens: 69,
    logo: 'blank #2',
    id: '2',
    onClick: (id) => console.log(id)
  }, {
    name: '3 name',
    tokens: 3,
    logo: 'blank #3',
    id: '3',
    onClick: (id) => console.log(id)
  }, {
    name: '4 name',
    tokens: 4,
    logo: 'blank #4',
    id: '4',
    onClick: (id) => console.log(id)
}]

const events = [{
    eventName: '1 event name',
    eventID: '1',
    image: 'the image',
    comLogo: 'the other image',
    onClick: (eventID) => console.log(eventID)
  }, {
    eventName: '2 event name',
    eventID: '2',
    image: 'the image2 ',
    comLogo: 'the other other image2',
    onClick: (eventID) => console.log(eventID)
  }, {
  eventName: '3 event name',
  eventID: '3',
  image: 'the image3',
  comLogo: 'the other other image3',
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: '4 event name',
  eventID: '4',
  image: 'the image4',
  comLogo: 'the other other image4',
  onClick: (eventID) => console.log(eventID)
}]

function DashboardPage() {
  return (
    <div>
      <Dashboard image='' name='test' ensName='test ens' tokenBalance={1} communities={communities} events={events}/>
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
