/**
 *
 * EventsPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import EventGrid from 'components/EventGrid';
import EventSearchSortBar from 'components/EventSearchSortBar';
import { updateFilter } from './actions';

import footyCommunityImage from 'images/footyConnunity.jpg';
import footyEventImage from 'images/footyEvent.jpg';
import ethCTPubEvent from 'images/QuizEvent.jpg';
import xWingEvent from 'images/xWingEvent.jpg';
import xWingCommunity from 'images/xWingCom.jpg';
import zombiesEvent from 'images/CryptozombiesEvent.jpg';
import ethCTCommunity from 'images/ETHCTCom.jpg';

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

interface StateProps {
  searchParameter: string;
  sortParameter: number;
}

interface DispatchProps {
  updateFilter(data): void;
}

interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps;

function EventsPage(props: Props) {
  const { searchParameter, sortParameter, updateFilter } = props;

  return (
    <div>
      <EventSearchSortBar searchParameter={searchParameter} sortParameter={sortParameter} onChange={updateFilter} />
      {/*
      // @ts-ignore */}
      <EventGrid events={events} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  searchParameter: state.eventspage.searchParameter,
  sortParameter: state.eventspage.sortParameter,
});

export function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    updateFilter: (evt: { target: HTMLInputElement }) => dispatch(updateFilter({name: evt.target.name, value: evt.target.value})),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'eventspage', reducer });
const withSaga = injectSaga({ key: 'eventspage', saga });

export default compose<TReducer, TSaga, TConnect, ReturnType>(
  withReducer,
  withSaga,
  withConnect,
)(EventsPage);

type ReturnType = React.ComponentType /*<OwnProps>*/;
type TReducer = ReturnType;
type TSaga = ReturnType;
type TConnect = typeof EventsPage;
