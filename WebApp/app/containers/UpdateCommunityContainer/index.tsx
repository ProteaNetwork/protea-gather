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
import { updateCommunityAction } from 'domain/communities/actions';
import { ICommunity } from 'domain/communities/types';
import * as Yup from 'yup';
import { fileSizeValidation, MAX_FILE_SIZE, fileTypeValidation, SUPPORTED_IMAGE_FORMATS } from 'fileManagement';
import CommunityForm from 'components/CommunityForm';
import { RouteComponentProps } from 'react-router';
import { makeSelectCommunity } from './selectors';
import { createStructuredSelector } from 'reselect';

interface RouteParams {
  tbcAddress: string; // must be type string since route params
}

interface OwnProps extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {
  community: ICommunity; // must be type string since route params
}

interface DispatchProps {
  onSubmitUpdateCommunity(data: ICommunity): void
}

interface StateProps {
  pendingTx: boolean
}

type Props = StateProps & DispatchProps & OwnProps;

const UpdateCommunityContainer: React.SFC<Props> = (props: Props) => {
  const {onSubmitUpdateCommunity, pendingTx, community} = props;
  const CommunitySchema = Yup.object().shape({
    name: Yup.string().required("Please provide a name for your community"),
    bannerImage: Yup.mixed().required("Please add a banner image for the community")
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    description: Yup.string().max(240,"240 character limit exceeded").required("A description is required"), // TODO: Add max
    tokenSymbol: Yup.string().max(5, "Please keep the symbol under 5 charactors").required("Please specify a token symbol"),
  })
  return (
    <Formik
      initialValues={{
        ...community
      }}
      validationSchema={CommunitySchema}
      onSubmit={
        (values, actions) => {
          // actions.setSubmitting(pendingTx)
          onSubmitUpdateCommunity(values);
        }
      }
      render={({submitForm}) =>
        <CommunityForm
          submitForm={submitForm}
          isNew={false} />
      }
    />
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onSubmitUpdateCommunity: (data: ICommunity) => {
      dispatch(updateCommunityAction.request(data))
    }
  };
}

const mapStateToProps = createStructuredSelector({  
  community: makeSelectCommunity()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(UpdateCommunityContainer);
