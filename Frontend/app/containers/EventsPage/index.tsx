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

import image from 'images/kiwi.jpg';

// TODO: Remove this once hooked up to communities state tree
const events = [{
  eventName: 'Eth Cape Town',
  eventID: '1',
  image: image,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Artist workshop 3',
  eventID: '2',
  image: image,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Eth Berlin',
  eventID: '3',
  image: image,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
}, {
  eventName: 'Truck maintenance beginner',
  eventID: '4',
  image: image,
  comLogo: image,
  onClick: (eventID) => console.log(eventID)
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
      // @ts-ignore
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
