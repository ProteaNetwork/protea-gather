// import  {env} from '../env';

//TODO Get this value from config
const apiHost = 'http://localhost:3001/api/';

export default async function apiRequest(method, uri, body?, authenticate = false, token?) {
  const options = {
    method: method,
    body,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (authenticate) {
    if (!token) { throw new Error('No Authentication token provided'); }
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiHost}${uri}`, options);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication Error');
    } else {
      throw new Error('Failed to fetch');
    }
  }

  const result = {
    success: true,
    response,
    data: await response.json()
  }

  return result;
}
