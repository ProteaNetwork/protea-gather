import apiRequest from './apiRequest';

export function login(email, password): Promise<any> {
  const body = JSON.stringify({ email, password });
  const relativeUri = 'auth/login';
  return apiRequest('POST', relativeUri, body);
}

export function signUp(email, password, firstName, lastName): Promise<any> {
  const body = JSON.stringify({ email, password, firstName, lastName });
  const relativeUri = 'users';
  return apiRequest('POST', relativeUri, body);
}

export function getOrganizations(token): Promise<any> {
  const relativeUri = 'organizations';
  return apiRequest('GET', relativeUri,null,true,token);
}
