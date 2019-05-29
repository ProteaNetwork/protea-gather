import { blockchainResources } from "blockchainResources";

const apiHost = process.env.API_HOST || 'localhost:3001/api';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => `${apiSchema}://${apiHost}/${path}`;

const apiUrlBuilder = {
  getPermit: generateUri('auth/permit'),
  login: generateUri('auth/login'),
  getUserProfile: (ethAddress: string) => generateUri(`users/${ethAddress}`),
  getCommunityMeta: (tbcAddress: string) => generateUri(`community/${blockchainResources.networkId}/${tbcAddress}`),
  getEventMeta: (eventId: string) => generateUri(`event/${blockchainResources.networkId}/${eventId}`),
  attachmentStream: (attachmentId: string) => generateUri(`attachment/${attachmentId}/stream`),
  createCommunity: () => generateUri(`community/${blockchainResources.networkId}`),
  updateCommunity: (tbcAddress: string) => generateUri(`community/${blockchainResources.networkId}/${tbcAddress}/update`),
  createEvent: () => generateUri(`event/${blockchainResources.networkId}`),
  updateEvent: (eventId: string) => generateUri(`event/${blockchainResources.networkId}/${eventId}/update`),
  updateProfile: generateUri(`users`),
  sendErrorReport: () => generateUri(`error/${blockchainResources.networkId}`),
  sendFeedback: () => generateUri(`feedback/${blockchainResources.networkId}`),
};

export default apiUrlBuilder;
