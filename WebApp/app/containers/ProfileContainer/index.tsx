/**
 *
 * ProfileContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import makeSelectProfileContainer from './selectors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { fileSizeValidation, MAX_FILE_SIZE, fileTypeValidation, SUPPORTED_IMAGE_FORMATS } from 'fileManagement';
import ProfileForm from 'components/ProfileForm';
import { setUserProfile } from 'domain/userProfile/actions';
import selectProfileDomain from './selectors';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { IMember } from 'domain/membershipManagement/types';

interface OwnProps {}

interface DispatchProps {
  onUpdateProfile(data: any): void;
}

interface StateProps {
  profileData: IMember | any
}

type Props = StateProps & DispatchProps & OwnProps;

const ProfileContainer: React.SFC<Props> = (props: Props) => {
  const {onUpdateProfile, profileData} = props;
  const UpdateProfileSchema = Yup.object().shape({
    profileImage: Yup.mixed()
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    displayName: Yup.string(),

  })
  return <Formik
    initialValues={{
      profileImage: profileData.profileImage,
      displayName: profileData.displayName,
    }}
    validationSchema={UpdateProfileSchema}
    onSubmit={
      (values) => {
        onUpdateProfile(values)
      }
    }
    render={({submitForm}) =>
      <ProfileForm pendingState={profileData.pendingResponse} submitForm={submitForm}/>
    }
  >
  </Formik>;
};

const mapStateToProps = createStructuredSelector({
  profileData: selectProfileDomain
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onUpdateProfile: (data: IMember) =>{
      dispatch(setUserProfile.request(data))
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(ProfileContainer);
