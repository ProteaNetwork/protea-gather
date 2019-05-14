/**
 *
 * CreateEventContainer
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { RouteComponentProps } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import dayjs from 'dayjs';

import { IEvent } from 'domain/events/types';
import { updateEventAction, changeEventLimitAction } from 'domain/events/actions';
import { fileSizeValidation, fileTypeValidation, SUPPORTED_IMAGE_FORMATS, MAX_FILE_SIZE } from 'fileManagement';
import EventForm from 'components/EventForm';
import { makeSelectEvent } from './selectors';
import { makeSelectEthAddress } from 'containers/App/selectors';
import { forwardTo } from 'utils/history';

interface RouteParams {
  eventId: string;
}

interface OwnProps extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {
  event: IEvent,
  ethAddress: string
}

interface DispatchProps {
  onSubmitUpdateEvent(data): void;
  onChangeEventAttendeeLimit(
    data:{
      eventId: string,
      newLimit: number,
      membershipManagerAddress: string
  }): void;
}

interface StateProps {
  pendingTx: boolean
}

type Props = StateProps & DispatchProps & OwnProps;

const UpdateEventContainer: React.SFC<Props> = (props: Props) => {
  const {onSubmitUpdateEvent, onChangeEventAttendeeLimit, pendingTx, ethAddress, match: {params: {eventId}}, event} = props;
  if(event.organizer != ethAddress){
    forwardTo("/discover/events/")
  }

  const UpdateEventSchema = (currentAttendees: number) => Yup.object().shape({
    bannerImage: Yup.mixed().required("Please add a banner image for the event")
      .test('fileSize', 'Maximum file size of 10MB exceeded', file => fileSizeValidation(file, MAX_FILE_SIZE))
      .test('fileType', 'Please supply an image file', file => fileTypeValidation(file, SUPPORTED_IMAGE_FORMATS)),
    description: Yup.string().max(240,"240 character limit exceeded").required("A description is required"),
    eventDate: Yup.date().min(dayjs().format('YYYY-MM-DD'), 'Event must be in the future'),
    eventTime: Yup.mixed().required(),
    maxAttendees: Yup.number()
      .test('maxAttendees', `Max attendees can not be set lower than ${currentAttendees}. Set to 0 to disable`,
        v => (v === 0 || v > currentAttendees))
      .required()
      .integer(),
  })
  return (
    <Formik
      initialValues={{
        name: event.name,
        bannerImage: event.bannerImage,
        description: event.description,
        maxAttendees: event.maxAttendees,
        requiredDai: event.requiredDai,
        eventDate: dayjs(event.eventDate).format('YYYY-MM-DD'),
        eventTime: dayjs(event.eventDate).format('HH:mm'),
        eventId: event.eventId,
        eventManagerAddress: event.eventManagerAddress,
        organiser: event.organizer,
      }}
      validationSchema={() => UpdateEventSchema(event.attendees.length)}
      onSubmit={
        (values, actions) => {
          if (values.maxAttendees !== event.maxAttendees) {
            onChangeEventAttendeeLimit({
              eventId: event.eventId,
              newLimit: values.maxAttendees,
              membershipManagerAddress: event.membershipManagerAddress,
            })
          }
          values.eventDate = `${values.eventDate} ${values.eventTime}`;
          delete values.eventTime;
          onSubmitUpdateEvent(values);
        }
      }

      render={({submitForm}) =>
        <EventForm
          submitForm={submitForm}
          isNew={false} />
      }
    />
  );
}

const mapStateToProps = createStructuredSelector({
  event: makeSelectEvent(),
  ethAddress: makeSelectEthAddress
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    onSubmitUpdateEvent: (data: IEvent) => {
      dispatch(updateEventAction.request(data))
    },
    onChangeEventAttendeeLimit: ({eventId, newLimit, membershipManagerAddress}) => {
      dispatch(changeEventLimitAction.request({eventId, limit: newLimit, membershipManagerAddress}))
    }
  };
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(UpdateEventContainer);
