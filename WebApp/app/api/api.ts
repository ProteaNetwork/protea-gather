import apiRequest from './apiRequest';
import apiUrlBuilder from './apiUrlBuilder';


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
