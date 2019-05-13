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
import EventForm from 'components/EventForm';
import { Formik } from 'formik';
import { RouteComponentProps } from 'react-router-dom';
import dayjs from 'dayjs';

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
  const {onSubmitCreateEvent, pendingTx, match: {params: {eventManagerAddress}}} = props;

  const CreateEventSchema = Yup.object().shape({
    name: Yup.string().required("Please provide a name for your event"),
    bannerImage: Yup.mixed().required("Please add a banner image for the event")
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    description: Yup.string().max(240,"240 character limit exceeded").required("A description is required"),
    eventDate: Yup.date().min(dayjs().format('YYYY-MM-DD'), 'Event must be in the future'),
    eventTime: Yup.mixed().required(),
    maxAttendees: Yup.number().required().integer(),
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
        eventDate: dayjs().format('YYYY-MM-DD'),
        eventTime: dayjs().format('HH:mm'),
        eventManagerAddress: eventManagerAddress
      }}
      validationSchema={CreateEventSchema}
      onSubmit={
        (values, actions) => {
          values.eventDate = `${values.eventDate} ${values.eventTime}`;
          actions.setSubmitting(pendingTx)
          onSubmitCreateEvent(values);
        }
      }

      render={({submitForm}) =>
        <EventForm
          submitForm={submitForm}
          isNew={true} />
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
