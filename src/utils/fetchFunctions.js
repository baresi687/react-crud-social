async function postData(api, postData, auth) {
  const options = {
    method: 'POST',
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
