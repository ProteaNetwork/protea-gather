/**
 *
 * ViewCommunity
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper } from '@material-ui/core';
import { Button, Typography, Tabs, Tab, AppBar, Input } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { colors } from 'theme';
import CarouselEvents from 'components/CarouselEvents';
import MembersCarousel from 'components/MembersCarousel';
import { IEvent } from 'domain/events/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import Blockies from 'react-blockies';
import { ICommunity } from 'domain/communities/types';
import dayjs from 'dayjs';
import MembersTab from 'components/MembersTab';
import { IMember } from 'domain/membershipManagement/types';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    backgroundColor: colors.proteaBranding.orange,
    width: 500,
  },
  infoBar: {
    backgroundColor: colors.proteaBranding.blackBg,
    width:'100%',
    color: colors.white,
    paddingTop: spacing.unit * 3,
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
  buttonArea: {
    backgroundColor: colors.proteaBranding.orange,
    padding: spacing.unit * 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  buttons: {
    backgroundColor: colors.proteaBranding.pink,
    flexGrow: 1,
    flexBasis: "40%",
    margin: 5,
  },
  bannerImg: {
    height:'30vh',
    overflow: 'hidden',
    "& > *":{
      width: "100% !important",
      height: "100% !important",
      objectFit: "cover",
      objectPosition: "center"
    }
  },
  puchasingSection:{
    padding: spacing.unit * 2,
    "& > *":{
      width: "100%"
    }
  },
  eventsSection:{
    padding: 20,

  }
});

interface OwnProps extends WithStyles<typeof styles> {
  slideIndex: number;
  daiTxAmount: number;
  balances: any;
  handleChange(event: any, value: any): void;
  handleChangeIndex(index: any): void;
  handleDaiValueChange(event: any): void;
  onIncreaseMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onWithdrawMembership(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  onJoinCommunity(daiValue: number, tbcAddress: string, membershipManagerAddress: string): void;
  community: ICommunity;
  upcomingEvents: IEvent[];
  pastEvents: IEvent[];
  activeEvents: IEvent[];
  classes: any;
}

const ViewCommunity: React.SFC<OwnProps> = (props: OwnProps) => {
  const {
    classes,
    slideIndex,
    handleChange,
    handleChangeIndex,
    community,
    upcomingEvents,
    pastEvents,
    onJoinCommunity,
    daiTxAmount,
    handleDaiValueChange,
    balances,
    onIncreaseMembership,
    onWithdrawMembership,
    activeEvents
  } = props;
  return (
    <Fragment>
      <AppBar position="static" >
        <div className={classes.infoBar}>
          <Typography variant='h1' className={classes.texts}>{`${community.name}`}</Typography>
        </div>
        <Tabs
          value={slideIndex}
          onChange={handleChange}
          variant="fullWidth" >
          <Tab label="ABOUT" />
          <Tab label="EVENTS" />
          <Tab label="MEMBERS" />
          <Tab label="STATS" />
        </Tabs>
      </AppBar>
      <SwipeableViews
        index={slideIndex}
        onChangeIndex={handleChangeIndex}>
        <section>
          <section className={classes.bannerImg}>
            {
              community.bannerImage && (<img src={apiUrlBuilder.attachmentStream(community.bannerImage)}>
              </img>)
            }
            {
              !community.bannerImage && (
              <Blockies
                seed={community.description}
                size={125}
                scale={5}
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
              <Typography className={classes.texts}>Available Stake: {parseFloat(`${community.availableStake}`).toFixed(2)}DAI</Typography>
            </div>
            <div>
              <Typography className={classes.texts}>Contribution Rate: {community.contributionRate}%</Typography>
              <Typography className={classes.texts}>
                {community.isMember ? `Joined: ${dayjs(community.memberSince).format('YYYY-MM-DD')}` : `Join today!`}
              </Typography>
            </div>
          </section>
          <section className={classes.buttonArea}>
            {!community.isMember && <Button
              className={classes.buttons}
              onClick={() => onJoinCommunity(daiTxAmount,community.tbcAddress, community.membershipManagerAddress)}
              size="large">
              {`JOIN for ${daiTxAmount}Dai`}
            </Button>}
            {community.isMember && <Button
              className={classes.buttons}
              onClick={() => onIncreaseMembership(daiTxAmount,community.tbcAddress, community.membershipManagerAddress)}
              size="large">
              {`Increase stake by ${daiTxAmount}Dai`}
            </Button>}
            {community.isMember && <Button
              className={classes.buttons}
              onClick={() => onWithdrawMembership(daiTxAmount,community.tbcAddress, community.membershipManagerAddress)}
              size="large">
              {`Withdraw stake by ${daiTxAmount}Dai`}
            </Button>}
            {community.isAdmin && <Button
              className={classes.buttons}
              size="large">
              CREATE EVENT
            </Button>}
          </section>
          <section className={classes.puchasingSection}>
            <Input type="number" inputProps={{ min: "1", max: `${parseFloat(`${balances.daiBalance}`).toFixed(2)}`, step: "1" }} onChange={(event) => handleDaiValueChange(event)} value={daiTxAmount} />
            <Typography className={classes.texts} component="p" variant="subtitle1">
              Please set the value here
            </Typography>

          </section>
          <section className={classes.infoBar}>
            <Typography className={classes.texts} variant='subtitle1'>About Us</Typography>
            <Typography className={classes.texts}>{community.description}</Typography>
          </section>
        </section>
        <section className={classes.eventsSection}>
          {upcomingEvents.length === 0 ?
            <div className={classes.infoBar}>
              <Typography className={classes.texts}>No upcoming events</Typography>
            </div>
          :
            <CarouselEvents
              // @ts-ignore
              label="UPCOMING EVENTS"
              // @ts-ignore
              events={upcomingEvents} >
            </CarouselEvents>
          }
            <div>
            {activeEvents.length === 0 ?
              <section className={classes.infoBar}>
                <Typography className={classes.texts}>No active events</Typography>
              </section>
            :
              <CarouselEvents
                // @ts-ignore
                label="ACTIVE EVENTS"
                // @ts-ignore
                events={activeEvents} >
              </CarouselEvents>
            }
            </div>
          <div>
            {pastEvents.length === 0 ?
              <div className={classes.infoBar}>
                <Typography className={classes.texts}>No past events</Typography>
              </div>
            :
              <CarouselEvents
                // @ts-ignore
                label="PAST EVENTS"
                // @ts-ignore
                events={pastEvents} >
              </CarouselEvents>
            }
          </div>
        </section>
        <section>
          {community.memberList.length === 0 &&
              <div className={classes.infoBar}>
                <Typography className={classes.texts}>No past events</Typography>
              </div>
          }
          {
             community.memberList.length > 0 &&
             (community.memberList.map((member: IMember) => <MembersTab key={member.ethAddress} stateMessage={""} member={member}/>
              ))
            }
        </section>
        <section>
          <div className={classes.infoBar}>
            <Typography>Stats information is not yet available</Typography>
          </div>
          <div>
            {/** TODO add the buttons for buying and selling inside community */}
          </div>
        </section>
      </SwipeableViews>
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(ViewCommunity);
