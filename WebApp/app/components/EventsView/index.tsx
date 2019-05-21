/**
 *
 * EventsView
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, Tab, Tabs, AppBar } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { colors } from 'theme';
import { IEvent } from 'domain/events/types';
import EventCard from 'components/EventCard';
import EventActionCard from 'components/EventActionCard';
import classNames from 'classnames';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
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

      borderRadius: theme.shape.borderRadius,
      backgroundColor: colors.white,
      '&:hover': {
        // backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
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
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      width: '100%',
    },
    content:{
      padding: 20,
      display: 'flex',
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      "& > *":{
        maxWidth: "calc(50% - 10px)",
        marginBottom: 20
      }
    },
    actionArea:{
      padding: 20,
      display: 'flex',
      flexDirection: "column",
      "& > *": {
        marginBottom: 10
      }
    },
    slide:{
      transitionDuration: "400ms",
      "&.hidden":{
        height: 0,
        opacity: 0,
      },
      "&.active": {
        opacity: 1,
      }
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  slideIndex: number;
  handleSlideChange(event: any, value: any): void;
  handleSlideChangeIndex(index: any): void;
  handleNameChange(name: any): void;
  onStartEvent(eventId: string, membershipManagerAddress: string): void;
  onEndEvent(eventId: string, membershipManagerAddress: string): void;
  onCancelEvent(eventId: string, membershipManagerAddress: string): void;
  onClaimGift(eventId: string, membershipManagerAddress: string, state: number): void;
  onConfirmAttendance(eventId: string, membershipManagerAddress: string): void;
  ethAddress: string;
  myUpcomingEvents: IEvent[];
  myPendingClaimEvents: IEvent[];
  myPendingConfirmEvents: IEvent[];
  discoverEvents: IEvent[];
  myHostingPendingEvents: IEvent[];
  myHostingActiveEvents: IEvent[];
  filter: string;
  classes: any;
}

const EventsView: React.SFC<OwnProps> = (props: OwnProps) => {
  const {
    classes,
    myPendingConfirmEvents,
    myPendingClaimEvents,
    myUpcomingEvents,
    discoverEvents,
    ethAddress,
    slideIndex,
    handleNameChange,
    handleSlideChange,
    handleSlideChangeIndex,
    onClaimGift,
    onCancelEvent,
    onConfirmAttendance,
    onEndEvent,
    onStartEvent,
    myHostingPendingEvents,
    myHostingActiveEvents,
    filter
  } = props;
  return <Fragment>
    {
      (myPendingConfirmEvents && myPendingClaimEvents && myUpcomingEvents && discoverEvents) &&
      <Fragment>
        <AppBar position="static" >
          <Tabs
            value={slideIndex}
            onChange={handleSlideChange}
            variant="fullWidth" >
            <Tab label="MANAGE EVENTS" />
            <Tab label="MY UPCOMING" />
            <Tab label="DISCOVER EVENTS" />
          </Tabs>
        </AppBar>
        <section className={classes.root}>
          <SwipeableViews
              index={slideIndex}
              onChangeIndex={handleSlideChangeIndex}>
              <article className={classNames(classes.slide, (slideIndex == 0 ? 'active': 'hidden'))}>
                <section className={classes.filteringSection}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search Events"
                      classes={{root: classes.inputRoot, input: classes.inputInput }}
                      value={filter}
                      onChange={(event) => handleNameChange(event.target.value)}
                    />
                  </div>
                </section>
                <section className={classes.actionArea}>
                  {
                    myPendingClaimEvents && (<Fragment>
                      {myPendingClaimEvents
                        .map((event: IEvent) => <EventActionCard
                          bannerImage={event.bannerImage}
                          comLogo={event.bannerImage}
                          eventId={event.eventId}
                          name={event.name}
                          actionText={event.state == 3 ? "Claim Gift": "Claim Deposit"}
                          action={() => onClaimGift(event.eventId, event.membershipManagerAddress, event.state)}
                          communityName={event.communityName}
                          key={event.eventId}>

                        </EventActionCard>)
                      }
                    </Fragment>)
                  }
                  {
                    myPendingConfirmEvents && (<Fragment>
                      {myPendingConfirmEvents
                        .map((event: IEvent) => <EventActionCard
                          bannerImage={event.bannerImage}
                          comLogo={event.bannerImage}
                          eventId={event.eventId}
                          name={event.name}
                          actionText={"Confirm attendance"}
                          action={() => onConfirmAttendance(event.eventId, event.membershipManagerAddress)}
                          communityName={event.communityName}
                          key={event.eventId}>

                        </EventActionCard>)
                      }
                    </Fragment>)
                  }
                  {
                    myHostingActiveEvents && (<Fragment>
                      {myHostingActiveEvents
                        .map((event: IEvent) => <EventActionCard
                          bannerImage={event.bannerImage}
                          comLogo={event.bannerImage}
                          eventId={event.eventId}
                          name={event.name}
                          actionText={"End Event"}
                          action={() => onEndEvent(event.eventId, event.membershipManagerAddress)}
                          communityName={event.communityName}
                          key={event.eventId}>

                        </EventActionCard>)
                      }
                    </Fragment>)
                  }
                  {
                    myHostingPendingEvents && (<Fragment>
                      {myHostingPendingEvents
                        .map((event: IEvent) => <EventActionCard
                          bannerImage={event.bannerImage}
                          comLogo={event.bannerImage}
                          eventId={event.eventId}
                          name={event.name}
                          actionText={"Start Event"}
                          action={() => onStartEvent(event.eventId, event.membershipManagerAddress)}
                          communityName={event.communityName}
                          key={event.eventId}>

                        </EventActionCard>)
                      }
                    </Fragment>)
                  }
                </section>
              </article>
              <article className={classNames(classes.slide, (slideIndex == 1 ? 'active': 'hidden'))}>
                <section className={classes.filteringSection}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search Events"
                      classes={{root: classes.inputRoot, input: classes.inputInput }}
                      value={filter}
                      onChange={(event) => handleNameChange(event.target.value)}
                    />
                  </div>
                </section>
                <section className={classes.content}>
                  {
                    myUpcomingEvents && (<Fragment>
                      {myUpcomingEvents
                        .map((event: IEvent) => <EventCard
                          bannerImage={event.bannerImage}
                          comLogo={event.bannerImage}
                          displayCommunityName={true}
                          eventId={event.eventId}
                          name={event.name}
                          communityName={event.communityName}
                          key={event.eventId}>

                        </EventCard>)
                      }
                    </Fragment>)
                  }
                  {
                    myUpcomingEvents && myUpcomingEvents.length == 0 && <Fragment>
                      No upcoming events
                    </Fragment>
                  }
                </section>
              </article>
              <article className={classNames(classes.slide, (slideIndex == 2 ? 'active': 'hidden'))}>
                <section className={classes.filteringSection}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search Events"
                      classes={{root: classes.inputRoot, input: classes.inputInput }}
                      value={filter}
                      onChange={(event) => handleNameChange(event.target.value)}
                    />
                  </div>
                </section>
                <section className={classes.content}>
                  {
                    discoverEvents && (<Fragment>
                      {discoverEvents
                        .map((event: IEvent) => <EventCard
                          bannerImage={event.bannerImage}
                          comLogo={event.bannerImage}
                          displayCommunityName={false}
                          eventId={event.eventId}
                          name={event.name}
                          communityName={event.communityName}
                          key={event.eventId}>

                        </EventCard>)
                      }
                    </Fragment>)
                  }
                  {
                    discoverEvents && discoverEvents.length == 0 && <Fragment>
                      No additional events available
                    </Fragment>
                  }
                </section>
              </article>
            </SwipeableViews>
          </section>
      </Fragment>
    }
  </Fragment>;
};

export default withStyles(styles, { withTheme: true })(EventsView);
