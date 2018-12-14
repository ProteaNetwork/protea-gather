/**
 *
 * CommunityDescription
 *
 */

import React, { Fragment } from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const styles = theme => createStyles({
  paper: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
});

interface OwnProps {
  classes: any;
  description: string;
}

function CommunityDescription(props: OwnProps) {
  const { classes, description } = props;

  return (
      <Fragment>
        <Paper className={classes.paper}>
          <Typography variant='body1'>
            {description}
          </Typography>
        </Paper>
    </Fragment>
  );
};

export default withStyles(styles)(CommunityDescription);
