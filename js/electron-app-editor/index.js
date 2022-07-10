
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

//------------------------------------------------------------------------------
// MODULES
//------------------------------------------------------------------------------

const {exec} = require("child_process");

const fs = require("fs");
const path = require("path");

// const https = require("https");

const electron = require("electron");
const {app, ipcMain, shell, clipboard, globalShortcut} = require("electron");
const {BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow} = require("electron");

//------------------------------------------------------------------------------
// PATHS
//------------------------------------------------------------------------------

const appDir = path.join(app.getAppPath(), "app");
const htmlDir = path.join(app.getAppPath(), "html");
const jsDir = path.join(htmlDir, "js");
const confDir = path.join(app.getAppPath(), "conf");

const windowPreloadPath = path.join(appDir, "preload.js");
const menuConfPath = path.join(confDir, "menu.json");
const shortcutConfPath = path.join(confDir, "shortcut.json");
const indexPagePath = path.join(htmlDir, "index.html");

//------------------------------------------------------------------------------
// WINDOW
//------------------------------------------------------------------------------

var win = null;

//------------------------------------------------------------------------------

function reload()
{
  // getCurrentWindow().reload();
  win.reload();
}

//------------------------------------------------------------------------------

function log()
{
  win.webContents.send("log", ...arguments);
}

//------------------------------------------------------------------------------

function buildMenu()
{
  if(!fs.existsSync(menuConfPath))
  {
    return;
  }

  var menuConf = fs.readFileSync(menuConfPath, "utf-8");
  // log("menu", menuConf);
  var menu = Menu.buildFromTemplate(eval(menuConf));
  Menu.setApplicationMenu(menu);
}

//------------------------------------------------------------------------------

function buildShortcuts()
{
  if(!fs.existsSync(shortcutConfPath))
  {
    return;
  }

  var shortcutConf = fs.readFileSync(shortcutConfPath, "utf-8");
  // log("shortcuts", shortcutConf);
  eval("var json = " + shortcutConf + ";");
  for(var k in json)
  {
    globalShortcut.register(k, json[k]);
  }
}

//------------------------------------------------------------------------------

function pageReady()
{
  console.log("pageReady");

  win.webContents.openDevTools();
}

//------------------------------------------------------------------------------

function createWindow()
{
  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

  win = new BrowserWindow(
  {
    width: w,
    height: h,
    title: "",
    // frame: false,
    // frame: true,
    // titleBarStyle: "hidden",
    // titleBarOverlay: true,
    webPreferences:
    {
      preload: windowPreloadPath,
      contextIsolation: false,
      devTools: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      sandbox: false
    }
  });

  win.on("closed", () =>
  {
    // win = null;
  });

  buildMenu();
  buildShortcuts();

  win.loadFile(indexPagePath).then(pageReady);
}

//------------------------------------------------------------------------------
// APP
//------------------------------------------------------------------------------

app.on("window-all-closed", function()
{
  if(process.platform !== "darwin")
  {
    app.quit();
  }
});

//------------------------------------------------------------------------------

app.on("activate", function()
{
  if(BrowserWindow.getAllWindows().length === 0)
  {
    createWindow();
  }
});

//------------------------------------------------------------------------------

app.on("ready", function()
{
  ipcMain.handle("execute", (event, functionName, ...args) =>
  {
    return eval(functionName)(...args);
  });

  createWindow();
});

//------------------------------------------------------------------------------
