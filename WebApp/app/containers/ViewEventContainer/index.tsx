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
import { Button } from '@material-ui/core';
import { startEventAction, endEventAction, cancelEventAction, cancelRsvpAction, rsvpAction, confirmAttendanceAction, claimGiftAction, changeEventLimitAction, manualConfirmAttendeesAction, getEventAction } from 'domain/events/actions';
import { refreshBalancesAction } from 'domain/transactionManagement/actions';
import { endEventTx } from 'domain/events/chainInteractions';
import ViewEvent from 'components/ViewEvent';


interface RouteParams {
  eventId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {
  community: ICommunity; // must be type string since route params
  event: IEvent;
  balances: any;
}

interface DispatchProps {
  refreshBalances():void;
  getCommunity(tbcAddress: string):void;
  getEvent(eventId: string, membershipManagerAddress: string):void;
  onStartEvent(eventId: string, membershipManagerAddress: string): void;
  onEndEvent(eventId: string, membershipManagerAddress: string): void;
  onCancelEvent(eventId: string, membershipManagerAddress: string): void;
  onRSVP(eventId: string, membershipManagerAddress: string): void;
  onCancelRSVP(eventId: string, membershipManagerAddress: string): void;
  onConfirmAttendance(eventId: string, membershipManagerAddress: string): void;
  onClaimGift(eventId: string, membershipManagerAddress: string, state: number): void;
  onChangeLimit(eventId: string, limit: number, membershipManagerAddress: string): void;
  onManualConfirmAttendees(eventId: string, attendees: string[], membershipManagerAddress: string): void;
  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
}

interface StateProps {}

type Props = StateProps & DispatchProps & OwnProps;

class ViewEventContainer extends React.Component<Props> {
  state = {
    slideIndex: 0,
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

  render() {
    const { community, event, balances, onIncreaseMembership, onJoinCommunity, onStartEvent, onCancelEvent, onEndEvent, onManualConfirmAttendees, onChangeLimit, onCancelRSVP, onClaimGift, onConfirmAttendance, onRSVP} = this.props;
    return <Fragment>

      <ViewEvent
          slideIndex={this.state.slideIndex}
          community={community}
          event={event}
          balances={balances}

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


        >

      </ViewEvent>
    </Fragment>;
  }
}

const mapStateToProps = selectViewEventContainer;

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
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
    onRSVP: (eventId: string, membershipManagerAddress: string) => {
      dispatch(rsvpAction.request({eventId, membershipManagerAddress: membershipManagerAddress}));
    },
    onCancelRSVP: (eventId: string, membershipManagerAddress: string) => {
      dispatch(cancelRsvpAction.request({eventId, membershipManagerAddress: membershipManagerAddress}));
    },
    onConfirmAttendance: (eventId: string, membershipManagerAddress: string) => {
      dispatch(confirmAttendanceAction.request({eventId, membershipManagerAddress: membershipManagerAddress}));
    },
    onClaimGift: (eventId: string, membershipManagerAddress: string, state: number) => {
      dispatch(claimGiftAction.request({eventId, membershipManagerAddress: membershipManagerAddress, state: state}));
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
        attendees: attendees
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
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ViewEventContainer);
