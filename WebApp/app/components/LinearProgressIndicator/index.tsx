/**
 *
 * LinearProgressIndicator
 *
 */

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

const styles = ({ spacing, breakpoints }: Theme) => createStyles({
  indicator: {
    flexGrow: 1,
  },
});

interface OwnProps extends WithStyles<typeof styles> {
  active: boolean;
}

const LinearProgressIndicator: React.SFC<OwnProps> = (props: OwnProps) => {
  const { classes, active } = props;
  return (
    <React.Fragment>
      {active &&
        <div className={classes.indicator}>
          <LinearProgress color="secondary" />
        </div>
      }
    </React.Fragment>
  );
};

export default withStyles(styles)(LinearProgressIndicator);
