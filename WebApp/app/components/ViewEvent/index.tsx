/**
 *
 * ViewEvent
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import { IEvent } from 'domain/events/types';
import { ICommunity } from 'domain/communities/types';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
  });

interface OwnProps extends WithStyles<typeof styles> {
  event: IEvent;
  community: ICommunity;
  balances: any;
  onChangeLimit(eventId: string, limit: number, membershipManagerAddress: string): void;
  onStartEvent(eventId: string, membershipManagerAddress: string): void;
  onEndEvent(eventId: string, membershipManagerAddress: string): void;
  onCancelEvent(eventId: string, membershipManagerAddress: string): void;
  onManualConfirmAttendees(eventId: string, attendees: string[], membershipManagerAddress: string): void;

  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onRSVP(eventId: string, membershipManagerAddress: string): void;
  onCancelRSVP(eventId: string, membershipManagerAddress: string): void;
  onConfirmAttendance(eventId: string, membershipManagerAddress: string): void;
  onClaimGift(eventId: string, membershipManagerAddress: string, state: number): void;
}

const ViewEvent: React.SFC<OwnProps> = (props: OwnProps) => {
    const { community, event, balances, onIncreaseMembership, onJoinCommunity, onStartEvent, onCancelEvent, onEndEvent, onManualConfirmAttendees, onChangeLimit, onCancelRSVP, onClaimGift, onConfirmAttendance, onRSVP} = props;
    return <Fragment></Fragment>
    // return <Fragment>
    // {
    //   <h2>
    //     Balances
    //   </h2>
    //   <div>
    //     Eth Balance: {`${balances.ethBalance}`},
    //     Dai Balance: {`${balances.daiBalance}`},
    //     Eth address: {`${balances.ethAddress}`}
    //   </div>
    //   <h2>
    //     Event details
    //   </h2>
    //   <div>
    //     {
    //       event && Object.keys(event).map(key => {
    //         return (<span key={key}>
    //           {
    //             `${key}: ${event[key]} ||  `
    //           }
    //         </span>)
    //       })
    //     }
    //   </div>
    //   <br/>
    //   {event && (event.organizer == balances.ethAddress )&& <Fragment>
    //     <h3>
    //       admin controls {`${balances.ethAddress }`}
    //     </h3>
    //     <Button disabled={event.state != 1} onClick={() => onStartEvent(event.eventId, event.membershipManagerAddress)}>
    //       Start Event
    //     </Button>
    //     <Button disabled={event.state != 2} onClick={() => onEndEvent(event.eventId, event.membershipManagerAddress)}>
    //       End Event
    //     </Button>
    //     <Button disabled={event.state != 1} onClick={() => onCancelEvent(event.eventId, event.membershipManagerAddress)}>
    //       Cancel Event
    //     </Button>
    //     <Button disabled={event.state != 1}  onClick={() => onChangeLimit(event.eventId, 2, event.membershipManagerAddress)}>
    //       Change Max limit to 2
    //     </Button>
    //     <Button disabled={event.state != 1} onClick={() => onChangeLimit(event.eventId, 0, event.membershipManagerAddress)}>
    //       Change Max limit to 0
    //     </Button>
    //     <Button disabled={event.state != 2} onClick={() => onManualConfirmAttendees(event.eventId, ['0xdBEA2496d63eB313Ef6bA353d158653b5beC9dfC'], event.membershipManagerAddress)}>
    //       Confirm Members attendance
    //     </Button>
    //     {
    //         (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
    //         <Fragment>
    //           <Button onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
    //             Claim Gift
    //           </Button>
    //         </Fragment>
    //       }
    //     <br/>
    //   </Fragment>
    //   }
    //   {
    //     event && community.isMember && event.organizer != balances.ethAddress  && <Fragment>
    //       <h3>
    //         Attendee controls
    //       </h3>
    //       {
    //         event.state == 1 &&
    //         <Fragment>
    //           <Button disabled={!(event.memberState == 0)} onClick={() => onRSVP(event.eventId, event.membershipManagerAddress)}>
    //             RSVP
    //           </Button>
    //           <Button disabled={!(event.memberState == 1)} onClick={() => onCancelRSVP(event.eventId, event.membershipManagerAddress)}>
    //             Cancel RSVP
    //           </Button>
    //         </Fragment>
    //       }
    //       {
    //         (event.state == 2 && event.memberState == 1) &&
    //         <Button disabled={event.state != 2 && event.memberState == 1} onClick={() => onConfirmAttendance(event.eventId, event.membershipManagerAddress)}>
    //           Confirm attendance
    //         </Button>
    //       }

    //       {
    //         (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
    //         <Fragment>
    //           <Button onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
    //             Claim Gift
    //           </Button>
    //         </Fragment>
    //       }
    //       {
    //         (event.state == 4 && event.memberState == 1) &&
    //         <Fragment>
    //           <Button onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
    //             Claim Deposit
    //           </Button>
    //         </Fragment>
    //       }
    //     </Fragment>
    //   }
    //   <h2>
    //     Community details
    //   </h2>
    //   <div>
    //     {
    //       community && Object.keys(community).map(key => {
    //         return (<span key={key}>
    //           {
    //             `${key}: ${community[key]} ||  `
    //           }
    //         </span>)
    //       })
    //     }
    //   </div>
    //   <br/>
    //   {community && <Fragment>
    //     <Button disabled={community.transfersUnlocked} onClick={() => onJoinCommunity(2, community.tbcAddress, community.membershipManagerAddress)}>
    //       Join for 2 Dai
    //     </Button>
    //     <Button onClick={() => onIncreaseMembership(2, community.tbcAddress, community.membershipManagerAddress)}>
    //       Increase by 2 Dai
    //     </Button>
    //   </Fragment>
    //   }
    // </Fragment>;
};

export default withStyles(styles, { withTheme: true })(ViewEvent);
