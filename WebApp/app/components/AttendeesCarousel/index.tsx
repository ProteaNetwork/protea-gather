/**
 *
 * AttendeesCarousel
 *
 */

import { Fab, Paper, Theme, withWidth } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import AttendeeCard from 'components/AttendeeCard';
import React, { Fragment } from 'react';
import Slider, { Settings as SliderSettings } from 'react-slick';
import { compose } from 'redux';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  paperCarousel: {
    display: 'block',
    width: '100%',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 3}px`,
    marginTop: `${spacing.unit * 2}px`,
    marginBottom: `${spacing.unit * 2}px`,
  },
  carouselButton: {
    backgroundColor: 'orange',
  },
  innerCarousel: {
    'marginTop': 20,
    '& .slick-slide > * > * > *': {
      width: 'calc(100% - 20px)',
      margin: '0 auto',
    },
  },
  carouselDots: {
    'width': '100%',
    'position': 'absolute',
    'margin': 0,
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'bottom': -15,
    'padding': 0,
    '& > li': {
      'display': 'block',
      'width': 10,
      'height': 10,
      'borderRadius': 20,
      'overflow': 'hidden',
      'backgroundColor': 'black',
      'margin': '0 5px',
      'opacity': 0.5,
      'transitionDuration': '200ms',
      '& > *': {
        cursor: 'pointer',
        margin: 0,
        display: 'block',
        height: '100%',
        width: '100%',
        padding: 0,
      },
      '&:hover': {
        opacity: 1,
      },
    },
  },
});

function FabNext(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
      className={className}
      style={{
        ...style,
        display: 'block',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        right: '10px',
        backgroundColor: 'orange',
      }}
      onClick={onClick} />
  );
}

function FabPrevious(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
      className={className}
      style={{
        ...style,
        display: 'block',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        left: '60px',
        zIndex: '1',
        backgroundColor: 'orange',
      }}
      onClick={onClick} />
  );
}

interface OwnProps {
  classes: any;
  attendees: any[];
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
  };

  const sliderSettings: SliderSettings = {
    className: classes.innerCarousel,
    centerPadding: '60px',
    arrows: true,
    dots: true,
    dotsClass: classes.carouselDots,
    slidesToShow: getCarouselSlidesToShow(),
    slidesToScroll: 1,
    infinite: true,
    centerMode: true,
    prevArrow: <FabPrevious />,
    nextArrow: <FabNext />,
    appendDots: dots => (
      <ul> {dots} </ul>
    ),
  };

  return (
    <Fragment>
      <Paper className={classes.paperCarousel}>
        <Slider {...sliderSettings}>
          {attendees.map(a => <div key={a.id}> <AttendeeCard {...a} /> </div>)}
        </Slider>
      </Paper>
    </Fragment>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(AttendeesCarousel);
