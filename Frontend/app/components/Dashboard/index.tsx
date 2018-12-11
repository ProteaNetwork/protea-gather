import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Paper, Grid, Avatar, WithStyles, withWidth } from '@material-ui/core';
import CommunityCard from 'components/CommunityCard';
import EventCard from 'components/EventCard';
import Carousel from 'nuka-carousel';
import { compose } from 'redux';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';

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
    marginTop: spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 3}px`,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
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



function Dashboard(props: Props) {
  const { classes, image, name, ensName, tokenBalance, communities, events, width } = props;

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
        <Grid container>
          <Grid item>
            <Avatar alt={name} src={image} className={classes.bigAvatar}>{name.substring(0, 1)}</Avatar>
          </Grid>
          <Grid item>
            <Typography variant='h2'>{name}</Typography>
            <Typography variant='body1'>{ensName}</Typography>
            <Typography variant='body1'>{tokenBalance} DAI</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant='h4'>Communities</Typography>
        <Carousel {...carouselSettings}>
          {communities.map(c =>
            <CommunityCard
              key={c.id}
              name={c.name}
              tokens={c.tokens}
              logo={c.logo}
              id={c.id}
              onClick={c.onClick} />
          )}
        </Carousel>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant='h4'>Events</Typography>
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
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(Dashboard);
