/**
 *
 * CreateEventForm
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

const CreateEventForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { submitForm, classes } = props;
  return (
    <div className={classes.background}>
      <Paper square={true} className={classes.paperRoot} elevation={0}>
        <Form className={classes.formRoot}>
          <Typography className={classes.heading} component="h1" variant="h1">
            Create an event
          </Typography>
          <FormControl>
            <Typography className={classes.subHeading} component="h4" variant="h4">
              Event banner
            </Typography>
            <Field component={UploadImageField} name="bannerImage"  />
          </FormControl>
          <FormControl>
            <Field name="name" label="Name:" component={TextField}/>
          </FormControl>
          <FormControl>
            <Field name="maxAttendees" label="Maximum attendees (0 for unlimited):" type="number" component={TextField}/>
          </FormControl>
          <FormControl>
            <Field name="requiredDai" label="Required Dai deposit:" type="number" component={TextField}/>
          </FormControl>
          <FormControl>
            <Field
              component={TextField}
              label="Event date:"
              type="datetime-local"
              name="eventDate"
            />
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
          <Field name="eventManagerAddress" type="hidden" />
          <div>
            <Button className={classes.publishButton} onClick={submitForm}>
              Publish event
            </Button>
          </div>
        </Form>
      </Paper>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(CreateEventForm);
