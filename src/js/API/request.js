async function request(method = 'GET', url = '', data = null) {
  const BASE_URL = 'http://localhost:8080/';
  let response;
  if (method === 'POST') {
    response = await fetch(BASE_URL + url, {
      method,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    });
    return response;
  }

  if (method === 'GET') {
    response = await fetch(BASE_URL + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return response;
}

export default request;
