import {schema} from 'normalizr';

const eventSchema = new schema.Entity('events', {}, {idAttribute: 'eventId'});

export default eventSchema;
