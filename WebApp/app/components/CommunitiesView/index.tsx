/**
 *
 * CommunitiesView
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, Tab, Tabs, AppBar } from '@material-ui/core';
import { ICommunity } from 'domain/communities/types';
import SwipeableViews from 'react-swipeable-views';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from '@material-ui/core/InputBase';
import { colors } from 'theme';
import CommunityCard from 'components/CommunityCard';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    slideSection:{

    },
    filteringSection:{
      padding: 20
    },
    search: {
      position: 'relative',

      borderRadius: theme.shape.borderRadius,
      backgroundColor: colors.white,
      '&:hover': {
        // backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
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
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      width: '100%',
    },
    content:{
      padding: 20,
      display: 'flex',
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      "& > *":{
        maxWidth: "calc(50% - 10px)",
        marginBottom: 20
      }
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  slideIndex: number;
  handleSlideChange(event: any, value: any): void;
  handleSlideChangeIndex(index: any): void;
  handleNameChange(name: any): void;
  ethAddress: string;
  myCommunities: ICommunity[];
  discoverCommunities: ICommunity[];
  filter: string;
  classes: any;
}

const CommunitiesView: React.SFC<OwnProps> = (props: OwnProps) => {
  const {
    classes,
    myCommunities,
    discoverCommunities,
    ethAddress,
    slideIndex,
    handleNameChange,
    handleSlideChange,
    handleSlideChangeIndex,
    filter
  } = props;
  return <Fragment>
    {
      (myCommunities && discoverCommunities) &&
      <Fragment>
        <AppBar position="static" >
          <Tabs
            value={slideIndex}
            onChange={handleSlideChange}
            variant="fullWidth" >
            <Tab label="MY COMMUNITIES" />
            <Tab label="DISCOVER COMMUNITIES" />
          </Tabs>
        </AppBar>
        <SwipeableViews
            index={slideIndex}
            onChangeIndex={handleSlideChangeIndex}>
            <section className={classes.slideSection}>
              <section className={classes.filteringSection}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search Communities"
                    classes={{root: classes.inputRoot, input: classes.inputInput }}
                    value={filter}
                    onChange={(event) => handleNameChange(event.target.value)}
                  />
                </div>
              </section>
              <section className={classes.content}>
                {
                  myCommunities && (<Fragment>
                    {myCommunities
                      .map((community: ICommunity) => <CommunityCard
                        availableStake={community.availableStake}
                        bannerImage={community.bannerImage}
                        comLogo={community.comLogo}
                        name={community.name}
                        tbcAddress={community.tbcAddress}
                        key={community.tbcAddress}>

                      </CommunityCard>)
                    }
                  </Fragment>)
                }
              </section>
            </section>
            <section className={classes.slideSection}>
              <section className={classes.filteringSection}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search Communities"
                    classes={{root: classes.inputRoot, input: classes.inputInput }}
                    value={filter}
                    onChange={(event) => handleNameChange(event.target.value)}
                  />
                </div>
              </section>
              <section className={classes.content}>
                {
                  discoverCommunities && (<Fragment>
                    {discoverCommunities
                      .map((community: ICommunity) => <CommunityCard
                        availableStake={community.availableStake}
                        bannerImage={community.bannerImage}
                        comLogo={community.comLogo}
                        name={community.name}
                        tbcAddress={community.tbcAddress}
                        key={community.tbcAddress}>

                      </CommunityCard>)
                    }
                  </Fragment>)
                }
              </section>
            </section>
          </SwipeableViews>
      </Fragment>
    }
  </Fragment>;
};

export default withStyles(styles, { withTheme: true })(CommunitiesView);
