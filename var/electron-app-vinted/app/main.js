
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

// async function asyncEval(functionName, ...args)
// {
//   return new Promise((resolve) =>
//   {
//     eval(functionName)(...args)
//     .then(res => {resolve(res);});
//   });
// }
//
// function doSomething() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // Other things to do before completion of the promise
//       console.log("Did something");
//       // The fulfillment value of the promise
//       resolve("https://example.com/");
//     }, 200);
//   });
// }

//------------------------------------------------------------------------------

function browserDownloadJSON(url, filePath, force, callback)
{
  browserDownloadURL(url, text =>
  {
    if(fs.existsSync(filePath))
    {
      if(force === true) fs.rmSync(filePath)
      else return;
    }

    fs.writeFileSync(filePath, text, "utf-8");

    if(typeof callback === "function") callback(JSON.parse(text));
  });
}

//------------------------------------------------------------------------------

function browserDownloadFile(url, filePath, force, callback)
{
  browserDownloadURL(url, text =>
  {
    if(fs.existsSync(filePath))
    {
      if(force === true) fs.rmSync(filePath)
      else return;
    }

    fs.writeFileSync(filePath, text, "utf-8");

    if(typeof callback === "function") callback(text);
  });
}

//------------------------------------------------------------------------------

function browserDownloadURL(url, callback)
{
  winBrowserDownloader.webContents.executeJavaScript("downloadURLPromise('" + url + "');")
  .then(text => {if(typeof callback === "function") callback(text);});
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

function browseAndDownload(url, filePath, force, callback)
{
  winBrowserDownloader.loadURL(url).then(() =>
  {
    if(fs.existsSync(filePath))
    {
      if(force === true) fs.rmSync(filePath)
      else return;
    }

    winBrowserDownloader.webContents.savePage(filePath, "HTMLOnly")
    .then(() => {if(typeof callback === "function") callback();});
  });
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
      // preload: path.join(appDir, "preload.js"),
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

  winBrowserDownloader.loadURL("https://www.vinted.it/member/signup/select_type").then(() =>
  {
    winBrowserDownloader.webContents.openDevTools();
    winBrowserDownloader.webContents.executeJavaScript(fs.readFileSync(path.resolve(path.join(htmlDir, "vinted.js")), "utf-8"))
    .then((res) =>
    {
      // var url = "https://www.vinted.it/api/v2/catalog/items?page=1&per_page=96&time=1732028313&search_text=hot+wheels&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=";
      // browserDownloadURL(url, res => {log("browserDownloadURL: ", res)});
      // browserDownloadFile(url, "/m/_vinted/zzz-test.json", true, res => {log("browserDownloadFile: ", res);});
      // browserDownloadJSON(url, "/m/_vinted/zzz-test.json", true, res => {log("browserDownloadJSON: ", res);});
    });
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

  // ipcMain.handle("executeAsync", (event, functionName, ...args) =>
  // {
  //   return asyncEval(functionName, ...args);
  // });

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
