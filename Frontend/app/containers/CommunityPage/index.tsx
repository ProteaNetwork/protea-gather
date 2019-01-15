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

const communityDetails =  {
  name: 'Eth Global',
  tokens: 128,
  logo: image,
  id: '1',
  description: 'The Etheruem global community is dedicated to furthering the interests of the Ethereum group. We strive for block chain dominance in all world affairs...',
  tokenSymbol: 'ETHG',
  tokenValue: 1.334,
  tokenValueSymbol: 'DAI',
}

const events = [{
  eventName: 'Eth Cape Town',
  eventID: '1',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Berlin',
  eventID: '2',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Singapore',
  eventID: '3',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Cape Town',
  eventID: '1',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Berlin',
  eventID: '2',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Singapore',
  eventID: '3',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Paris',
  eventID: '4',
  image: eventIcon,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}];

function CommunityPage() {
  return (
    <div>
      <CommunityBanner 
        logo={image} 
        name={communityDetails.name} 
        tokenSymbol={communityDetails.tokenSymbol}
        tokenValueSymbol={communityDetails.tokenValueSymbol}
        value={communityDetails.tokenValue}
        description={communityDetails.description}
        
        />
      {/*
      // @ts-ignore */}
      <CarouselEvents events={events} label={'Upcoming events'}/>
      {/*
      // @ts-ignore */}
      <CarouselEvents events={events} label={'Previous events'}/>
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
)(CommunityPage);
