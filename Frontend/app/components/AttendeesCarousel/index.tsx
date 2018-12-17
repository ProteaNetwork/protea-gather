/**
 *
 * AttendeesCarousel
 *
 */

import React, { Fragment } from 'react';
import { compose } from 'redux';
import Carousel from 'nuka-carousel';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Theme, Paper, withWidth } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import AttendeeCard from 'components/AttendeeCard';

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
  attendees: Array<any>;
  width: Breakpoint;
}

const AttendeesCarousel: React.SFC<OwnProps> = (props: OwnProps) => {
  const { classes, attendees, width } = props;

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
        <Carousel {...carouselSettings}>
          {attendees.map(a =>
            <AttendeeCard
            key={a.id}
              picture={a.picture}
              userName={a.userName} />
          )}
        </Carousel>
      </Paper>
    </Fragment>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(AttendeesCarousel);
