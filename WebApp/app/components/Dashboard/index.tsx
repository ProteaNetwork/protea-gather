import { Fab, Paper, Theme, Typography, WithStyles, withWidth } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import CommunityCard from 'components/CommunityCard';
import EventCard from 'components/EventCard';
import React, { Fragment } from 'react';
import Slider, { Settings as SliderSettings } from 'react-slick';
import { compose } from 'redux';
import '../../css/slick-theme.css';
import '../../css/slick.css';
import { ICommunity } from 'domain/communities/types';
import { IEvent } from 'domain/events/types';
import { colors } from 'theme';
import { ChevronRight, ChevronLeft } from '@material-ui/icons';
import CarouselEvents from 'components/CarouselEvents';
import Carousel from 'components/Carousel';
import CarouselCommunites from 'components/CarouselCommunites';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  layout: {
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    display: 'block', // Fix IE 11 issue.
    padding: "20px",
    [breakpoints.up(400 + spacing.unit * 3 * 2)]: {
      padding: "20px",
    },
  },
  paper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 3}px`,
  },
  paperCarousel: {
    display: 'block',
    width: '100%',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 3}px`,
    marginTop: `${spacing.unit * 2}px`,
    marginBottom: `${spacing.unit * 2}px`,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  extendedIcon: {
    marginRight: spacing.unit,
  },
  headers: {
    marginBottom: `${spacing.unit * 2}px`,
  },
});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
  width: Breakpoint;
  myCommunities: ICommunity[],
  myUpcomingEvents: IEvent[],
  myPastEvents: IEvent[],
  myActiveEvents: IEvent[],
  myHostingEvents: IEvent[],
  discoverEvents: IEvent[]
}

const Dashboard: React.FunctionComponent<OwnProps> = (props: OwnProps) =>{
  const { classes, width, myUpcomingEvents, discoverEvents, myCommunities } = props;

  return (
    <Fragment>
      <section className={classes.layout}>
        {/* <Fragment>
          <Typography className={classes.label} component="h2" variant="h2">
            My Upcoming Events
          </Typography>

          {
            // @ts-ignoreyy
            <Carousel>
            {
              myUpcomingEvents.map(e =>
                // @ts-ignore
                <EventCard key={e.eventId} {...e} />
              )
            }
            </Carousel>
          }
        </Fragment> */}
        <Fragment>
          <CarouselCommunites
            // @ts-ignore
            label="My Communities"
            // @ts-ignore
            communities={myCommunities} >
          </CarouselCommunites>
        </Fragment>
        <Fragment>
          <CarouselEvents
            // @ts-ignore
            label="My upcoming events"
            // @ts-ignore
            events={myUpcomingEvents} >
          </CarouselEvents>
        </Fragment>
        <Fragment>
          <CarouselEvents
            // @ts-ignore
            label="Discover Events"
            // @ts-ignore
            events={discoverEvents} >
          </CarouselEvents>
        </Fragment>
      </section>
    </Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(Dashboard);
