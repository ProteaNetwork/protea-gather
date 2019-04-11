/**
 *
 * ViewCommunity
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper } from '@material-ui/core';
import { Button, Typography, Tabs, Tab, AppBar } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { colors } from 'theme';
import Fab from '@material-ui/core/Fab';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    backgroundColor: colors.proteaBranding.orange,
    width: 500,
  },
  infoBar: {
    backgroundColor: colors.proteaBranding.blackBg,
    width:'100%',
    color: colors.white,
    paddingTop: spacing.unit * 2,
    paddingBottom: spacing.unit * 2,
    paddingLeft: spacing.unit * 2,
    paddingRight: spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& > *': {
      color: colors.white,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
  texts: {
    color: colors.white,
  },
  joinBar: {
    backgroundColor: colors.proteaBranding.orange,
    paddingTop: spacing.unit * 4,
    paddingBottom: spacing.unit * 4,
    paddingLeft: spacing.unit * 2,
    paddingRight: spacing.unit * 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    
  },
  joinBut: {
    backgroundColor: colors.proteaBranding.pink,

  }
});

interface OwnProps extends WithStyles<typeof styles> {
  value: number;
  handleChange(event: any, value: any): void;
  handleChangeIndex(index: any): void;
  daiBalance: number;
  daiStake: number;
  member: number;
  createdDate: string;
}

const ViewCommunity: React.SFC<OwnProps> = (props: OwnProps) => {
  const {
    classes, 
    value, 
    handleChange, 
    handleChangeIndex, 
    daiBalance,
    daiStake,
    member,
    createdDate,
  } = props;

  return (
    <Fragment>
      <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="ABOUT" />
            <Tab label="EVENTS" />
            <Tab label="MEMBERS" />
            <Tab label="STATS" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={value}
          onChangeIndex={handleChangeIndex}
        >
{/** ABOUT */}
        {value === 0 ? 
          <section>
            <section className={classes.infoBar}>
              <div>
                <Typography className={classes.texts}>Membership {daiBalance} DAI</Typography>
                <Typography className={classes.texts}>Commitment {daiStake} DAI</Typography>
              </div>
              <div>
                <Typography className={classes.texts}>Members {member}</Typography>
                <Typography className={classes.texts}>Created {createdDate}</Typography>
              </div>
            </section>
            <section className={classes.joinBar}>
              <Fab 
                className={classes.joinBut}
                size="large">
                JOIN
              </Fab>
            </section>
          </section>
        : 
          <section>
            <label >Image</label>
          </section>
        }
        {/** EVENTS */}
          <div>

          </div>
        {/** MEMBERS */}
          <div>

          </div>
        {/** STATS */}
          <div>

          </div>
        </SwipeableViews>
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(ViewCommunity);
