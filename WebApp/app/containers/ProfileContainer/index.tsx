/**
 *
 * ProfileContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, Dispatch } from 'redux';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { fileSizeValidation, MAX_FILE_SIZE, fileTypeValidation, SUPPORTED_IMAGE_FORMATS } from 'fileManagement';
import ProfileForm from 'components/ProfileForm';
import { setUserProfile } from 'domain/userProfile/actions';
import selectProfileDomain from './selectors';
import apiUrlBuilder from 'api/apiUrlBuilder';
import { IMember } from 'domain/membershipManagement/types';
import { selectMyCommunties, selectTotalStaked } from 'domain/communities/selectors';
import { ICommunity } from 'domain/communities/types';
import { makeDaiBalance } from 'containers/App/selectors';

interface OwnProps {}

interface DispatchProps {
  onUpdateProfile(data: any): void;
}

interface StateProps {
  profileData: IMember | any,
  communities: ICommunity[],
  daiBalance: number,
  totalStaked: number,
}

type Props = StateProps & DispatchProps & OwnProps;

class ProfileContainer extends React.Component<Props> {
  state = {
    slideIndex: 0,
  };

  handleChange = (event, slideIndex) => {
    this.setState({ slideIndex });
  };

  handleChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  render() {
    const {onUpdateProfile, profileData, communities, daiBalance, totalStaked} = this.props;
    const UpdateProfileSchema = Yup.object().shape({
      profileImage: Yup.mixed()
        .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
        .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
      displayName: Yup.string(),
    })
    return (<Formik
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
        <ProfileForm 
          daiBalance={daiBalance} 
          communities={communities} 
          slideIndex={this.state.slideIndex} 
          handleChange={this.handleChange} 
          handleChangeIndex={this.handleChangeIndex} 
          pendingState={profileData.pendingResponse} 
          totalStaked={totalStaked}
          submitForm={submitForm}/>
      }
      >
    </Formik>);
  }
};

const mapStateToProps = createStructuredSelector({
  profileData: selectProfileDomain,
  communities: selectMyCommunties,
  daiBalance: makeDaiBalance,
  totalStaked: selectTotalStaked,
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
