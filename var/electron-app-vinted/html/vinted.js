
//------------------------------------------------------------------------------

function downloadURLPromise(url)
{
  return fetch(url, {method: "get", mode: "no-cors", referrerPolicy: "no-referrer"})
  .then((response) => response.text());
}

//------------------------------------------------------------------------------

function downloadJSONPromise(url)
{
  return fetch(url, {method: "get", mode: "no-cors", referrerPolicy: "no-referrer"})
  .then((response) => response.text())
  .then((text) => JSON.parse(text));
}

//------------------------------------------------------------------------------
