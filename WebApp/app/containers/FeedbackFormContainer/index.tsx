/**
 *
 * FeedbackFormContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import FeedbackForm from 'components/FeedbackForm';
import * as Yup from 'yup';
import { blockchainResources } from 'blockchainResources';
import { Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import selectPendingResponse from './selectors';
import { sendFeedbackAction } from 'domain/userProfile/actions';

interface OwnProps {}

interface DispatchProps {
  onSubmitSendFeedback(data: {address: string, feedback: string, browser: string}): void;
}

interface StateProps {
  pendingResponse: string
}

type Props = StateProps & DispatchProps & OwnProps;

const FeedbackFormContainer: React.SFC<Props> = (props: Props) => {
  const { onSubmitSendFeedback, pendingResponse } = props;
  const SendFeedbackSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    feedback: Yup.string().required("Please provide your feedback.").max(20000,"20000 character limit exceeded"),
    browser: Yup.string().required("Please provide indicate what browser you're using.").max(100,"100 character limit exceeded"),
  })
  return <Formik
    initialValues={{
      address: blockchainResources.signerAddress,
      feedback: "",
      browser: ""
    }}
    validationSchema={SendFeedbackSchema}
    onSubmit={
      (values, actions) => {
        actions.setSubmitting(true)
        onSubmitSendFeedback(values);
      }
    }
    render={({submitForm}) =>
      <FeedbackForm
        pendingState={pendingResponse}
        submitForm={submitForm}
        />
    }
  />
};

const mapStateToProps = createStructuredSelector({
  pendingResponse: selectPendingResponse
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSubmitSendFeedback: (data: {address: string, feedback: string, browser: string}) => {
      dispatch(sendFeedbackAction.request(data))
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FeedbackFormContainer);
