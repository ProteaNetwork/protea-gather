/**
 *
 * ViewEvent
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, AppBar, Typography, Tabs, Tab, Button, Input, InputBase, Fab } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { IEvent } from 'domain/events/types';
import { ICommunity } from 'domain/communities/types';
import { colors } from 'theme';
import apiUrlBuilder from 'api/apiUrlBuilder';
import dayjs from 'dayjs';
import Blockies from 'react-blockies';
import { IMember } from 'domain/membershipManagement/types';
import MembersTab from 'components/MembersTab';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import MembersActionTab from 'components/MembersActionTab';
import { Save, Edit } from '@material-ui/icons';
import classNames from 'classnames';

const styles = ({ spacing, shape }: Theme) => createStyles({
  root: {
    backgroundColor: colors.proteaBranding.orange,
    "& .slide":{
      position: "relative",
      transitionDuration: "400ms",
      "&.active":{
        opacity: 1,
      },
      "&.hidden":{
        opacity: 0,

      }
    }
  },
  filteringSection:{
    padding: 20
  },
  search: {
    position: 'relative',

    borderRadius: shape.borderRadius,
    backgroundColor: colors.white,
    '&:hover': {
      // backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    width: spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: spacing.unit,
    paddingRight: spacing.unit,
    paddingBottom: spacing.unit,
    paddingLeft: spacing.unit * 10,
    width: '100%',
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
  },
  confirmMembersFab:{
    display: 'block',
    position: 'fixed',
    bottom: 15,
    right: 0,
    transform: 'translate(-50%,-50%)',
    zIndex: 999,
    color: colors.white,
    backgroundColor: colors.proteaBranding.pink,
    opacity: 0,
    visibility: "hidden",
    transitionDuration: "400ms",
    cursor: "pointer",
    "&.active":{
      visibility: "visible",
      opacity: 1
    },
    "&:hover":{
      backgroundColor: colors.proteaBranding.pink,
    }
  },
  editFab:{
    display: 'block',
    position: 'fixed',
    bottom: -15,
    left: 35,
    transform: 'translate(-50%,-50%)',
    zIndex: 999,
    cursor: "pointer",
    "& > *":{
      color: colors.white,
      backgroundColor: colors.proteaBranding.pink,
      "&:hover":{
        backgroundColor: colors.proteaBranding.pink,
      }
    },
  }

});

interface OwnProps extends WithStyles<typeof styles> {
  event: IEvent;
  attendees: IMember[];
  community: ICommunity;
  balances: {ethBalance: number, daiBalance: number, ethAddress: string};
  slideIndex: number;
  filter: string;
  confirmingList: string[];
  handleChange(event: any, value: any): void;
  handleChangeIndex(index: any): void;
  handleNameChange(name: any): void;
  handleTogglePendingApproval(address: string): void;

  onChangeLimit(eventId: string, limit: number, membershipManagerAddress: string): void;
  onStartEvent(eventId: string, membershipManagerAddress: string): void;
  onEndEvent(eventId: string, membershipManagerAddress: string): void;
  onCancelEvent(eventId: string, membershipManagerAddress: string): void;
  onManualConfirmAttendees(eventId: string, attendees: string[], membershipManagerAddress: string): void;

  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onRSVP(eventId: string, membershipManagerAddress: string, tbcAddress: string): void;
  onCancelRSVP(eventId: string, membershipManagerAddress: string, tbcAddress: string): void;
  onConfirmAttendance(eventId: string, membershipManagerAddress: string, tbcAddress: string): void;
  onClaimGift(eventId: string, membershipManagerAddress: string, state: number, tbcAddress: string): void;

  onGenerateQr(eventId: string): void;
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
      handleNameChange,
      attendees,
      filter,
      handleTogglePendingApproval,
      confirmingList,
      onGenerateQr
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
          <section className={classes.root}>
            <SwipeableViews
              index={slideIndex}
              onChangeIndex={handleChangeIndex}>
              <article className={classNames('slide', (slideIndex == 0 ? 'active': 'hidden'))}>
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
                    community.isMember && event.memberState == 0 && (community.availableStake < event.requiredDai) &&
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
                          {/* <Button onClick={() => onChangeLimit(event.eventId, 2, event.membershipManagerAddress)}>
                            Change Max limit to 2
                          </Button> */}
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
                        event.state == 2 &&(
                          <Button className={classes.buttons} onClick={() => onGenerateQr(event.eventId)}>
                            Generate QR
                          </Button>
                        )
                      }
                      {
                        (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
                          <Fragment>
                            <Button className={classes.buttons} onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state, community.tbcAddress)}>
                              Claim Gift
                            </Button>
                          </Fragment>
                      }

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
                            <Button className={classes.buttons} onClick={() => onRSVP(event.eventId, event.membershipManagerAddress, community.tbcAddress)}>
                              RSVP
                            </Button>
                          }
                          {
                            event.memberState == 1 &&
                            <Button className={classes.buttons} onClick={() => onCancelRSVP(event.eventId, event.membershipManagerAddress, community.tbcAddress)}>
                              Cancel RSVP
                            </Button>
                          }

                        </Fragment>
                      }
                      {
                        (event.state == 2 && event.memberState == 1) &&
                        <Button className={classes.buttons} onClick={() => onConfirmAttendance(event.eventId, event.membershipManagerAddress, community.tbcAddress)}>
                          Confirm attendance
                        </Button>
                      }

                      {
                        (event.state == 3 && event.memberState == 99 && event.gift > 0) &&
                        <Fragment>
                          <Button className={classes.buttons} onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state, community.tbcAddress)}>
                            Claim Gift ({`${event.gift.toFixed(2)}${community.tokenSymbol}`})
                          </Button>
                        </Fragment>
                      }
                      {
                        (event.state == 4 && event.memberState == 1) &&
                        <Fragment>
                          <Button className={classes.buttons} onClick={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state, community.tbcAddress)}>
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
              </article>
              <article className={classNames('slide', classes.memberSection, (slideIndex == 1 ? 'active': 'hidden'))}>
                <section className={classes.filteringSection}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search Attendees"
                      classes={{root: classes.inputRoot, input: classes.inputInput }}
                      value={filter}
                      onChange={(event) => handleNameChange(event.target.value)}
                    />
                  </div>
                </section>
                {
                  (event.organizer != balances.ethAddress && attendees && attendees.length > 0) &&
                  <Fragment>
                    {
                      (attendees.map((member: IMember) => {
                        return (member.ethAddress && <MembersTab
                          key={member.ethAddress}
                          stateMessage={event.confirmedAttendees.indexOf(member.ethAddress)  >= 0 ? "Attended" : "RSVP'd"}
                          member={member}/>)
                      }))
                    }
                  </Fragment>
                }
                {
                  (event.organizer == balances.ethAddress && event.state == 2 && attendees && attendees.length > 0) &&
                  <Fragment>
                    {
                      confirmingList && (attendees.map((member: IMember) => {
                        return (member.ethAddress && event.organizer != member.ethAddress && <MembersActionTab
                          key={member.ethAddress}
                          confirmed={event.confirmedAttendees.indexOf(member.ethAddress) >= 0}
                          highlighted={(confirmingList.indexOf(member.ethAddress) >= 0 && (event.confirmedAttendees.indexOf(member.ethAddress) < 0))}
                          action={() => handleTogglePendingApproval(member.ethAddress)}
                          stateMessage={event.confirmedAttendees.indexOf(member.ethAddress)  >= 0 ? "Attended" : "Click to manually confirm"}
                          member={member}/>)
                      }))
                    }

                  </Fragment>
                }
              </article>
            </SwipeableViews>
            {event.organizer == balances.ethAddress  && event.state == 2 &&
              <Fab onClick={() => onManualConfirmAttendees(event.eventId, confirmingList, event.membershipManagerAddress)} className={classNames(classes.confirmMembersFab, {"active": confirmingList.length > 0})}>
                <Save />
              </Fab>
            }
          </section>
        </Fragment>
      }
      {
      event.organizer == balances.ethAddress && <Link className={classes.editFab} to={`/events/${event.eventId}/update`}>
        <Fab>
          <Edit />
        </Fab>
      </Link>

      }
    </Fragment>
};

export default withStyles(styles, { withTheme: true })(ViewEvent);
