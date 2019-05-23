/**
 *
 * ProfileForm
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Button, FormControl, Typography, Input, CircularProgress } from '@material-ui/core';
import { colors } from 'theme';
import { Form, Field } from 'formik';
import UploadImageField from 'components/UploadImageField';
import { TextField } from 'formik-material-ui';
import classNames from 'classnames';
import { Done, Clear } from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
      // JSS in CSS goes here
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
      }
  });

interface OwnProps extends WithStyles<typeof styles> {
  pendingState: string;
  submitForm(data): void;
}

const ProfileForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { submitForm, classes, pendingState } = props;
  return (<div className={classNames(classes.background, `${pendingState}`)}>
    <div className={classNames(classes.stateModal, `${pendingState}`)}>
      <div>
        { pendingState == "request" && <CircularProgress color={"inherit"} size={80}></CircularProgress>}
        { pendingState == "failure" && <Clear color={"inherit"} ></Clear>}
        { pendingState == "success" && <Done color={"inherit"} ></Done>}
      </div>
    </div>
    <Paper square={true} className={classes.paperRoot} elevation={0}>
      <Form className={classes.formRoot}>
        <Typography className={classes.heading} component="h1" variant="h1">
          Update your Profile
        </Typography>
        <FormControl>
          <Typography className={classes.subHeading} component="h4" variant="h4">
            Profile Image
          </Typography>
          <div className={classes.imageUpload}>
            <Field className={classes.imageUpload} component={UploadImageField} name="profileImage"  />
          </div>
        </FormControl>
        <FormControl>
          <Field name="displayName" label="Name:" component={TextField} />
        </FormControl>
        <div>
          <Button className={classes.submitButton} onClick={submitForm}>
            Update Profile
          </Button>
        </div>
      </Form>
    </Paper>
  </div>);
};

export default withStyles(styles, { withTheme: true })(ProfileForm);
