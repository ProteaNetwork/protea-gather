import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Paper, Grid, Avatar, WithStyles } from '@material-ui/core';
import CommunityCard from 'components/CommunityCard';
import EventCard from 'components/EventCard';
import Carousel from 'nuka-carousel';

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

interface Props extends WithStyles <typeof styles> {
  classes: any;
  image: string;
  name: string;
  ensName: string;
  tokenBalance: number;
  communities: Array<any>;
  events: Array<any>;
}

const carouselSettings = {
  width: '800px',
  slidesToShow: 3,
  slidesToScroll: 1,
  withoutControls: true,
}

function Dashboard(props: Props) {
  const { classes, image, name, ensName, tokenBalance, communities, events } = props;

  return (
    <Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item>
              <Avatar alt={name} src={image} className={classes.bigAvatar}>{name.substring(0,1)}</Avatar>
            </Grid>
            <Grid item>
              <Typography variant='h2'>{name}</Typography>
              <Typography variant='body1'>{ensName}</Typography>
              <Typography variant='body1'>{tokenBalance} DAI</Typography>
            </Grid>
          </Grid>
        </Paper>
      </main>
      <Typography variant='h4'>Communities</Typography>
      <Carousel {...carouselSettings}>
        {communities.map(C =>
          <CommunityCard
            key={C.id}
            name={C.name}
            tokens={C.tokens}
            logo={C.logo}
            id={C.id}
            onClick={(id) => console.log(id)} />
          )}
      </Carousel>
      <Typography variant='h4'>Events</Typography>
      <Carousel {...carouselSettings}>
        {events.map(E =>
          <EventCard
            key={E.eventID}
            eventName={E.eventName}
            eventID={E.eventID}
            image={E.image}
            comLogo={E.comLogo}
            onClick={(eventID) => console.log(eventID)}/>
        )}
      </Carousel>
    </Fragment>
  )
}

export default withStyles(styles, { withTheme: true })(Dashboard);
