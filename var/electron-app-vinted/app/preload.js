
//------------------------------------------------------------------------------

const {ipcRenderer} = require("electron");
// const {contextBridge, ipcRenderer} = require("electron");

//------------------------------------------------------------------------------

ipcRenderer.on("log", (event, ...args) => {console.log(...args);});

ipcRenderer.on("execute", (event, script) =>
{
  // console.log("execute", script);
  eval(script);
});

//------------------------------------------------------------------------------

function invoke(functionName, ...args)
{
  return ipcRenderer.invoke("execute", functionName, ...args);
}

global.invoke = invoke;

//------------------------------------------------------------------------------

// function invokeAsync(functionName, ...args)
// {
//   return ipcRenderer.invoke("execute", functionName, ...args);
// }
//
// global.invokeAsync = invokeAsync;

//------------------------------------------------------------------------------

// function downloadTest(url, callback)
// {
//   winBrowserDownloader.webContents.executeJavaScript("dload('https://test.url/' + " + url + ");")
//   .then((res) =>
//   {
//     callback(res);
//     return res;
//   });
// }
//
// global.downloadTest = downloadTest;

//------------------------------------------------------------------------------

// window.vinted.download(url);
// contextBridge.exposeInMainWorld("vinted",
// {
//   "download": (url) =>
//   {
//     // function body
//     return "returned from isolated context: " + url;
//   }
// });

//------------------------------------------------------------------------------
