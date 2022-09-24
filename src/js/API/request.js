async function request(method = 'GET', url = '', data = null) {
  const BASE_URL = 'http://localhost:8080/';

  if (method === 'POST') {
    const response = await fetch(BASE_URL + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    });
  }

  if (method === 'GET') {
    const response = await fetch(BASE_URL + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

    return response;
  }
}

export default request;
