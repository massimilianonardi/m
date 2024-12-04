
//------------------------------------------------------------------------------

const {ipcRenderer} = require("electron");

//------------------------------------------------------------------------------

ipcRenderer.on("log", (event, ...args) => {console.log(...args);});

ipcRenderer.on("execute", (event, script) =>
{
  eval(script);
});

//------------------------------------------------------------------------------

function invoke(functionName, ...args)
{
  return ipcRenderer.invoke("execute", functionName, ...args);
}

global.invoke = invoke;

//------------------------------------------------------------------------------
