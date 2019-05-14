/**
 *
 * CommunityForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, FormControl, Button, Paper, CircularProgress, Fab } from '@material-ui/core';
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import UploadImageField from 'components/UploadImageField';
import { colors } from 'theme';
import { ArrowBack } from '@material-ui/icons';
import { goBack } from 'utils/history';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    background:{
      display: "block",
      backgroundColor: colors.proteaBranding.black,
      height: "100%",
      width: "100%",
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
    }
  });

interface OwnProps extends WithStyles<typeof styles> {
  isNew: boolean;
  submitForm(data): void;
}

const CommunityForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { submitForm, classes, isNew } = props;
  return (
    <div className={classes.background}>
      <Paper square={true} className={classes.paperRoot} elevation={0}>
        <Form className={classes.formRoot}>
          <Typography className={classes.heading} component="h1" variant="h1">
            {(isNew) ? "Create a community" : "Update Community Metadata"}
          </Typography>
          <FormControl>
            <Typography className={classes.subHeading} component="h4" variant="h4">
              Community banner
            </Typography>
            <Field component={UploadImageField} name="bannerImage"  />
          </FormControl>
          <FormControl>
            <Field name="name" label="Name:" component={TextField} disabled={!isNew} />
          </FormControl>
          <FormControl>
            <Field name="tokenSymbol" label="Token Symbol:" component={TextField} disabled={!isNew} />
          </FormControl>
          <FormControl className={(!isNew) ? classes.hiddenFormControl : undefined}>
            <Field name="contributionRate" type="number" label="Community contribution rate:"  component={TextField}/>
          </FormControl>
          <FormControl className={(!isNew) ? classes.hiddenFormControl : undefined}>
            <Field name="reputationForAttendance" type="number" label="Reputation points for attendance"  component={TextField}/>
          </FormControl>
          <FormControl>
            <Field
              component={TextField}
              label="Description:"
              name="description"
              multiline
              rows="5"
              rowsMax="12"
            />
          </FormControl>
          <Field name="gradientDenominator" type="hidden" />
          <Field name="tbcAddress" type="hidden" />
          <div>
            <Button className={classes.submitButton} onClick={submitForm}>
              {(isNew) ? "Publish community" : "Update community"}
            </Button>
          </div>
        </Form>
      </Paper>
      <div className={classes.backFab} onClick={() => goBack()}>
        <Fab>
          <ArrowBack />
        </Fab>
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(CommunityForm);
