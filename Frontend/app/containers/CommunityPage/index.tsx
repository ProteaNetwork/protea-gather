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
import image from 'images/ethereum_global.jpg';
import eventIcon from 'images/communityPlaceHolder.jpg';
import CommunityBanner from 'components/CommunityBanner';
import CarouselEvents from 'components/CarouselEvents';
import { withRouter } from 'react-router';

const communityDetails =  {
  name: 'Eth Global',
  tokens: 128,
  logo: image,
  id: '1',
  description: 'The Ethereum global community is dedicated to furthering the interests of the Ethereum group. We strive for block chain dominance in all world affairs...',
  tokenSymbol: 'ETHG',
  tokenValue: 1.334,
  tokenValueSymbol: 'DAI',
}

const eventsUpcoming = [{
  eventName: 'Eth Cape Town',
  displayCommunityName: false,
  eventID: '1',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Berlin',
  displayCommunityName: false,
  eventID: '2',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Singapore',
  displayCommunityName: false,
  eventID: '3',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth London',
  displayCommunityName: false,
  eventID: '4',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Brussels',
  displayCommunityName: false,
  eventID: '5',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Tokyo',
  displayCommunityName: false,
  eventID: '6',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth New York',
  displayCommunityName: false,
  eventID: '7',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}];

const eventsPrevious = [{
  eventName: 'Eth Johannesburg',
  displayCommunityName: false,
  eventID: '8',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Vienna',
  displayCommunityName: false,
  eventID: '9',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Beijing',
  displayCommunityName: false,
  eventID: '10',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Rio',
  displayCommunityName: false,
  eventID: '11',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Cairo',
  displayCommunityName: false,
  eventID: '12',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Sidney',
  displayCommunityName: false,
  eventID: '13',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Los Angeles',
  displayCommunityName: false,
  eventID: '14',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
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
