
//------------------------------------------------------------------------------

var win = null;

//------------------------------------------------------------------------------

function reload()
{
//    getCurrentWindow().reload();
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

function buildGUI()
{
  win.webContents.openDevTools();
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

  win.loadURL("https://vinted.it");
  // win.loadFile(path.join(htmlDir, "index.html")).then(pageReady);
}

//------------------------------------------------------------------------------
