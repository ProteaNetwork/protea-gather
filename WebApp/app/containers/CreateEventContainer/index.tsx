/**
 *
 * CreateEventContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { IEvent } from 'domain/events/types';
import { createEventAction } from 'domain/events/actions';
import * as Yup from 'yup';
import { fileSizeValidation, fileTypeValidation, SUPPORTED_IMAGE_FORMATS, MAX_FILE_SIZE } from 'fileManagement';
import CreateEventForm from 'components/CreateEventForm';
import { Formik } from 'formik';
import { RouteComponentProps } from 'react-router-dom';

interface RouteParams {
  eventManagerAddress: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {

}

interface DispatchProps {
  onSubmitCreateEvent(data: any): void;
}

interface StateProps {
  pendingTx: boolean
}

type Props = StateProps & DispatchProps & OwnProps;

const CreateEventContainer: React.SFC<Props> = (props: Props) => {
  const {onSubmitCreateEvent, pendingTx} = props;
  const nowDate =     (new Date()).getFullYear() + '-' + ((new Date()).getMonth() < 10 ? `0${(new Date()).getMonth()}`: (new Date()).getMonth()) + '-' + ((new Date()).getDate() < 10 ? `0${(new Date()).getDate()}` : (new Date()).getDate() ) +'T' + ((new Date()).getHours() < 10 ? `0${(new Date()).getHours()}` : (new Date()).getHours()) + ':' + ((new Date()).getMinutes() < 10 ? `0${(new Date()).getMinutes()}` : (new Date()).getMinutes());

  const CreateEventSchema = Yup.object().shape({
    name: Yup.string().required("Please provide a name for your event"),
    bannerImage: Yup.mixed().required("Please add a banner image for the event")
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    description: Yup.string().max(240,"240 character limit exceeded").required("A description is required"),
    date: Yup.date(),
    maxAttendees: Yup.number().required(),
    requiredDai: Yup.number().min(1, "Please enter a value 1 or greater").required(),
  })
  return (
    <Formik
      initialValues={{
        name: "",
        bannerImage: "",
        description: "",
        maxAttendees: 0,
        requiredDai: 1,
        eventDate: nowDate,
        eventManagerAddress: props.match.params.eventManagerAddress
      }}
      validationSchema={CreateEventSchema}

      onSubmit={
        (values, actions) => {
          actions.setSubmitting(pendingTx)
          onSubmitCreateEvent(values);
        }
      }

      render={({submitForm}) =>
        <CreateEventForm
          submitForm={submitForm} />
    }
    />
  );
}

const mapDispatchToProps = (
  dispatch: Dispatch,
): DispatchProps => {
  return {
    onSubmitCreateEvent: (data: IEvent) => {
      dispatch(createEventAction.request(data))
    }
  };
};

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(CreateEventContainer);
