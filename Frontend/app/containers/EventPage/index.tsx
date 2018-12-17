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
import CommunityDescription from 'components/CommunityDescription';
import EventBanner from 'components/EventBanner';
import image from 'images/kiwi.jpg';
import user from 'images/kiwi.jpg';
import AttendeesCarousel from 'components/AttendeesCarousel';

const eventDetails = {
  name: 'Eth Cape Town',
  tokens: 12,
  tokenName: 'ECT',
  logo: image,
  id: '1',
  description: 'A world class Eth event in the most beautiful city',
  date: '14 February 2019',
  ticketsLeft: 16,
}

const attendees = [
  {
    picture: user,
    userName: 'Event Addict',
    id: '1',
  },
  {
    picture: user,
    userName: 'James Bond',
    id: '2',
  },
  {
    picture: user,
    userName: 'Vitalik the boi',
    id: '3',
  }
]

function EventPage() {
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
      />
      <CommunityDescription description={eventDetails.description} />
      // @ts-ignore
      <AttendeesCarousel attendees={attendees}/>
    </div>
  );
}
/**
  * (DONE) Event banner : 
  *   back button, logo, date, name, tokens in community 
  *   number of tickets left, button to RSVP 
  * (DONE) Description : description
  * Caracole of attendees 
  */

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
)(EventPage);
