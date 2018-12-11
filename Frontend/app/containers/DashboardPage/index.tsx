/**
 *
 * DashboardPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import image from 'images/kiwi.jpg';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDashboardPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import Dashboard from 'components/Dashboard';

// TODO: Remove this once hooked up to communities state tree
const communities = [{
  name: 'Eth Global',
  tokens: 128,
  logo: image,
  id: '1',
  onClick: (id) => console.log(id)
}, {
  name: 'The fisherman',
  tokens: 6,
  logo: image,
  id: '2',
  onClick: (id) => console.log(id)
}, {
  name: 'Fire truckers',
  tokens: 3,
  logo: image,
  id: '3',
  onClick: (id) => console.log(id)
}, {
  name: 'Artists',
  tokens: 4,
  logo: image,
  id: '4',
  onClick: (id) => console.log(id)
}, {
  name: 'Coders',
  tokens: 239,
  logo: image,
  id: '5',
  onClick: (id) => console.log(id)
}, {
  name: 'Charities Global',
  tokens: 503,
  logo: image,
  id: '6',
  onClick: (id) => console.log(id)
}, {
  name: 'Woodworkers',
  tokens: 3,
  logo: image,
  id: '7',
  onClick: (id) => console.log(id)
}, {
  name: 'Event creators',
  tokens: 40,
  logo: image,
  id: '8',
  onClick: (id) => console.log(id)
}];

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
}];

function DashboardPage() {

  return (
    // @ts-ignore
    <Dashboard image='' name='test' ensName='test ens' tokenBalance={1} communities={communities} events={events} />
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
