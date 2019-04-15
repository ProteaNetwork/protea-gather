/**
 *
 * ViewEvent
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, AppBar, Typography, Tabs, Tab, Button, Input } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { IEvent } from 'domain/events/types';
import { ICommunity } from 'domain/communities/types';
import { colors } from 'theme';
import apiUrlBuilder from 'api/apiUrlBuilder';
import dayjs from 'dayjs';
import Blockies from 'react-blockies';
import CarouselEvents from 'components/CarouselEvents';
import { IMember } from 'domain/membershipManagement/types';
import MembersTab from 'components/MembersTab';
import { Link } from 'react-router-dom';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    backgroundColor: colors.proteaBranding.orange,
    width: 500,
  },
  infoBar: {
    backgroundColor: colors.proteaBranding.blackBg,
    width:'100%',
    color: colors.white,
    paddingTop: spacing.unit * 3,
    paddingBottom: spacing.unit * 2,
    paddingLeft: spacing.unit * 2,
    paddingRight: spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& > *': {
      color: colors.white,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
  texts: {
    color: colors.white,
  },
  buttonArea: {
    backgroundColor: colors.proteaBranding.orange,
    padding: spacing.unit * 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttons: {
    backgroundColor: colors.proteaBranding.pink,
    flexGrow: 1,
    flexBasis: "40%",
    margin: 5,
  },
  bannerImg: {
    height:'30vh',
    overflow: 'hidden',
    "& > *":{
      width: "100% !important",
      height: "100% !important",
      objectFit: "cover",
      objectPosition: "center"
    }
  },
  memberSection:{

  },
  header:{
    backgroundColor: colors.proteaBranding.blackBg,
    width:'100%',
    color: colors.white,
    paddingTop: spacing.unit * 3,
    paddingBottom: spacing.unit * 2,
    paddingLeft: spacing.unit * 2,
    paddingRight: spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    "& a":{
      textDecoration: 'none',
    },
    '& > *': {
      color: colors.white,
      textDecoration: 'none',
      "&:first-child": {
        width: 50,
        height: 50,
        overflow: 'hidden',
        borderRadius: "80px",
        marginRight: 20,
        "& > *": {
          height: "100% !important",
          width: "100% !important",
          objectFit: "cover"
        }
      }
    },
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  event: IEvent;
  community: ICommunity;
  balances: any;
  slideIndex: number;
  handleChange(event: any, value: any): void;
  handleChangeIndex(index: any): void;
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
    const {
      classes,
      community,
      event,
      balances,
      onIncreaseMembership,
      onJoinCommunity,
      onStartEvent,
      onCancelEvent,
      onEndEvent,
      onManualConfirmAttendees,
      onChangeLimit,
      onCancelRSVP,
      onClaimGift,
      onConfirmAttendance,
      onRSVP,
      slideIndex,
      handleChange,
      handleChangeIndex,
    } = props;
    return <Fragment>
      {
        event && <Fragment>
          <AppBar position="static" >
            <div className={classes.header}>
              <Link to={`/communities/${community.tbcAddress}`}>
                {
                  community.bannerImage && (<img src={apiUrlBuilder.attachmentStream(community.bannerImage)}>
                  </img>)
                }
                {
                  !event.bannerImage && (
                  <Blockies
                    seed={community.tbcAddress ? community.tbcAddress : "0x"}
                    size={125}
                    scale={5}
                    color={colors.proteaBranding.orange}
                    bgColor={colors.white}
                    spotColor={colors.proteaBranding.pink}
                  />
                  )
                }
              </Link>
              <div>
                <Link to={`/communities/${community.tbcAddress}`}>
                  <Typography variant='subtitle1' component="h2"  className={classes.texts}>{`${community.name ? community.name : ''}`}</Typography>
                </Link>
                <Typography variant='h1' component="h1" className={classes.texts}>{`${event.name ? event.name : ''}`}</Typography>
              </div>
            </div>
            <Tabs
              value={slideIndex}
              onChange={handleChange}
              variant="fullWidth" >
              <Tab label="DETAILS" />
              <Tab label="ATTENDEES" />
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={slideIndex}
            onChangeIndex={handleChangeIndex}>
            <section>
              <section className={classes.bannerImg}>
                {
                  event.bannerImage && (<img src={apiUrlBuilder.attachmentStream(event.bannerImage)}>
                  </img>)
                }
                {
                  !event.bannerImage && (
                  <Blockies
                    seed={event.eventId ? event.eventId : "0x"}
                    size={125}
                    scale={5}
                    color={colors.proteaBranding.orange}
                    bgColor={colors.white}
                    spotColor={colors.proteaBranding.pink}
                  />
                  )
                }
              </section>
              <section className={classes.infoBar}>
                <div>
                  <Typography className={classes.texts}>Required Stake: {event.requiredDai ? event.requiredDai : ''}DAI  (Available: {`${parseFloat(`${community.availableStake}`).toFixed(2 )}DAI`})</Typography>
                  <Typography className={classes.texts}>Date: {`${dayjs(event.eventDate).format('YYYY-MM-DD hh:mm')}`}</Typography>
                </div>
                <div>
                  <Typography className={classes.texts}>Status: {
                    `${event.state == 1 ? 'Not started': ''}
                      ${event.state == 2 ? 'Started': ''}
                      ${event.state == 3 ? 'Ended': ''}
                      ${event.state == 4 ? 'Cancelled': ''}`
                  }</Typography>
                  <Typography className={classes.texts}>Remaining bookings: {event.maxAttendees == 0 ? 'Unlimited' : `${event.attendees.length}/${event.maxAttendees}}`}
                  </Typography>
                </div>
              </section>
              <section className={classes.buttonArea}>
                {
                  !community.isMember &&
                  <Button
                    className={classes.buttons}
                    onClick={() => onJoinCommunity(event.requiredDai,community.tbcAddress, community.membershipManagerAddress)}
                    size="large">
                    {`Join for community for ${event.requiredDai}Dai`}
                  </Button>
                }
                {
                  community.isMember && (community.availableStake < event.requiredDai) &&
                  <Button
                    className={classes.buttons}
                    onClick={() => onIncreaseMembership(event.requiredDai,community.tbcAddress, community.membershipManagerAddress)}
                    size="large">
                    {`Increase stake by ${event.requiredDai}Dai`}
                  </Button>
                }
                {
                  event && (event.organizer == balances.ethAddress)&&
                  <Fragment>
                    {
                      event.state == 1 &&
                      <Fragment>
                         <Button className={classes.buttons} onClick={() => onStartEvent(event.eventId, event.membershipManagerAddress)}>
                          Start Event
                        </Button>
                        <Button className={classes.buttons} onClick={() => onCancelEvent(event.eventId, event.membershipManagerAddress)}>
                          Cancel Event
                        </Button>
                        {/* // <Button onClick={() => onChangeLimit(event.eventId, 2, event.membershipManagerAddress)}>
                        //   Change Max limit to 2
                        // </Button> */}
                      </Fragment>
                    }
                    {
                      event.state == 2 &&(
                        <Button className={classes.buttons} onClick={() => onEndEvent(event.eventId, event.membershipManagerAddress)}>
                          End Event
                        </Button>
                      )
                    }
                    {
                      (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
                        <Fragment>
                          <Button className={classes.buttons} onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
                            Claim Gift
                          </Button>
                        </Fragment>
                    }


                    {/* <Button disabled={event.state != 2} onClick={() => onManualConfirmAttendees(event.eventId, ['0xdBEA2496d63eB313Ef6bA353d158653b5beC9dfC'], event.membershipManagerAddress)}>
                      Confirm Members attendance
                    </Button>
                     */}

                </Fragment>
                }
                {
                  event && community.isMember && event.organizer != balances.ethAddress  &&
                  <Fragment>
                    {
                      event.state == 1 &&
                      <Fragment>
                        {
                          event.memberState == 0 &&
                          <Button className={classes.buttons} onClick={() => onRSVP(event.eventId, event.membershipManagerAddress)}>
                            RSVP
                          </Button>
                        }
                        {
                          event.memberState == 1 &&
                          <Button className={classes.buttons} onClick={() => onCancelRSVP(event.eventId, event.membershipManagerAddress)}>
                            Cancel RSVP
                          </Button>
                        }

                      </Fragment>
                    }
                    {
                      (event.state == 2 && event.memberState == 1) &&
                      <Button className={classes.buttons} onClick={() => onConfirmAttendance(event.eventId, event.membershipManagerAddress)}>
                        Confirm attendance
                      </Button>
                    }

                    {
                      (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
                      <Fragment>
                        <Button className={classes.buttons} onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
                          Claim Gift ({`${event.gift.toFixed(2)}${community.tokenSymbol}`})
                        </Button>
                      </Fragment>
                    }
                    {
                      (event.state == 4 && event.memberState == 1) &&
                      <Fragment>
                        <Button className={classes.buttons} onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}>
                          Claim Deposit
                        </Button>
                      </Fragment>
                    }
                  </Fragment>
                }
              </section>
              <section className={classes.infoBar}>
                <Typography className={classes.texts} variant='subtitle1'>Description:</Typography>
                <Typography className={classes.texts}>{event.description}</Typography>
              </section>
            </section>
            <section className={classes.memberSection}>
              {
                (event.attendees && event.attendees.length > 0) &&
                <Fragment>
                  {
                    (event.attendees.map((member: IMember) => {
                      return (member.ethAddress && <MembersTab
                        key={member.ethAddress}
                        stateMessage={event.confirmedAttendees.indexOf(member.ethAddress)  >= 0 ? "Attended" : "RSVP'd"}
                        member={member}/>)
                    }))
                  }
                </Fragment>
              }
            </section>
          </SwipeableViews>
        </Fragment>
      }
    </Fragment>
};

export default withStyles(styles, { withTheme: true })(ViewEvent);