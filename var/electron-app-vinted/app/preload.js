
//------------------------------------------------------------------------------

console.log("inside preload");
console.log("inside preload", global);
// global.zzz = "test inside preload";

const {app, ipcMain, ipcRenderer, shell, clipboard, globalShortcut, BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow} = require("electron");
ipcRenderer.on('message', (event, data) => {console.log("message from ipc renderer", event, data);})
// console.log(win);

//------------------------------------------------------------------------------
