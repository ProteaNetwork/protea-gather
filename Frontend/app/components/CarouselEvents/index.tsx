/**
 *
 * CarouselEvents
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Paper, withWidth } from '@material-ui/core';
import EventCard from 'components/EventCard';
import Carousel from 'nuka-carousel';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import { compose } from 'redux';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block', 
    marginLeft: spacing.unit * 2,
    marginRight: spacing.unit * 2,
    marginTop: spacing.unit * 2,
    [breakpoints.up(400 + spacing.unit * 3 * 2)]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 2}px ${spacing.unit * 2}px`,
  },
});

interface OwnProps {
  classes: any;
  events: Array<any>;
  width: Breakpoint;
  label: string;
}

function CarouselEvents(props: OwnProps) {
  const { classes, events, width, label } = props;

  const getCarouselSlidesToShow = () => {
    if (isWidthUp('xl', width)) {
      return 4;
    }

    if (isWidthUp('lg', width)) {
      return 3;
    }

    if (isWidthUp('md', width)) {
      return 2;
    }

    return 1;
  }

  const carouselSettings = {
    width: `${getCarouselSlidesToShow()*400}px`,
    slidesToShow: getCarouselSlidesToShow(),
    slidesToScroll: 1,
    withoutControls: true,
  }

  return (
    <Fragment>
      <Paper className={classes.paper}>
      <Typography variant='h4'>{label}</Typography>
        <Carousel {...carouselSettings}>
          {events.map(e =>
            <EventCard
              key={e.eventID}
              eventName={e.eventName}
              eventID={e.eventID}
              image={e.image}
              comLogo={e.comLogo}
              onClick={e.onClick} />
          )}
        </Carousel>
      </Paper>
    </Fragment>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(CarouselEvents);