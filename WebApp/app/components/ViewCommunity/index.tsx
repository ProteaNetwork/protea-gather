/**
 *
 * ViewCommunity
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, InputBase } from '@material-ui/core';
import { Button, Typography, Tabs, Tab, AppBar, Input } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { colors } from 'theme';
import CarouselEvents from 'components/CarouselEvents';
import { IEvent } from 'domain/events/types';
import apiUrlBuilder from 'api/apiUrlBuilder';
import Blockies from 'react-blockies';
import { ICommunity } from 'domain/communities/types';
import dayjs from 'dayjs';
import MembersTab from 'components/MembersTab';
import { IMember } from 'domain/membershipManagement/types';
import classNames from 'classnames';
import SearchIcon from '@material-ui/icons/Search';

const styles = ({ spacing, shape }: Theme) => createStyles({
  root: {
    backgroundColor: colors.proteaBranding.orange,
    "& .slide":{
      position: "relative",
      transitionDuration: "400ms",
      "&.active":{
        opacity: 1,
      },
      "&.hidden":{
        opacity: 0,

      }
    }
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

  },
  filteringSection:{
    padding: 20
  },
  search: {
    position: 'relative',

    borderRadius: shape.borderRadius,
    backgroundColor: colors.white,
    '&:hover': {
      // backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    width: spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: spacing.unit,
    paddingRight: spacing.unit,
    paddingBottom: spacing.unit,
    paddingLeft: spacing.unit * 10,
    width: '100%',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    backgroundColor: colors.proteaBranding.blackBg,
    paddingBottom: 50
  },
  statItem:{
    maxWidth: "calc(50% - 15px)",
    width: "100%",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
    "& > *:first-child":{
      width: "100%",
      textAlign: "center",
      color: colors.white
    },
    "& > *:last-child":{
      width: "100%",
      textAlign: "center",
      padding: "35px 0",
      color: colors.white,
      position: "relative",
      "&:before":{
        content:"''",
        display: 'block',
        borderRadius: 600,
        position: "absolute",
        transform: "translate(-50%, -50%)",
        border: `5px solid ${colors.white}`,
        top: "50%",
        left: "50%",
        width: "90px",
        height: "90px",
      }
    }
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  slideIndex: number;
  daiTxAmount: number;
  balances: any;
  filter: string;
  members: IMember[];
  onCreateEvent(): void;
  handleNameChange(name: any): void;
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
    activeEvents,
    onCreateEvent,
    handleNameChange,
    filter,
    members
  } = props;
  return (
    <Fragment>
      {
        community && (
          <Fragment>
            <AppBar position="static" >
            <div className={classes.infoBar}>
              <Typography variant='h1' className={classes.texts}>{`${community.name ? community.name : ''}`}</Typography>
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
          <section className={classes.root}>
            <SwipeableViews
              index={slideIndex}
              onChangeIndex={handleChangeIndex}>
              <article className={classNames('slide', (slideIndex == 0 ? 'active': 'hidden'))}>
                <section className={classes.bannerImg}>
                  {
                    community.bannerImage && (<img src={apiUrlBuilder.attachmentStream(community.bannerImage)}>
                    </img>)
                  }
                  {
                    !community.bannerImage && (
                    <Blockies
                      seed={community.tbcAddress ? community.tbcAddress : "0x"}
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
                    <Typography className={classes.texts}>Community Token: {community.tokenSymbol ? community.tokenSymbol : ''}</Typography>
                    <Typography className={classes.texts}>Available Stake: {parseFloat(`${community.availableStake ? community.availableStake : 0}`).toFixed(2)}DAI</Typography>
                  </div>
                  <div>
                    <Typography className={classes.texts}>Contribution Rate: {parseFloat(`${community.contributionRate ? community.contributionRate : 0}`).toFixed(0)}%</Typography>
                    <Typography className={classes.texts}>
                      {community.isMember ? `Joined: ${dayjs(community.memberSince).format('YYYY-MM-DD')}` : `Join today!`}
                    </Typography>
                  </div>
                </section>
                <section className={classes.buttonArea}>
                  {!community.isMember && <Button
                    className={classes.buttons}
                    onClick={() => onJoinCommunity(daiTxAmount,community.tbcAddress, community.membershipManagerAddress)}
                    disabled={balances.daiBalance < parseFloat(`${daiTxAmount}`)}
                    size="large">
                    {`Join for ${daiTxAmount}Dai`}
                  </Button>}
                  {community.isMember && <Button
                    className={classes.buttons}
                    disabled={parseFloat(`${balances.daiBalance}`) < parseFloat(`${daiTxAmount}`)}
                    onClick={() => onIncreaseMembership(daiTxAmount,community.tbcAddress, community.membershipManagerAddress)}
                    size="large">
                    {`Increase stake by ${daiTxAmount}Dai`}
                  </Button>}
                  {community.isMember && <Button
                    className={classes.buttons}
                    disabled={community.availableStake < parseFloat(`${daiTxAmount}`)}
                    onClick={() => onWithdrawMembership(daiTxAmount,community.tbcAddress, community.membershipManagerAddress)}
                    size="large">
                    {`Withdraw stake by ${daiTxAmount}Dai`}
                  </Button>}
                  {community.isMember && community.isAdmin && <Button
                    onClick={() => onCreateEvent()}
                    className={classes.buttons}
                    size="large">
                    CREATE EVENT
                  </Button>}
                </section>
                <section className={classes.puchasingSection}>
                  <Input type="number" inputProps={{ min: "1", max: `${balances.daiBalance}`, step: "1" }} onChange={(event) => handleDaiValueChange(event)} value={daiTxAmount} />
                  <Typography className={classes.texts} component="p" variant="subtitle1">
                    Please set the value here
                  </Typography>
                </section>
                <section className={classes.infoBar}>
                  <Typography className={classes.texts} variant='subtitle1'>About Us</Typography>
                  <Typography className={classes.texts}>{community.description}</Typography>
                </section>
              </article>
              <article className={classNames('slide', classes.eventsSection, (slideIndex == 1 ? 'active': 'hidden'))}>
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
              </article>
              <article className={classNames('slide', (slideIndex == 2 ? 'active': 'hidden'))}>
                <section className={classes.filteringSection}>
                    <div className={classes.search}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        placeholder="Search Attendees"
                        classes={{root: classes.inputRoot, input: classes.inputInput }}
                        value={filter}
                        onChange={(event) => handleNameChange(event.target.value)}
                      />
                    </div>
                  </section>
                  {members && members.length === 0 &&
                      <div className={classes.infoBar}>
                        <Typography className={classes.texts}>No members yet!</Typography>
                      </div>
                  }
                  {
                  members && members.length > 0 &&
                  (members.map((member: IMember) => <MembersTab key={member.ethAddress} stateMessage={""} member={member}/>
                    ))
                  }
              </article>
              <article className={classNames('slide', (slideIndex == 3 ? 'active': 'hidden'))}>
                <div className={classes.statsContainer}>
                  <div className={classes.statItem}>
                    <span>
                      Total Supply
                    </span>
                    <div>
                      {parseFloat(`${community.totalSupply}`).toFixed(2)}
                    </div>
                  </div>
                  <div className={classes.statItem}>
                    <span>
                      Gradient
                    </span>
                    <div>
                      1/{parseInt(`${community.gradientDenominator}`)}
                    </div>
                  </div>
                  <div className={classes.statItem}>
                    <span>
                      Pool Balance
                    </span>
                    <div>
                      {parseFloat(`${community.poolBalance}`).toFixed(2)} <br/>DAI
                    </div>
                  </div>
                </div>
              </article>
            </SwipeableViews>
          </section>
        </Fragment>
        )
      }

    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(ViewCommunity);
