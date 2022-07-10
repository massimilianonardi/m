
//------------------------------------------------------------------------------

const {exec} = require("child_process");

const fs = require("fs");
const path = require("path");

const https = require("https");

const electron = require("electron");
const {app, ipcMain, shell, clipboard, globalShortcut} = require("electron");
const {BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow} = require("electron");

//------------------------------------------------------------------------------

const appDir = path.join(app.getAppPath(), "app");
const htmlDir = path.join(app.getAppPath(), "html");
const jsDir = path.join(htmlDir, "js");
const confDir = path.join(app.getAppPath(), "conf");

const menuConfPath = path.join(confDir, "menu.json");
const shortcutConfPath = path.join(confDir, "shortcut.json");

//------------------------------------------------------------------------------

const jsModuleFiles =
[
  "main.js",
  "app.js",
  null
];

for(var i = 0; i < jsModuleFiles.length; i++)
{
  var jsFileName = jsModuleFiles[i];
  if(typeof jsFileName !== "string") break;
  var jsFilePath = path.resolve(path.join(appDir, jsFileName));
  console.log("executing javascript file:", jsFilePath);
  eval(fs.readFileSync(jsFilePath, "utf-8"));
}

//------------------------------------------------------------------------------
