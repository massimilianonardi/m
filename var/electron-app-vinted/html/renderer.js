
//------------------------------------------------------------------------------

console.log("inside renderer");
console.log("inside renderer", global);
global.xxx = "test inside renderer";

// const {app, ipcMain, ipcRenderer, shell, clipboard, globalShortcut, BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow} = require("electron");
// ipcRenderer.on('message', (event, data) => {console.log("message from ipc renderer", event, data);})

//------------------------------------------------------------------------------
