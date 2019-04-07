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
import CreateCommunityForm from 'components/CreateCommunityForm';
import selectCreateCommunityState from './selectors';


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
    bannerImage: Yup.mixed().required("Please add a banner image for the community")
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    description: Yup.string().max(240,"240 character limit exceeded").required("A description is required"), // TODO: Add max
    tokenSymbol: Yup.string().max(5, "Please keep the symbol under 5 charactors").required("Please specify a token symbol"),
    contributionRate: Yup.number().required("Please specify a contribution rate"),
    gradientDenominator: Yup.number().required(),
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
      }}
      validationSchema={CreateCommunitySchema}

      onSubmit={
        (values, actions) => {
          actions.setSubmitting(pendingTx)
          onSubmitCreateCommunity(values);
        }
      }

      render={({submitForm}) =>
        <CreateCommunityForm
          submitForm={submitForm} />
      }
    />
  );
};

const mapStateToProps = selectCreateCommunityState;

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSubmitCreateCommunity: (data: ICommunity) => {
      dispatch(createCommunityAction.request(data))
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(CreateCommunityContainer);
