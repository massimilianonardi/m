
//------------------------------------------------------------------------------

const {exec} = require("child_process");

const fs = require("fs");
const path = require("path");

// const url = require("url");
const https = require("https");

const electron = require("electron");
const {app, ipcMain, ipcRenderer, shell, clipboard, globalShortcut} = require("electron");
const {BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow} = require("electron");

// const {autoUpdater, BaseWindow, BrowserView,
//   contentTracing, crashReporter, desktopCapturer, dialog, inAppPurchase,
//   MessageChannelMain, MessagePortMain, nativeImage, nativeTheme,
//   net, netLog, Notification, parentPort, powerMonitor, powerSaveBlocker,
//   protocol, pushNotifications, safeStorage, screen, session, ShareMenu,
//   systemPreferences, TouchBar, utilityProcess, webContents, WebContentsView, webFrameMain, View
// } = require("electron");

//------------------------------------------------------------------------------

const jsModuleFiles =
[
  "common.js",
  "vinted.js",
  "vinted-gui.js",
  "main.js",
  "app.js",
  null
];

for(var i = 0; i < jsModuleFiles.length; i++)
{
  var jsFileName = jsModuleFiles[i];
  if(typeof jsFileName !== "string") break;
  var jsFilePath = path.resolve(path.join(app.getAppPath(), jsFileName));
  console.log("executing javascript file:", jsFilePath);
  eval(fs.readFileSync(jsFilePath, "utf-8"));
}

//------------------------------------------------------------------------------
