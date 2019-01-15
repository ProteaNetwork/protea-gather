/**
 *
 * EventPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectEventPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import EventBanner from 'components/EventBanner';
import AttendeesCarousel from 'components/AttendeesCarousel';
import { withRouter } from 'react-router';

import Cathy from 'images/CathyGrey.jpg';
import Craig from 'images/CraigAndrews.jpg';
import Emma from 'images/EmmaOdendaal.jpg';
import Francois from 'images/FrancoisStrauss.jpg';
import Lebo from 'images/LeboSamuels.jpg';
import Olwethu from 'images/OlwethuHugo.jpg';
import Zukile from 'images/ZukileNcube.jpg';
// import image from 'images/ETHCTCom.jpg';
import zombiesEvent from 'images/CryptozombiesEvent.jpg';

const eventDetails = {
  name: 'Crypto Zombies',
  tokens: 128,
  tokenName: 'ECT',
  logo: zombiesEvent,
  id: '1',
  description: 'CryptoZombies is an interactive code school that teaches you to write smart contracts in Solidity through building your own crypto-collectables game on Ethereum. We believe in building skills and knowledge in South Africa through hands on coding, and through this workshop together we provide a foundation for others to further their blockchain development skills. These skills are in demand, with short supply, and could be used across a wide range of industries. All you need to bring is a laptop which can connect to the internet.No special software needs to be installed as the whole course can be run through a normal internet browser. We will have our experienced developers on hand to help guide you all along the way. It will be a fun and relaxed evening followed by drinks and food where you can network with others new and experienced in the blockchain space, forming new relationships and growing with each other in the ecosystem. Like all of our events, the event is absolutely free, and open access to all.',
  date: '14 February 2019',
  ticketsLeft: 16,
}

const attendees = [
  {
    picture: Francois,
    userName: 'Francois Strauss',
    id: '1',
  },
  {
    picture: Craig,
    userName: 'Craig Andrews',
    id: '2',
  },
  {
    picture: Emma,
    userName: 'Emma Odendaal',
    id: '3',
  },
  {
    picture: Cathy,
    userName: 'Cathy Grey',
    id: '4',
  },
  {
    picture: Olwethu,
    userName: 'Olwethu Hugo',
    id: '5',
  },
  {
    picture: Zukile,
    userName: 'Zukile Ncube',
    id: '6',
  },
  {
    picture: Lebo,
    userName: 'Lebo Samuels',
    id: '7',
  },
]

function EventPage({ history }) {
  return (
    <div>
      <EventBanner
        name={eventDetails.name}
        tokens={eventDetails.tokens}
        tokenName={eventDetails.tokenName}
        logo={eventDetails.logo}
        description={eventDetails.description}
        date={eventDetails.date}
        ticketsLeft={eventDetails.ticketsLeft}
        history={history} />
      {/*
      // @ts-ignore */}
      <AttendeesCarousel attendees={attendees}/>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  eventpage: makeSelectEventPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'eventpage', reducer });
const withSaga = injectSaga({ key: 'eventpage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withRouter,
)(EventPage);
