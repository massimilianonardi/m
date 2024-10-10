
//------------------------------------------------------------------------------

const {exec} = require("child_process");

const fs = require("fs");
const path = require("path");

// const url = require("url");
const https = require("https");

const electron = require("electron");
const {app, BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow, globalShortcut} = require("electron");

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
