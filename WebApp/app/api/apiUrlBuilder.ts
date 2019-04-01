const apiHost = process.env.API_HOST || 'localhost:3001/api';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => `${apiSchema}://${apiHost}/${path}`;

const apiUrlBuilder = {
  getPermit: generateUri('auth/permit'),
  login: generateUri('auth/login'),
  getUserProfile: generateUri('users/me'),
  getCommunityMeta: (tbcAddress: string) => generateUri(`community/${tbcAddress}`),
  getEventMeta: (eventId: string) => generateUri(`event/${eventId}`)
};

export default apiUrlBuilder;
