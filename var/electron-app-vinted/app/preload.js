
//------------------------------------------------------------------------------

const {ipcRenderer} = require("electron");

//------------------------------------------------------------------------------

ipcRenderer.on("log", (event, ...args) => {console.log(...args);});

ipcRenderer.on("execute", (event, script) =>
{
  // console.log("execute", script);
  eval(script);
});

//------------------------------------------------------------------------------
