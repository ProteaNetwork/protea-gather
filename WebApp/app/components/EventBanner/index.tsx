/**
 *
 * EventBanner
 *
 */

import { Button, Card, CardHeader, CardMedia, Theme, Typography } from '@material-ui/core';
import { createStyles, withStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';

const styles = ({ spacing }: Theme) => createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    marginTop: spacing.unit * 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 2}px ${spacing.unit * 2}px`,
  },
  media: {
    height: '40vh',
    width: 'auto',
    alignContent: 'center',
  },
  buttonTop: {
    margin: spacing.unit,
    alignSelf: 'right',
    float: 'left',
  },
  button: {
    margin: spacing.unit,
    alignSelf: 'right',
    float: 'right',
  },
  descriptionStyle: {
    fontSize: 'medium',
  },
});

interface OwnProps {
  classes: any;
  name: string;
  tokens: number;
  tokenName: string;
  logo: string;
  description: string;
  date: string;
  ticketsLeft: number;
  history: any;
}

function EventBanner(props: OwnProps) {
  const { classes, logo, name, tokens, tokenName, ticketsLeft, date, description, history } = props;

  return (
    <Fragment>
      <Card>
        <Button variant="raised" color="primary" className={classes.buttonTop} onClick={history.goBack}>
          Back
        </Button>

        <CardMedia
          className={classes.media}
          image={logo}
          title={name} />
        <CardHeader
          title={name}
          subheader={
            <Fragment>
              <span>{tokens} {tokenName} - {ticketsLeft} Tickets left</span>
              <br />
              <span>{date}</span>
              <Typography variant="body1" className={classes.descriptionStyle}>
                {description}
              </Typography>
              <Button variant="contained" color="primary" className={classes.button}>
                RSVP
              </Button>
            </Fragment>
          }
        />
      </Card>
    </Fragment>
  );
}

export default withStyles(styles)(EventBanner);
