const apiHost = process.env.API_HOST || 'localhost:3001/api';
const apiSchema = process.env.API_SCHEMA || 'http';

const generateUri = (path: string) => { return `${apiSchema}://${apiHost}/${path}` }

const apiUrlBuilder = {
  login: generateUri('auth/login'),
  signUp: generateUri('users'),
  patent: generateUri('patent'),
  patentList: generateUri('patent/list'),
  walletBalances: generateUri('wallet/balances'),
  attachmentStream: (attachmentId: string) => generateUri(`attachment/${attachmentId}/stream`),
  attachmentBase64: (attachmentId: string) => generateUri(`attachment/${attachmentId}/b64`),
  getExchange: generateUri('exchange'),
  publishPatent: (patentId: string) => generateUri(`patent/${patentId}/publishPatent`),
  updatePatent: (patentId: string) => generateUri(`patent/${patentId}`)
}

export default apiUrlBuilder;
