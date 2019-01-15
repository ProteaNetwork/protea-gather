/**
 *
 * CarouselEvents
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Paper, withWidth, Fab } from '@material-ui/core';
import EventCard from 'components/EventCard';
// import Carousel from 'nuka-carousel';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import { compose } from 'redux';
import Slider, { Settings as SliderSettings } from "react-slick";


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
    marginBottom: `${spacing.unit * 2}px`
  },
});

interface OwnProps {
  classes: any;
  events: Array<any>;
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
        backgroundColor: 'orange'
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
        backgroundColor: 'orange'
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
  }

  const carouselSettings: SliderSettings = {
    className: "center",
    centerPadding: "60px",
    arrows: true,
    dots: true,
    slidesToShow: getCarouselSlidesToShow(),
    slidesToScroll: 1,
    infinite: true,
    centerMode: true,
    prevArrow: <FabPrevious />,
    nextArrow: <FabNext />,
    appendDots: dots => (
      <div>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Typography variant='h4'>{label}</Typography>
        <Slider {...carouselSettings} >
          {events.map(e => (<div key={e.id}><EventCard {...e} /></div>))}
        </Slider>
      </Paper>
    </Fragment>
  );
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(CarouselEvents);
