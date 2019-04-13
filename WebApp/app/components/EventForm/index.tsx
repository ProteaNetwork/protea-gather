/**
 *
 * CreateEventForm
 *
 */

import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Typography, FormControl, Button, Paper, CircularProgress, Grid } from '@material-ui/core';
import { Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import UploadImageField from 'components/UploadImageField';
import { colors } from 'theme';
import dayjs from 'dayjs';

const styles = (theme: Theme) =>
  createStyles({
    // JSS in CSS goes here
    background: {
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

  });

interface OwnProps extends WithStyles<typeof styles> {
  isNew: boolean;
  submitForm(data): void;
}

const EventForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { submitForm, classes, isNew } = props;
  return (
    <div className={classes.background}>
      <Paper square={true} className={classes.paperRoot} elevation={0}>
        <Form className={classes.formRoot}>
          <Typography className={classes.heading} component="h1" variant="h1">
            {(isNew) ? "Create an event" : "Update event metadata"}
          </Typography>
          <FormControl>
            <Typography className={classes.subHeading} component="h4" variant="h4">
              Event banner
            </Typography>
            <Field component={UploadImageField} name="bannerImage" />
          </FormControl>
          <FormControl>
            <Field name="name" label="Name:" component={TextField} disabled={!isNew} />
          </FormControl>
          <FormControl>
            <Field
              name="maxAttendees"
              label="Maximum attendees (0 for unlimited):"
              type="number"
              component={TextField}
              InputProps={{
                inputProps: {
                  min: 0,
                  step: 1,
                }
              }} />
          </FormControl>
          <FormControl>
            <Field name="requiredDai" label="Required Dai deposit:" type="number" component={TextField} disabled={!isNew} />
          </FormControl>
          <Grid container>
            <Grid item xs={7}>
              <Field
                component={TextField}
                InputProps={{
                  inputProps: {
                    min: dayjs().format('YYYY-MM-DD')
                  }
                }}
                label="Event date:"
                type="date"
                name="eventDate" />
            </Grid>
            <Grid item xs={5}>
              <Field
                component={TextField}
                label="Event time:"
                type="time"
                name="eventTime"
                fullWidth />
            </Grid>
          </Grid>
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
          <div>
            <Button className={classes.publishButton} onClick={submitForm}>
              {(isNew) ? "Publish event" : "Update event"}
            </Button>
          </div>
        </Form>
      </Paper>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(EventForm);
