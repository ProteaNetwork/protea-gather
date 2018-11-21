import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Theme, Paper } from '@material-ui/core';

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
});

function LandingPage(props) {
  const { classes } = props;

  return (
  <Fragment>
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography variant='h1'>Dashboard Stuffs</Typography>
      </Paper>
    </main>
  </Fragment>
  )
}

export default withStyles(styles, { withTheme: true })(LandingPage);
