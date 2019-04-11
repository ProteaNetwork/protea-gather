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
import CarouselEvents from 'components/CarouselEvents';
import { IEvent } from 'domain/events/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import Blockies from 'react-blockies';
import { ICommunity } from 'domain/communities/types';

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
    paddingLeft: spacing.unit * 4,
    paddingRight: spacing.unit * 4,
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
    paddingTop: spacing.unit * 2,
    paddingBottom: spacing.unit * 2,
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
  community: ICommunity;
}

const ViewCommunity: React.SFC<OwnProps> = (props: OwnProps) => {
  const {
    classes, 
    value, 
    handleChange, 
    handleChangeIndex, 
    community,
  } = props;

  return (
    <Fragment>
      <AppBar position="static" color="default">
        <section className={classes.infoBar}>
          <Typography variant='h1' className={classes.texts}>{community.name}</Typography>
        </section>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor={colors.proteaBranding.blackBg}
            textColor={colors.white}
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
            <section>
              {
                community.bannerImage && (<img src={apiUrlBuilder.attachmentStream(community.bannerImage)}>
                </img>)
              }
              {
                !community.bannerImage && (
                  <Blockies
                  seed={community.description}
                  size={500}
                  scale={2}
                  color={colors.proteaBranding.orange}
                  bgColor={colors.white}
                  spotColor={colors.proteaBranding.pink}
                />
                )
              }
            </section>
            <section className={classes.infoBar}>
              <div>
                <Typography className={classes.texts}>Community Token: {community.tokenSymbol}</Typography>
                <Typography className={classes.texts}>Available Stake: {community.availableStake}</Typography>
              </div>
              <div>
                <Typography className={classes.texts}>Contribution Rate: {community.contributionRate}%</Typography>
                <Typography className={classes.texts}>{community.isMember ? `Joined: ${community.memberSince.toDateString()}` : `Join today`}</Typography>
              </div>
            </section>
            <section className={classes.joinBar}>
              <Fab 
                className={classes.joinBut}
                size="large">
                JOIN
              </Fab>
            </section>
            <section className={classes.infoBar}>
              <Typography className={classes.texts} variant='subtitle1'>About Us</Typography>
              <Typography className={classes.texts}>{community.description}</Typography>
            </section>
            <section>
             <CarouselEvents
                // @ts-ignore
                label="UPCOMING EVENTS"
                // @ts-ignore
                events={upcomingEvents} >
              </CarouselEvents>
              <CarouselEvents
                // @ts-ignore
                label="PAST EVENTS"
                // @ts-ignore
                events={upcomingEvents} >
              </CarouselEvents>
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
