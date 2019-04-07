import {schema} from 'normalizr';

const membershipManagement = new schema.Entity('membershipManagement', {}, {idAttribute: 'tbcAddress'});

export default membershipManagement;
