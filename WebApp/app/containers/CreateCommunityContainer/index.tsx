/**
 *
 * CreateCommunityContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { Paper } from '@material-ui/core';
import { Formik } from 'formik';
import { createCommunityAction } from 'domain/communities/actions';
import { ICommunity } from 'domain/communities/types';
import * as Yup from 'yup';
import { fileSizeValidation, MAX_FILE_SIZE, fileTypeValidation, SUPPORTED_IMAGE_FORMATS } from 'fileManagement';
import CommunityForm from 'components/CommunityForm';

interface OwnProps {}

interface DispatchProps {
  onSubmitCreateCommunity(data: any): void
}

interface StateProps {
  pendingTx: boolean
}

type Props = StateProps & DispatchProps & OwnProps;

const CreateCommunityContainer: React.SFC<Props> = (props: Props) => {
  const {onSubmitCreateCommunity, pendingTx} = props;
  const CreateCommunitySchema = Yup.object().shape({
    name: Yup.string().required("Please provide a name for your community"),
    bannerImage: Yup.mixed()
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    description: Yup.string().max(2000,"2000 character limit exceeded"),
    tokenSymbol: Yup.string().max(5, "Please keep the symbol under 5 charactors").required("Please specify a token symbol"),
    contributionRate: Yup.number().integer("Please use whole numbers").min(0, "Please use non-negative numbers").max(90, "Contribution rate is maxed at 90%").required("Please specify a contribution rate"),
    gradientDenominator: Yup.number().required(),
    reputationForAttendance: Yup.number().required()
  })
  return (
    <Formik
      initialValues={{
        name: "",
        bannerImage: "",
        description: "",
        tokenSymbol: "",
        contributionRate: 10,
        gradientDenominator: 2000,
        reputationForAttendance: 100
      }}
      validationSchema={CreateCommunitySchema}

      onSubmit={
        (values, actions) => {
          actions.setSubmitting(pendingTx)
          onSubmitCreateCommunity(values);
        }
      }

      render={({submitForm}) =>
        <CommunityForm
          submitForm={submitForm}
          isNew={true} />
      }
    />
  );
};


function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSubmitCreateCommunity: (data: ICommunity) => {
      dispatch(createCommunityAction.request(data))
    }
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(CreateCommunityContainer);
