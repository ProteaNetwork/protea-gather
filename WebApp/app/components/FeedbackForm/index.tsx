/**
 *
 * FeedbackForm
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Button, Typography, FormControl, Fab, CircularProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { Form, Field } from 'formik';
import { colors } from 'theme';
import { ArrowBack, Done, Clear } from '@material-ui/icons';
import { goBack } from 'utils/history';
import classNames from 'classnames';

const styles = (theme: Theme) =>
  createStyles({
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
    subHeading: {
      color: colors.white,
      margin: "15px 0"
    },
    formRoot: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    },
    publishButton: {
      margin: "0 auto",
      display: 'block'
    },
    backFab: {
      display: 'block',
      position: 'fixed',
      bottom: -15,
      left: 35,
      transform: 'translate(-50%,-50%)',
      zIndex: 999,
      cursor: "pointer",
      "& > *":{
        color: colors.white,
        backgroundColor: colors.proteaBranding.pink,
        "&:hover":{
          backgroundColor: colors.proteaBranding.pink,
        }
      },
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
    intro:{
      color: colors.white
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  pendingState: string;
  submitForm(data): void;
}

const FeedbackForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { submitForm, classes, pendingState } = props;

  return (
    <section className={classNames(classes.background, `${pendingState}`)}>
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
            Beta Feedback
          </Typography>
          <Typography className={classes.intro} component="p" variant="body1">
            Protea Gather is currently in Beta. <br/>
            We'd love to hear from you if you have any improvements to suggests or bugs to report.
          </Typography>
          <FormControl>
            <Field name="browser" label="Which browser are you using" type="text" component={TextField} />
          </FormControl>
          <Field name="address" type="hidden" />
          <FormControl>
            <Field
              component={TextField}
              label="Feedback:"
              name="feedback"
              multiline
              rows="5"
              rowsMax="12"
            />
          </FormControl>
          <div>
            <Button className={classes.publishButton} onClick={submitForm}>
              Send feedback
            </Button>
          </div>
        </Form>
      </Paper>
      <div className={classes.backFab} onClick={() => goBack()}>
        <Fab>
          <ArrowBack />
        </Fab>
      </div>
    </section>
  );
};

export default withStyles(styles, { withTheme: true })(FeedbackForm);
