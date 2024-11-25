
//------------------------------------------------------------------------------

console.log("inside injected javascript");

//------------------------------------------------------------------------------

function dload(url)
{
  console.log("inside injected javascript - dload:" + url);
  return "returned url: " + url;
}

//------------------------------------------------------------------------------

function downloadURL(url, callback)
{
  fetch(url, {method: "get", mode: "no-cors", referrerPolicy: "no-referrer"})
  .then((response) => response.text())
  .then(text => {if(typeof callback === "function") callback(text);});
}

//------------------------------------------------------------------------------

function downloadURLPromise(url)
{
  return fetch(url, {method: "get", mode: "no-cors", referrerPolicy: "no-referrer"})
  .then((response) => response.text());
}

//------------------------------------------------------------------------------

// var cookieElem = document.getElementById("onetrust-consent-sdk");
var cookieElem = document.getElementById("onetrust-pc-sdk");
console.log("cookieElem", cookieElem, cookieElem.firstChild);

//------------------------------------------------------------------------------
