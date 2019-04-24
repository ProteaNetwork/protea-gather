/**
 *
 * EventsPageContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import selectEventPage from './selectors';
import EventsView from 'components/EventsView';
import { IEvent } from 'domain/events/types';
import { getAllCommunitiesAction } from 'domain/communities/actions';
import { startEventAction, endEventAction, cancelEventAction, rsvpAction, cancelRsvpAction, confirmAttendanceAction, claimGiftAction, getEventAction } from 'domain/events/actions';
import { refreshBalancesAction } from 'domain/transactionManagement/actions';
import { setFilter } from './actions';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';

interface OwnProps {
  discoverEvents: IEvent[]; // must be type string since route params
  ethAddress: string;
  filter: string;
  myUpcomingEvents: IEvent[];
  myPendingClaimEvents: IEvent[];
  myPendingConfirmEvents: IEvent[];
  myHostingPendingEvents: IEvent[];
  myHostingActiveEvents: IEvent[];
  balances: any;
}

interface DispatchProps {
  onLoadCommunities(): void;
  refreshBalances():void;
  setFilter(filter: string): void;
  getEvent(eventId: string, membershipManagerAddress: string):void;
  onStartEvent(eventId: string, membershipManagerAddress: string): void;
  onEndEvent(eventId: string, membershipManagerAddress: string): void;
  onCancelEvent(eventId: string, membershipManagerAddress: string): void;
  onConfirmAttendance(eventId: string, membershipManagerAddress: string): void;
  onClaimGift(eventId: string, membershipManagerAddress: string, state: number): void;
}

type Props = DispatchProps & OwnProps;

class EventsPageContainer extends React.Component<Props>  {
  state = {
    slideIndex: 0,
  };

  handleSlideChange = (event, slideIndex) => {
    this.setState({ slideIndex });
  };

  handleSlideChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  componentDidMount(){
    this.props.onLoadCommunities();
  }

  render(){
    const { myHostingPendingEvents, myHostingActiveEvents, onCancelEvent, onClaimGift, onConfirmAttendance, onEndEvent, onStartEvent, discoverEvents, myPendingConfirmEvents, myPendingClaimEvents, myUpcomingEvents, ethAddress, setFilter, filter } = this.props;
    return (<Fragment>
      <EventsView
        myHostingPendingEvents={myHostingPendingEvents}
        myHostingActiveEvents={myHostingActiveEvents}
        onStartEvent={onStartEvent}
        onEndEvent={onEndEvent}
        onConfirmAttendance={onConfirmAttendance}
        onClaimGift={onClaimGift}
        onCancelEvent={onCancelEvent}
        handleSlideChange={this.handleSlideChange}
        handleSlideChangeIndex={this.handleSlideChangeIndex}
        handleNameChange={setFilter}
        slideIndex={this.state.slideIndex}
        filter={filter}
        ethAddress={ethAddress}
        myPendingConfirmEvents={myPendingConfirmEvents}
        myPendingClaimEvents={myPendingClaimEvents}
        myUpcomingEvents={myUpcomingEvents}
        discoverEvents={discoverEvents}
      ></EventsView>
    </Fragment>
    );
  }
};

const mapStateToProps = selectEventPage;

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setFilter: (filter: string) =>{
      dispatch(setFilter(filter))
    },
    refreshBalances: () =>  {
      dispatch(refreshBalancesAction())
    },
    getEvent: (eventId: string, membershipManagerAddress: string) => {
      dispatch(getEventAction({eventId:eventId, membershipManagerAddress: membershipManagerAddress}))
    },
    onLoadCommunities: () => {
      dispatch(getAllCommunitiesAction())
    },
    onStartEvent: (eventId: string, membershipManagerAddress: string) => {
      dispatch(startEventAction.request({eventId, membershipManagerAddress: membershipManagerAddress}));
    },
    onEndEvent: (eventId: string, membershipManagerAddress: string) => {
      dispatch(endEventAction.request({eventId, membershipManagerAddress: membershipManagerAddress}));
    },
    onCancelEvent: (eventId: string, membershipManagerAddress: string) => {
      dispatch(cancelEventAction.request({eventId, membershipManagerAddress: membershipManagerAddress}));
    },
    onConfirmAttendance: (eventId: string, membershipManagerAddress: string, tbcAddress: string) => {
      dispatch(confirmAttendanceAction.request({eventId, membershipManagerAddress: membershipManagerAddress, tbcAddress: tbcAddress}));
    },
    onClaimGift: (eventId: string, membershipManagerAddress: string, state: number, tbcAddress: string) => {
      dispatch(claimGiftAction.request({eventId, membershipManagerAddress: membershipManagerAddress, state: state, tbcAddress: tbcAddress}));
    },
  };
}


// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'eventPage',
  reducer: reducer,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withConnect
)(EventsPageContainer);
