/**
 *
 * CommunityPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectCommunityPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import image from 'images/ETHCTBanner.jpg';
import ethCTPubEvent from 'images/QuizEvent.jpg';
import zombiesEvent from 'images/CryptozombiesEvent.jpg';
import ethCTCommunity from 'images/ETHCTCom.jpg';
import femalesInBC from 'images/FemalesInBC.jpg';
import beerNBC from 'images/BeersNBlockEvent.jpg';
import eth101 from 'images/ETH101.jpg';

import CommunityBanner from 'components/CommunityBanner';
import CarouselEvents from 'components/CarouselEvents';
import { withRouter } from 'react-router';

const communityDetails =  {
  name: 'ETH Cape Town',
  tokens: 12,
  logo: image,
  id: '1',
  description: 'A group for developers, entrepreneurs, and enthusiasts to learn about and develop for Ethereum and digital contracts in general. Ethereum is a next-generation crypto platform that allows you to create smart contracts and provide decentralized trust (auditing) for any kind of application that you can imagine.',
  tokenSymbol: 'ETHG',
  tokenValue: 1.334,
  tokenValueSymbol: 'DAI',
}

const eventsUpcoming = [{
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
  eventName: 'Blockchain Pub Quiz 2',
  id: '3',
  image: ethCTPubEvent,
  comLogo: ethCTCommunity,
  comName: "ETH Cape Town",
  onClick: (id) => console.log(id)
}, {
  eventName: 'Ethereum 101',
  displayCommunityName: false,
  eventID: '11',
  image: eth101,
  comLogo: ethCTCommunity,
  onClick: (eventID) => console.log(eventID)
}];

const eventsPrevious = [{
  eventName: 'Beers n Blockchain',
  displayCommunityName: false,
  eventID: '8',
  image: beerNBC,
  comLogo: ethCTCommunity,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Females in Blockchain',
  displayCommunityName: false,
  eventID: '10',
  image: femalesInBC,
  comLogo: ethCTCommunity,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Ethereum 101',
  displayCommunityName: false,
  eventID: '11',
  image: eth101,
  comLogo: ethCTCommunity,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Cryptozombies Workshop',
  id: '2',
  image: zombiesEvent,
  comLogo: ethCTCommunity,
  comName: "ETH Cape Town",
  onClick: (id) => console.log(id)
}];

function CommunityPage({history}) {
  return (
    <div>
      <CommunityBanner
        logo={image}
        name={communityDetails.name}
        tokenSymbol={communityDetails.tokenSymbol}
        tokenValueSymbol={communityDetails.tokenValueSymbol}
        value={communityDetails.tokenValue}
        description={communityDetails.description}
        history={history} />

      {/*
      // @ts-ignore */}
      <CarouselEvents events={eventsUpcoming} label={'Upcoming events'}/>

      {/*
      // @ts-ignore */}
      <CarouselEvents events={eventsPrevious} label={'Previous events'}/>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  communitypage: makeSelectCommunityPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'communitypage', reducer });
const withSaga = injectSaga({ key: 'communitypage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withRouter,
)(CommunityPage);
