
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

// function browserDownloadJSON(url, filePath, force, callback)
// {
//   browserDownloadURL(url, text =>
//   {
//     if(fs.existsSync(filePath))
//     {
//       if(force === true) fs.rmSync(filePath)
//       else return;
//     }
//
//     fs.writeFileSync(filePath, text, "utf-8");
//
//     if(typeof callback === "function") callback(JSON.parse(text));
//   });
// }
//
// //------------------------------------------------------------------------------
//
// function browserDownloadFile(url, filePath, force, callback)
// {
//   browserDownloadURL(url, text =>
//   {
//     if(fs.existsSync(filePath))
//     {
//       if(force === true) fs.rmSync(filePath)
//       else return;
//     }
//
//     fs.writeFileSync(filePath, text, "utf-8");
//
//     if(typeof callback === "function") callback(text);
//   });
// }
//
// //------------------------------------------------------------------------------
//
// function browserDownloadURL(url, callback)
// {
//   winBrowserDownloader.webContents.executeJavaScript("downloadURLPromise('" + url + "');")
//   .then(text => {if(typeof callback === "function") callback(text);});
// }
//
// //------------------------------------------------------------------------------
//
// function browseAndDownload(url, filePath, force, callback)
// {
//   winBrowserDownloader.loadURL(url).then(() =>
//   {
//     if(fs.existsSync(filePath))
//     {
//       if(force === true) fs.rmSync(filePath)
//       else return;
//     }
//
//     winBrowserDownloader.webContents.savePage(filePath, "HTMLOnly")
//     .then(() => {if(typeof callback === "function") callback();});
//   });
// }

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

function buildGUI()
{
  win.webContents.openDevTools();

  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

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

  winBrowserDownloader.webContents.on("did-start-loading", () =>
  {
    log("did-start-loading");
    winBrowserDownloader.webContents.executeJavaScript(fs.readFileSync(path.resolve(path.join(jsDir, "vinted-downloader.js")), "utf-8"));
  });

  winBrowserDownloader.loadURL("https://www.vinted.it/member/signup/select_type").then(() =>
  {
    winBrowserDownloader.webContents.openDevTools();
    // winBrowserDownloader.webContents.executeJavaScript(fs.readFileSync(path.resolve(path.join(jsDir, "vinted-downloader.js")), "utf-8"));
  });
}

//------------------------------------------------------------------------------

function pageReady()
{
  console.log("pageReady");

  buildMenu();
  buildShortcuts();
  buildGUI();
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

  win.loadFile(path.join(htmlDir, "index.html")).then(pageReady);
}

//------------------------------------------------------------------------------
