import apiRequest from './apiRequest';
import apiUrlBuilder from './apiUrlBuilder';


export function login(email: string, password: string): Promise<any> {
  const body = JSON.stringify({ email, password });
  return apiRequest('POST', apiUrlBuilder.login, body, 'application/json');
}

export function signUp(email: string, password: string, firstName: string, lastName: string): Promise<any> {
  const body = JSON.stringify({ email, password, firstName, lastName });
  return apiRequest('POST', apiUrlBuilder.signUp, body, 'application/json');
}

// export function getOrganisations(apiToken): Promise<any> {
//   return apiRequest('GET', apiUrlBuilder.,undefined,'application/json', true, apiToken);
// }

// export function createOrganisation(name, registrationNumber, apiToken): Promise<any> {
//   const relativeUri = 'organizations';
//   return apiRequest('GET', relativeUri,undefined,'application/json', true, apiToken);
// }

export function createPatent(name, type, description, markushStructure, patentCertificate, researchDocument, apiToken: string) {
    const requestData = new FormData();
    requestData.append("name", name);
    requestData.append("type", type);
    requestData.append("description", description);
    requestData.append("markushStructure", markushStructure);
    requestData.append("patentCertificate", patentCertificate);
    requestData.append("researchDocument", researchDocument);

    return apiRequest(
      'POST',
      apiUrlBuilder.patent,
      requestData,
      undefined, //The Content-Type header is set automatically via the FormData object.
      true,
      apiToken);
}

export function updatePatentApi(patentId, name, type, description, 
  markushStructure, patentCertificate, researchDocument, status, userId, apiToken: string) {
  const requestData = new FormData();
  requestData.append("patentId", patentId);
  requestData.append("name", name);
  requestData.append("type", type);
  requestData.append("description", description);
  requestData.append("markushStructure", markushStructure);
  requestData.append("patentCertificate", patentCertificate);
  requestData.append("researchDocument", researchDocument);
  requestData.append("status", status);
  requestData.append("userId", userId);

  return apiRequest(
    'PUT',
    apiUrlBuilder.updatePatent(patentId),
    requestData,
    undefined, //The Content-Type header is set automatically via the FormData object.
    true,
    apiToken);
}

export function getPatentsApi(apiToken: string) {
  return apiRequest('GET', apiUrlBuilder.patentList, undefined, 'application/json', true, apiToken);
}

export function getWalletData(apiToken: string) {
  return apiRequest('GET', apiUrlBuilder.walletBalances, undefined, 'application/json', true, apiToken);
}

export async function getPdfAttachment(attachmentId: string) {
  return apiRequest('GET', apiUrlBuilder.attachmentStream(attachmentId), undefined, 'application/json', false);
}

export function getImage(attachmentId: string) {
  return apiRequest('GET', apiUrlBuilder.attachmentBase64(attachmentId), undefined, 'application/json', false);
}

export function getExchange(apiToken: string) {
  return apiRequest('GET', apiUrlBuilder.getExchange, undefined, 'application/json', false, apiToken);
}

export function publishPatent(patentId: string, initialReserve: number, marketCap: number, apiToken: string) {
  const body = JSON.stringify({initialReserve, marketCap});
  return apiRequest('POST', apiUrlBuilder.publishPatent(patentId), body, 'application/json', true, apiToken);
}
