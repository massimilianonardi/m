
//------------------------------------------------------------------------------

const {ipcRenderer} = require("electron");
// ipcRenderer.on("log", (event, data) => {console.log(data);})
ipcRenderer.on("log", (event, ...args) => {console.log(...args);})

//------------------------------------------------------------------------------
