/**
 *
 * EventBanner
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Paper, Typography, Theme, Card, CardHeader, CardMedia, Button } from '@material-ui/core';

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
    height: 400,
    width: 400,
    alignContent: 'center',
  },
  buttonTop: {
    margin: spacing.unit,
    alignSelf: 'left',
    float: "left",
  },
  button: {
    margin: spacing.unit,
    alignSelf: 'right',
    float: "right",
  },
  dateText: {
    float: "left",
    marginTop: spacing.unit * 46,
    marginLeft: spacing.unit * 4,
    alignSelf: 'right',
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
}

function EventBanner(props: OwnProps) {
  const { classes, logo, name, tokens, tokenName, ticketsLeft, date } = props;

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Card className={classes.card}>
          <Button variant="raised" color="primary" className={classes.buttonTop}>
            Back
          </Button>
          <label className={classes.dateText}>
            {date}
          </label>
          <CardMedia
            className={classes.media}
            image={logo}
            title={name} />
          <CardHeader 
            title={name}
            subheader={
              <Typography>
                {tokens} {tokenName} - {ticketsLeft} Tickets left
                <Button variant="contained" color="primary" className={classes.button}>
                  RSVP
                </Button>
              </Typography>
            }
          />
        </Card>
      </Paper>
    </Fragment>
  );
};

export default withStyles(styles)(EventBanner);
