async function request(pagination, method = 'GET', url = '', data = null, id = null) {
  const BASE_URL = 'https://mighty-reef-35019.herokuapp.com/';
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
    response = await fetch(`${BASE_URL}?start=${pagination[0]}&end=${pagination[1]}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (method === 'DELETE') {
    response = await fetch(`${BASE_URL}?id=${id}`, {
      method,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return response;
}

export default request;
