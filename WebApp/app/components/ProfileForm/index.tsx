/**
 *
 * ProfileForm
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Button, FormControl, Typography, Input, CircularProgress, AppBar, Tab, Tabs } from '@material-ui/core';
import { colors } from 'theme';
import { Form, Field } from 'formik';
import UploadImageField from 'components/UploadImageField';
import { TextField } from 'formik-material-ui';
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import { Done, Clear } from '@material-ui/icons';
import { blockchainResources } from 'blockchainResources';
import { ICommunity } from 'domain/communities/types';
import { Link } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
      // JSS in CSS goes here
      root: {
        backgroundColor: colors.proteaBranding.orange,
      },
      background:{
        display: "block",
        backgroundColor: colors.proteaBranding.black,
        height: "100%",
        width: "100%",
        position: "relative"
      },
      paperRoot: {
        backgroundColor: colors.proteaBranding.black,
        color: colors.white,
        maxWidth: 500,
        margin: "0 auto"
      },
      heading: {
        color: colors.white,
        margin: "15px 0"
      },
      subHeading:{
        color: colors.white,
        margin: "15px 0"
      },
      formRoot: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      },
      submitButton:{
        margin: "0 auto",
        display: 'block'
      },
      hiddenFormControl: {
        display: 'none',
      },
      imageUpload: {
        "& > *:first-child": {
          height: "30vh",
        }
      },
      stateModal: {
        transitionDuration: "400ms",
        color: colors.proteaBranding.pink,
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        zIndex: 99999999,
        opacity: 1,
        visibility: "visible",
        transitionProperty: "opacity, visibility",
        "&::before": {
          content: '""',
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: colors.proteaBranding.orange,
          zIndex: -1,
          opacity: 0.5
        },
        "& > *":{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: "50%",
            left: "50%",
            height: "100vh",
            width: "100vw",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(ellipse at center, ${colors.proteaBranding.orange} 0%,rgba(242,162,2,0) 80%)`,
            zIndex: -1,
            opacity: 0.8
          },
          "& > svg":{
            height: "10vh",
            width: "10vh",
          }
        },
        "&.ready":{
          opacity: 0,
          visibility: "hidden"
        },
        "&.success":{
          color: colors.proteaBranding.green
        },
        "&.failure":{
          color: colors.proteaBranding.red
        },
        "&.request":{
        },
      },
      slide:{
        transitionDuration: "400ms",
        "&.hidden":{
          height: 0,
          // opacity: 0,
        },
        "&.active": {
          // opacity: 1,
          height: "auto"
        }
      },
      address:{
        display: "inline-block",
        textOverflow: "ellipsis",
        width: "100%",
        overflow: "hidden",
        opacity: 0.5
      },
      mainBalances:{
        padding: 20,
        display: "flex",
        flexDirection: "row",
        flexWrap:"wrap",
        textAlign: "left",
        "& > *": {
          width: "50%",
          marginBottom: 15
        }
      },
      communitiesBalances:{
        display: "flex",
        flexWrap: "wrap",
        "& > *":{
          borderTop: "1px solid white",
          padding: 20,
          display:"flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          "&:last-child":{
            borderBottom: "1px solid white",
          },
          "& > *:first-child":{
            maxWidth: "30%",
            textOverflow: "ellipsis",
            overflowX: "hidden",
            whiteSpace: "nowrap",
          
          },
          "& > * ": {
            flexGrow: 1,
            flexBasis: 100,
            
          }
        }
      },
      communityButton:{
        textDecoration:"none",
        "&:hover": {
          textDecoration:"none",
        }
      },
      communityStake:{
        textAlign: "center"
      }
  });

interface OwnProps extends WithStyles<typeof styles> {
  pendingState: string;
  slideIndex: number;
  communities: ICommunity[];
  daiBalance: number;
  totalStaked: number;
  handleChange(event: any, value: any): void;
  handleChangeIndex(index: any): void;
  submitForm(data): void;
}

const ProfileForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { communities, daiBalance, submitForm, handleChange, handleChangeIndex, slideIndex, classes, pendingState, totalStaked } = props;
  return (<div className={classNames(classes.background, `${pendingState}`)}>
    <div className={classNames(classes.stateModal, `${pendingState}`)}>
      <div>
        { pendingState == "request" && <CircularProgress color={"inherit"} size={80}></CircularProgress>}
        { pendingState == "failure" && <Clear color={"inherit"} ></Clear>}
        { pendingState == "success" && <Done color={"inherit"} ></Done>}
      </div>
    </div>
      <AppBar position="static" >
        <Tabs
          value={slideIndex}
          onChange={handleChange}
          variant="fullWidth" >
          <Tab label="MY INFO" />
          <Tab label="MY BALANCES" />
        </Tabs>
      </AppBar>
      <section className={classes.root}>
        <SwipeableViews
          index={slideIndex}
          onChangeIndex={handleChangeIndex}>
            <article className={classNames(classes.slide, (slideIndex == 0 ? 'active': 'hidden'))}>
              <Paper square={true} className={classes.paperRoot} elevation={0}>
                <Form className={classes.formRoot}>
                  <Typography className={classes.heading} component="h1" variant="h1">
                    My Profile
                  </Typography>
                  <FormControl>
                    <span className={classes.address}>
                      My address: {blockchainResources.signerAddress}
                    </span>
                    <Typography className={classes.subHeading} component="h4" variant="h4">
                      Profile Image
                    </Typography>
                    <div className={classes.imageUpload}>
                      <Field className={classes.imageUpload} component={UploadImageField} name="profileImage"  />
                    </div>
                  </FormControl>
                  <FormControl>
                    <Field name="displayName" label="My Name:" component={TextField} />
                  </FormControl>
                  <div>
                    <Button className={classes.submitButton} onClick={submitForm}>
                      Update
                    </Button>
                  </div>
                </Form>
              </Paper>
            </article>
            <article className={classNames(classes.slide, (slideIndex == 1 ? 'active': 'hidden'))}>
              <Paper square={true} className={classes.paperRoot} elevation={0}>
                <section>
                  <article className={classes.mainBalances}>
                    <span>
                      Total DAI:
                    </span>
                    <span>
                      {
                        (parseFloat(`${
                          totalStaked
                        }`) + parseFloat(`${daiBalance}`)).toFixed(2)
                      } DAI
                    </span>
                    <span>
                      Uncommited DAI:
                    </span>
                    <span>
                      {parseFloat(`${daiBalance}`).toFixed(2)} DAI
                    </span>
                    <span>
                      Total commited DAI:
                    </span>
                    <span>
                      {parseFloat(`${totalStaked}`).toFixed(2)} DAI
                    </span>
                  </article>
                  <article className={classes.communitiesBalances}>
                    { communities && (<Fragment>
                      {
                        communities.map((community: ICommunity) =>
                          <div key={community.tbcAddress}>
                            <span>
                              {community.name}
                            </span>
                            <span className={classes.communityStake}>
                              {parseFloat(`${community.availableStake}`).toFixed(2)} DAI
                            </span>
                            <Link className={classes.communityButton} to={`/communities/${community.tbcAddress}`}>
                              <Button>
                                Details
                              </Button>
                            </Link>
                          </div>
                        )
                      }
                    </Fragment>)}
                  </article>
                </section>
              </Paper>
            </article>
        </SwipeableViews>
      </section>
  </div>);
};

export default withStyles(styles, { withTheme: true })(ProfileForm);
