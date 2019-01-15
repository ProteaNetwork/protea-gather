/**
 *
 * DashboardPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import footyCommunityImage from 'images/footyConnunity.jpg';
import footyEventImage from 'images/footyEvent.jpg';
import ethCTPubEvent from 'images/QuizEvent.jpg';
import xWingEvent from 'images/xWingEvent.jpg';
import xWingCommunity from 'images/xWingCom.jpg';
import marketsCommunity from 'images/ethereum_global.jpg';
import zombiesEvent from 'images/CryptozombiesEvent.jpg';
import ethCTCommunity from 'images/ETHCTCom.jpg';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDashboardPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import Dashboard from 'components/Dashboard';

const communities = [{
  name: 'ETH Cape Town',
  tokens: 128,
  logo: ethCTCommunity,
  id: '1',
  onClick: (id) => console.log(id)
}, {
  name: 'X-Wing Cape Town',
  tokens: 6,
  logo: xWingCommunity,
  id: '2',
  onClick: (id) => console.log(id)
}, {
  name: 'Fiver Footy Cape Town',
  tokens: 3,
  logo: footyCommunityImage,
  id: '3',
  onClick: (id) => console.log(id)
}, {
  name: 'Curation Markets Global',
  tokens: 4,
  logo: marketsCommunity,
  id: '4',
  onClick: (id) => console.log(id)
}];

const events = [{
  eventName: 'Blockchain Pub Quiz',
  id: '1',
  image: ethCTPubEvent,
  comLogo: ethCTCommunity,
  comName: "ETH Cape Town",
  onClick: (id) => console.log(id)
}, {
  eventName: 'Cryptozombies Workshop',
  id: '2',
  image: zombiesEvent,
  comLogo: ethCTCommunity,
  comName: "ETH Cape Town",
  onClick: (id) => console.log(id)
}, {
  eventName: 'X-Wing Tournament',
  id: '3',
  image: xWingEvent,
  comLogo: xWingCommunity,
  comName: "X-Wing Cape Town",
  onClick: (id) => console.log(id)
}, {
  eventName: 'BlockBlasters vs GP Vipers',
  id: '4',
  image: footyEventImage,
  comLogo: footyCommunityImage,
  comName: "Fiver Footy Cape Town",
  onClick: (id) => console.log(id)
}];

function DashboardPage() {

  return (
    // @ts-ignore
    <Dashboard communities={communities} events={events} />
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
