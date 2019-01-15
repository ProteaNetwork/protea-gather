import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Paper, Grid, Avatar, WithStyles, withWidth } from '@material-ui/core';
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
});

interface Props extends WithStyles<typeof styles> {
  classes: any;
  width: Breakpoint;
  image: string;
  name: string;
  ensName: string;
  tokenBalance: number;
  communities: Array<any>;
  events: Array<any>;
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "float", background: "green" }}
      onClick={onClick}
    />
  );
}

function Dashboard(props: Props) {
  const { classes, image, name, ensName, tokenBalance, communities, events, width } = props;

  const getCarouselSlidesToShow = () => {
    if (isWidthUp('xl', width)) {
      return 6;
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
    arrows: true,
    dots: true,
    slidesToShow: getCarouselSlidesToShow(),
    slidesToScroll: 1,
    infinite: false,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />
  };

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item>
            <Avatar alt={name} src={image} className={classes.bigAvatar}>{name.substring(0, 1)}</Avatar>
          </Grid>
          <Grid item>
            <Typography variant='h3'>{name}</Typography>
            <Typography variant='body1'>{ensName}</Typography>
            <Typography variant='body1'>{tokenBalance} DAI</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paperCarousel}>
        <Typography variant='h3'>My Communities</Typography>
        <Slider {...sliderSettings} >
          {communities.map(c => (<div key={c.id}><CommunityCard {...c} /></div>))}
        </Slider>
      </Paper>
      <Paper className={classes.paperCarousel}>
        <Typography variant='h3'>My Events</Typography>
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
