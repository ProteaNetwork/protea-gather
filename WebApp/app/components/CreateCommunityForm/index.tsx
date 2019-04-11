/**
 *
 * CreateCommunityForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, FormControl, Button, Paper, CircularProgress } from '@material-ui/core';
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import UploadImageField from 'components/UploadImageField';
import { colors } from 'theme';

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
    publishButton:{
      margin: "0 auto",
      display: 'block'
    },

  });

interface OwnProps extends WithStyles<typeof styles> {
  submitForm(data): void;
}

const CreateCommunityForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { submitForm, classes } = props;
  return (
    <div className={classes.background}>
      <Paper square={true} className={classes.paperRoot} elevation={0}>
        <Form className={classes.formRoot}>
          <Typography className={classes.heading} component="h1" variant="h1">
            Create a community
          </Typography>
          <FormControl>
            <Typography className={classes.subHeading} component="h4" variant="h4">
              Community banner
            </Typography>
            <Field component={UploadImageField} name="bannerImage"  />
          </FormControl>
          <FormControl>
            <Field name="name" label="Name:" component={TextField}/>
          </FormControl>
          <FormControl>
            <Field name="tokenSymbol" label="Token Symbol:" component={TextField}/>
          </FormControl>
          <FormControl>
            <Field name="contributionRate" type="number" label="Community contribution rate:"  component={TextField}/>
          </FormControl>
          <FormControl>
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
          <div>
            <Button className={classes.publishButton} onClick={submitForm}>
              Publish community
            </Button>
          </div>
        </Form>
      </Paper>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(CreateCommunityForm);