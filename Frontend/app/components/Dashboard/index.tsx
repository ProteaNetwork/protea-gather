import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Paper, WithStyles, withWidth, Fab } from '@material-ui/core';
import Slider, { Settings as SliderSettings } from "react-slick";
import '../../css/slick.css'
import '../../css/slick-theme.css';
import { compose } from 'redux';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import CommunityCard from 'components/CommunityCard';
import EventCard from 'components/EventCard';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: spacing.unit * 3,
    marginRight: spacing.unit * 3,
    [breakpoints.up(400 + spacing.unit * 3 * 2)]: {
      marginLeft: 'auto',
      marginRight: 'auto',
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
    marginBottom: `${spacing.unit * 2}px`
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  extendedIcon: {
    marginRight: spacing.unit,
  },
  carouselButton: {
    backgroundColor: 'orange',
  },
  innerCarousel: {
    marginTop: 20,
    "& .slick-slide > * > * > *":{
      width: 'calc(100% - 20px)',
      margin: '0 auto'
    }
  },
  carouselDots: {
    width: '100%',
    position: 'absolute',
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -15,
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
        padding: 0
      },
      '&:hover': {
        opacity: 1
      }
    },
  },
  headers: {
    marginBottom: `${spacing.unit * 2}px`
  },
});

interface Props extends WithStyles<typeof styles> {
  classes: any;
  width: Breakpoint;
  communities: Array<any>;
  events: Array<any>;
}

function FabNext(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
      className={className}
      style={{...style,
        display: 'block',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        right: '10px',
        backgroundColor: 'orange'}}
      onClick={onClick} />
  );
}

function FabPrevious(props) {
  const { className, style, onClick } = props;
  return (
    <Fab
      className={className}
      style={{...style,
        display: 'block',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        left: '60px',
        zIndex: '1',
        backgroundColor: 'orange'}}
      onClick={onClick} />
  );
}

function Dashboard(props: Props) {
  const { classes, communities, events, width } = props;

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

  const sliderSettings: SliderSettings = {
    className: classes.innerCarousel,
    centerPadding: "60px",
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
        <Typography variant='h3' className={classes.headers}>My Communities</Typography>
        <Slider {...sliderSettings} >
          {communities.map(c => (<div key={c.id}><CommunityCard {...c} /></div>))}
        </Slider>
      </Paper>
      <Paper className={classes.paperCarousel}>
        <Typography variant='h3' className={classes.headers}>My Events</Typography>
        <Slider {...sliderSettings} >
          {events.map(e => (<div key={e.id}><EventCard {...e} /></div>))}
        </Slider>
      </Paper>
    </Fragment>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(Dashboard);
