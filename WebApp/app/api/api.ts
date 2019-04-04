import apiRequest from './apiRequest';
import apiUrlBuilder from './apiUrlBuilder';
import { ICommunity } from 'domain/communities/types';

// Helpers
const formDataHelper = (data: any) => {
  const requestData = new FormData();
  Object.keys(data).map(key => {
    requestData.append(`${key}`, data[key]);
  })
  return requestData;
}

export function login(signedAccessPermit: string, ethAddress: string): Promise<any> {
  const body = JSON.stringify({ signedAccessPermit: signedAccessPermit, ethAddress: ethAddress});
  return apiRequest('POST', apiUrlBuilder.login, body, 'application/json');
}

export function getPermit(ethAddress: string): Promise<any>  {
  const body = JSON.stringify({ ethAddress: ethAddress });
  return apiRequest('POST', apiUrlBuilder.getPermit, body, 'application/json');
}

export function getUserProfile(apiToken: string): Promise<any>  {
  return apiRequest('GET', apiUrlBuilder.getUserProfile, null, 'application/json', true, apiToken);
}
// Meta
export function getCommunityMeta(tbcAddress: string): Promise<any> {
  return apiRequest('GET', apiUrlBuilder.getCommunityMeta(tbcAddress), null, 'application/json');
}

export function getEventMeta(eventId: string): Promise<any> {
  return apiRequest('GET', apiUrlBuilder.getEventMeta(eventId), null, 'application/json');
}

// Creation
export function createCommunity(community: ICommunity, apiToken: string): Promise<any> {
  return apiRequest('POST', apiUrlBuilder.createCommunity, formDataHelper(community), undefined, true, apiToken)
}
