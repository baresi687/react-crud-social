async function postData(api, postData) {
  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(postData),
  };
  const response = await fetch(api, options);
  return response.json();
}

export { postData };
