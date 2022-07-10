
//------------------------------------------------------------------------------

var win = null;
var winBrowserDownloader = null;

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

function browserDownloadJSONPromise(url)
{
  return winBrowserDownloader.webContents.executeJavaScript("downloadJSONPromise('" + url + "');");
}

//------------------------------------------------------------------------------

function browserDownloadURLPromise(url)
{
  return winBrowserDownloader.webContents.executeJavaScript("downloadURLPromise('" + url + "');");
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

function appReady()
{
  ipcMain.handle("execute", (event, functionName, ...args) =>
  {
    return eval(functionName)(...args);
  });

  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

  win = new BrowserWindow(
  {
    width: w,
    height: h,
    webPreferences:
    {
      preload: path.join(appDir, "preload.js"),
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

  win.loadFile(path.join(htmlDir, "index.html")).then(pageReady);

  winBrowserDownloader = new BrowserWindow(
  {
    width: w,
    height: h,
    webPreferences:
    {
      // preload: path.resolve(path.join(jsDir, "vinted-downloader.js")),
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

  winBrowserDownloader.webContents.on("did-finish-load", () =>
  {
    log("did-finish-load", "reloading vinted-downloader.js");
    winBrowserDownloader.webContents.executeJavaScript(fs.readFileSync(path.resolve(path.join(jsDir, "vinted-downloader.js")), "utf-8"));
  });

  winBrowserDownloader.loadURL("https://www.vinted.it/member/signup/select_type");
}

//------------------------------------------------------------------------------
