/**
 *
 * CarouselCommunites
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
import { colors } from 'theme';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import CommunityCard from 'components/CommunityCard';
import { ICommunity } from 'domain/communities/types';


const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block',
    padding: "20px",
    [breakpoints.up(400 + spacing.unit * 3 * 2)]: {
      padding: "20px",
    },
  },
  label:{
    marginTop: 10
  },
  innerCarousel: {
    marginTop: 20,
    paddingTop: "10px",
    paddingBottom: "10px",
    '&> *':{
      outline: 'none'
    },
    '& .slick-slide > * > * > *': {
      width: 'calc(100% - 20px)',
      margin: '0 auto',
    },
  },
  carouselDots: {
    width: '100%',
    position: 'absolute',
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -10,
    padding: 0,
    '& > li': {
      display: 'block',
      width: 10,
      height: 10,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: 'black',
      margin: '0 5px',
      opacity: 0.5,
      transitionDuration: '200ms',
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
  communities: ICommunity[];
  width: Breakpoint;
  label: string;
}

function FabNext(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
    // className={className}
    style={{...style,
            display: 'block',
            position: 'absolute',
            top: '50%',
            transform: 'translate(50%,-50%)',
            right: '20px',
            color: colors.white,
            backgroundColor: colors.proteaBranding.pink}}
      onClick={onClick}>
      <ChevronRight />
    </Fab>
  );
}

function FabPrevious(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
      style={{...style,
              display: 'block',
              position: 'absolute',
              top: '50%',
              transform: 'translate(-50%,-50%)',
              left: '20px',
              zIndex: '1',
              color: colors.white,
              backgroundColor: colors.proteaBranding.pink}}
      onClick={onClick} >
    <ChevronLeft />
    </Fab>
  );
}

function CarouselCommunites(props: OwnProps) {
  const { classes, communities, width, label } = props;

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
    // centerPadding: '60px',
    arrows: true,
    dots: true,
    dotsClass: classes.carouselDots,
    slidesToScroll: 1,
    rows: 2,
    slidesPerRow: getCarouselSlidesToShow(),
    infinite: true,
    centerMode: false,
    prevArrow: <FabPrevious />,
    nextArrow: <FabNext />,
    appendDots: dots => (
      <ul> {dots} </ul>
    ),
  };
  return (
    <Fragment>
      <Typography className={classes.label} component="h2" variant="h2">{label}</Typography>
      <Slider {...carouselSettings}>
        {
          communities && communities.map(c => (
            <div key={c.tbcAddress}>
              <CommunityCard {...c} />
            </div>
          ))
        }
      </Slider>
    </Fragment>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(CarouselCommunites);
