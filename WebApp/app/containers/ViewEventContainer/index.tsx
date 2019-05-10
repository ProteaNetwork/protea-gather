/**
 *
 * ViewEventContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import selectViewEventContainer from './selectors';
import { ICommunity } from 'domain/communities/types';
import { IEvent } from 'domain/events/types';
import { RouteComponentProps } from 'react-router-dom';
import { joinCommunityAction, getCommunityAction } from 'domain/communities/actions';
import { increaseMembershipAction } from 'domain/membershipManagement/actions';
import { startEventAction, endEventAction, cancelEventAction, cancelRsvpAction, rsvpAction, confirmAttendanceAction, claimGiftAction, changeEventLimitAction, manualConfirmAttendeesAction, getEventAction } from 'domain/events/actions';
import { refreshBalancesAction, signQrAction } from 'domain/transactionManagement/actions';
import ViewEvent from 'components/ViewEvent';
import { IMember } from 'domain/membershipManagement/types';
import { setFilter } from './actions';
import reducer from './reducer';
import injectReducer from 'utils/injectReducer';

interface RouteParams {
  eventId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {
  community: ICommunity; // must be type string since route params
  event: IEvent;
  attendees: IMember[];
  balances: {ethBalance: number, daiBalance: number, ethAddress: string};
  filter: string;
}

interface DispatchProps {
  refreshBalances():void;
  setFilter(filter: string): void;
  getCommunity(tbcAddress: string):void;
  getEvent(eventId: string, membershipManagerAddress: string):void;
  onStartEvent(eventId: string, membershipManagerAddress: string): void;
  onEndEvent(eventId: string, membershipManagerAddress: string): void;
  onCancelEvent(eventId: string, membershipManagerAddress: string): void;
  onRSVP(eventId: string, membershipManagerAddress: string, tbcAddress: string): void;
  onCancelRSVP(eventId: string, membershipManagerAddress: string, tbcAddress: string): void;
  onConfirmAttendance(eventId: string, membershipManagerAddress: string, tbcAddress: string): void;
  onClaimGift(eventId: string, membershipManagerAddress: string, state: number, tbcAddress: string): void;
  onChangeLimit(eventId: string, limit: number, membershipManagerAddress: string): void;
  onManualConfirmAttendees(eventId: string, attendees: string[], membershipManagerAddress: string): void;
  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onGenerateQr(eventId: string): void;
}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

class ViewEventContainer extends React.Component<Props> {
  state: {slideIndex: number, confirmingList: string[]} = {
    slideIndex: 0,
    confirmingList: []
  };

  componentDidMount(){
    this.props.refreshBalances();
    this.props.getCommunity(this.props.community.tbcAddress);
    this.props.getEvent(this.props.match.params.eventId, this.props.community.membershipManagerAddress);
  }

  handleChange = (event, slideIndex) => {
    this.setState({ slideIndex });
  };

  handleChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  handleTogglePendingApproval = (address:string) =>{
    let newState = this.state.confirmingList.filter(address => this.props.event.confirmedAttendees.indexOf(address) < 0);
    if(this.state.confirmingList.indexOf(address) >= 0){
      newState = this.state.confirmingList.filter(pendingAddress => address != pendingAddress);
      this.setState({confirmingList: newState});
    }else{
      newState = this.state.confirmingList;
      newState.push(address);
      this.setState({confirmingList: newState})
    }
  }

  render() {
    const { onGenerateQr, attendees, setFilter, filter, community, event, balances, onIncreaseMembership, onJoinCommunity, onStartEvent, onCancelEvent, onEndEvent, onManualConfirmAttendees, onChangeLimit, onCancelRSVP, onClaimGift, onConfirmAttendance, onRSVP} = this.props;
    return <Fragment>

      <ViewEvent
          slideIndex={this.state.slideIndex}
          community={community}
          event={event}
          balances={balances}
          attendees={attendees}

          confirmingList={this.state.confirmingList}
          handleTogglePendingApproval={this.handleTogglePendingApproval}

          filter={filter}

          handleNameChange={setFilter}
          handleChange={this.handleChange}
          handleChangeIndex={this.handleChangeIndex}

          onJoinCommunity={onJoinCommunity}
          onIncreaseMembership={onIncreaseMembership}

          onChangeLimit={onChangeLimit}
          onStartEvent={onStartEvent}
          onEndEvent={onEndEvent}
          onCancelEvent={onCancelEvent}

          onCancelRSVP={onCancelRSVP}
          onRSVP={onRSVP}
          onConfirmAttendance={onConfirmAttendance}
          onClaimGift={onClaimGift}

          onManualConfirmAttendees={onManualConfirmAttendees}
          onGenerateQr={onGenerateQr}
        >

      </ViewEvent>
    </Fragment>;
  }
}

const mapStateToProps = selectViewEventContainer;

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setFilter: (filter: string) =>{
      dispatch(setFilter(filter))
    },
    refreshBalances: () =>  {
      dispatch(refreshBalancesAction())
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
    onRSVP: (eventId: string, membershipManagerAddress: string, tbcAddress: string) => {
      dispatch(rsvpAction.request({eventId, membershipManagerAddress: membershipManagerAddress, tbcAddress}));
    },
    onCancelRSVP: (eventId: string, membershipManagerAddress: string, tbcAddress: string) => {
      dispatch(cancelRsvpAction.request({eventId, membershipManagerAddress: membershipManagerAddress, tbcAddress}));
    },
    onConfirmAttendance: (eventId: string, membershipManagerAddress: string, tbcAddress: string) => {
      dispatch(confirmAttendanceAction.request({eventId, membershipManagerAddress: membershipManagerAddress, tbcAddress}));
    },
    onClaimGift: (eventId: string, membershipManagerAddress: string, state: number, tbcAddress: string) => {
      dispatch(claimGiftAction.request({eventId, membershipManagerAddress: membershipManagerAddress, state: state, tbcAddress}));
    },
    onChangeLimit: (eventId: string, limit: number, membershipManagerAddress: string) => {
      dispatch(changeEventLimitAction.request({
        eventId: eventId,
        limit: limit,
        membershipManagerAddress:membershipManagerAddress
      }));
    },
    onManualConfirmAttendees: (eventId: string, attendees: string[], membershipManagerAddress: string) => {
      dispatch(manualConfirmAttendeesAction.request({
        eventId: eventId,
        attendees: attendees,
        membershipManagerAddress: membershipManagerAddress
      }));
    },
    getEvent: (eventId: string, membershipManagerAddress: string) => {
      dispatch(getEventAction({eventId:eventId, membershipManagerAddress: membershipManagerAddress}))
    },
    getCommunity: (tbcAddress: string) => {
      dispatch(getCommunityAction.request(tbcAddress))
    },
    onJoinCommunity: (daiValue: number, tbcAddress: string, membershipManagerAddress: string) => {
      dispatch(joinCommunityAction.request({
        daiValue: daiValue,
        tbcAddress: tbcAddress,
        membershipManagerAddress: membershipManagerAddress
      }))
    },
    onIncreaseMembership: (daiValue: number, tbcAddress: string, membershipManagerAddress: string) =>{
      dispatch(increaseMembershipAction.request({
        daiValue: daiValue,
        tbcAddress: tbcAddress,
        membershipManagerAddress: membershipManagerAddress
      }))
    },
    onGenerateQr: (eventId: string) => {
      dispatch(signQrAction.request(eventId))
    }
  };
};

// Remember to add the key to ./app/types/index.d.ts ApplicationRootState
// <OwnProps> restricts access to the HOC's other props. This component must not do anything with reducer hoc
const withReducer = injectReducer<OwnProps>({
  key: 'viewEventPage',
  reducer: reducer,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withConnect
)(ViewEventContainer);
