/**
 *
 * ProfileForm
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, Button, FormControl, Typography, Input } from '@material-ui/core';
import { colors } from 'theme';
import { Form, Field } from 'formik';
import UploadImageField from 'components/UploadImageField';
import { TextField } from 'formik-material-ui';

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
      imageUpload: {
        "& > *:first-child": {
          height: "30vh",
        }
      }

  });

interface OwnProps extends WithStyles<typeof styles> {
  submitForm(data): void;
}

const ProfileForm: React.SFC<OwnProps> = (props: OwnProps) => {
  const { submitForm, classes } = props;
  return (<div className={classes.background}>
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
