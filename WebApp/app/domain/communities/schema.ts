import {schema} from 'normalizr';

const community = new schema.Entity('communities', {}, {idAttribute: 'tbcAddress'});

export default community;
