/**
 *
 * AttendeeCard
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Theme, Paper, CardMedia } from '@material-ui/core';

const styles = ({ palette, spacing }: Theme) => createStyles({
  card: {
    width: 400,
    height: 400,
  },
  cardContent: {
    backgroundColor: palette.secondary.light,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${spacing.unit * 2}px ${spacing.unit * 2}px ${spacing.unit * 2}px`,
  },
  media: {
    width: 400,
    height: 300,
  },
  header: {
    width: 400,
    height: 20,
  }
});

interface OwnProps {
  classes: any;
  picture: string;
  userName: string;
}

function AttendeeCard(props: OwnProps) {
  const { classes, picture, userName } = props;

  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image= {picture}
            title= {userName} />
          <CardContent className={classes.cardContent}>
            <Typography className={classes.header} variant="h5" component="h2" gutterBottom>
              {userName}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Fragment>
  );
};

export default withStyles(styles)(AttendeeCard);
