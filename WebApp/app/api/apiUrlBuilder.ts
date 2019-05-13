const apiHost = process.env.API_HOST || 'localhost:3001/api';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => `${apiSchema}://${apiHost}/${path}`;

const apiUrlBuilder = {
  getPermit: generateUri('auth/permit'),
  login: generateUri('auth/login'),
  getUserProfile: generateUri('users/'),
  getCommunityMeta: (tbcAddress: string) => generateUri(`community/${tbcAddress}`),
  getEventMeta: (eventId: string) => generateUri(`event/${eventId}`),
  attachmentStream: (attachmentId: string) => generateUri(`attachment/${attachmentId}/stream`),
  createCommunity: generateUri(`community`),
  updateCommunity: (tbcAddress: string) => generateUri(`community/${tbcAddress}/update`),
  createEvent: generateUri(`event`),
  updateEvent: (eventId: string) => generateUri(`event/${eventId}/update`),
  updateProfile: generateUri(`users`),
};

export default apiUrlBuilder;
