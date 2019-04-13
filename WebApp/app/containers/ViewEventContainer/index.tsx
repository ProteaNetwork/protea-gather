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
  componentDidMount(){
    this.props.refreshBalances();
    this.props.getCommunity(this.props.community.tbcAddress);
    this.props.getEvent(this.props.match.params.eventId, this.props.community.membershipManagerAddress);
  }
  render() {
    const { community, event, balances, onIncreaseMembership, onJoinCommunity, onStartEvent, onCancelEvent, onEndEvent, onManualConfirmAttendees, onChangeLimit, onCancelRSVP, onClaimGift, onConfirmAttendance, onRSVP} = this.props;
    return <Fragment>
      <h2>
        Balances
      </h2>
      <div>
        Eth Balance: {`${balances.ethBalance}`},
        Dai Balance: {`${balances.daiBalance}`},
        Eth address: {`${balances.ethAddress}`}
      </div>
      <h2>
        Event details
      </h2>
      <div>
        {
          event && Object.keys(event).map(key => {
            return (<span key={key}>
              {
                `${key}: ${event[key]} ||  `
              }
            </span>)
          })
        }
      </div>
      <br/>
      {event && (event.organizer == balances.ethAddress )&& <Fragment>
        <h3>
          admin controls {`${balances.ethAddress }`}
        </h3>
        <Button disabled={event.state != 1} onClick={() => onStartEvent(event.eventId, event.membershipManagerAddress)}>
          Start Event
        </Button>
        <Button disabled={event.state != 2} onClick={() => onEndEvent(event.eventId, event.membershipManagerAddress)}>
          End Event
        </Button>
        <Button disabled={event.state != 1} onClick={() => onCancelEvent(event.eventId, event.membershipManagerAddress)}>
          Cancel Event
        </Button>
        <Button disabled={event.state != 1}  onClick={() => onChangeLimit(event.eventId, 2, event.membershipManagerAddress)}>
          Change Max limit to 2
        </Button>
        <Button disabled={event.state != 1} onClick={() => onChangeLimit(event.eventId, 0, event.membershipManagerAddress)}>
          Change Max limit to 0
        </Button>
        <Button disabled={event.state != 2} onClick={() => onManualConfirmAttendees(event.eventId, ['0xdBEA2496d63eB313Ef6bA353d158653b5beC9dfC'], event.membershipManagerAddress)}>
          Confirm Members attendance
        </Button>
        {
            (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
            <Fragment>
              <Button onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
                Claim Gift
              </Button>
            </Fragment>
          }
        <br/>
      </Fragment>
      }
      {
        event && community.isMember && event.organizer != balances.ethAddress  && <Fragment>
          <h3>
            Attendee controls
          </h3>
          {
            event.state == 1 &&
            <Fragment>
              <Button disabled={!(event.memberState == 0)} onClick={() => onRSVP(event.eventId, event.membershipManagerAddress)}>
                RSVP
              </Button>
              <Button disabled={!(event.memberState == 1)} onClick={() => onCancelRSVP(event.eventId, event.membershipManagerAddress)}>
                Cancel RSVP
              </Button>
            </Fragment>
          }
          {
            (event.state == 2 && event.memberState == 1) &&
            <Button disabled={event.state != 2 && event.memberState == 1} onClick={() => onConfirmAttendance(event.eventId, event.membershipManagerAddress)}>
              Confirm attendance
            </Button>
          }

          {
            (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
            <Fragment>
              <Button onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
                Claim Gift
              </Button>
            </Fragment>
          }
          {
            (event.state == 4 && event.memberState == 1) &&
            <Fragment>
              <Button onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
                Claim Deposit
              </Button>
            </Fragment>
          }
        </Fragment>
      }
      <h2>
        Community details
      </h2>
      <div>
        {
          community && Object.keys(community).map(key => {
            return (<span key={key}>
              {
                `${key}: ${community[key]} ||  `
              }
            </span>)
          })
        }
      </div>
      <br/>
      {community && <Fragment>
        <Button disabled={community.transfersUnlocked} onClick={() => onJoinCommunity(2, community.tbcAddress, community.membershipManagerAddress)}>
          Join for 2 Dai
        </Button>
        <Button onClick={() => onIncreaseMembership(2, community.tbcAddress, community.membershipManagerAddress)}>
          Increase by 2 Dai
        </Button>
      </Fragment>
      }
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
