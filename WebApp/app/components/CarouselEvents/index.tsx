/**
 *
 * CarouselEvents
 *
 */

import { Fab, Paper, Theme, Typography, withWidth } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
// import Carousel from 'nuka-carousel';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import EventCard from 'components/EventCard';
import React, { Fragment } from 'react';
import Slider, { Settings as SliderSettings } from 'react-slick';
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
    alignItems: 'left',
    padding: `${spacing.unit * 2}px ${spacing.unit * 2}px ${spacing.unit * 2}px`,
    marginTop: `${spacing.unit * 2}px`,
    marginBottom: `${spacing.unit * 2}px`,
  },
  innerCarousel: {
    'marginTop': 20,
    'marginBottom': 10,
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

interface OwnProps {
  classes: any;
  events: any[];
  width: Breakpoint;
  label: string;
}

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
  };

  const carouselSettings: SliderSettings = {
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
      <Paper className={classes.paper}>
        <Typography variant="h4">{label}</Typography>
        <Slider {...carouselSettings} >
          {events.map(e => (<div key={e.id}><EventCard {...e} /></div>))}
        </Slider>
      </Paper>
    </Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(CarouselEvents);
