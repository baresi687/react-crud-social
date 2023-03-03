async function postData(api, postData, method = 'POST', auth) {
  const options = {
    method: method,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${auth}`,
    },
    body: JSON.stringify(postData),
  };
  const response = await fetch(api, options);
  return await response.json();
}

export { postData };
