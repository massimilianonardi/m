
//------------------------------------------------------------------------------

var win = null;

//------------------------------------------------------------------------------

function reload()
{
//    getCurrentWindow().reload();
  win.reload();
}

//------------------------------------------------------------------------------

function main()
{
}

//------------------------------------------------------------------------------

function buildMenu()
{
  var actionsMenu = Menu.buildFromTemplate(
  [
    {label: "Load Favourite List", type: "normal", click: loadFavList},
    {label: "Parse Favourite List", type: "normal", click: parseFavDump},
    {label: "View Favourite List", type: "normal", click: viewFavList}
  ]);

  var actionsMenuItem = new MenuItem(
  {
    type: "submenu",
    label: "Actions",
    submenu: actionsMenu
  });

  var mainMenu = Menu.getApplicationMenu();
  mainMenu.append(actionsMenuItem);
  Menu.setApplicationMenu(mainMenu);
}

//------------------------------------------------------------------------------

function buildShortcuts()
{
  globalShortcut.register("F5", reload);
  globalShortcut.register("CommandOrControl+R", reload);
}

//------------------------------------------------------------------------------

function buildGUI()
{
  win.webContents.openDevTools();
  console.log(arguments);
  win.webContents.executeJavaScript('console.log("hello executed from main");');
  win.webContents.send("message", "my message");
  win.webContents.send("message", arguments[0]);
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

  // win.loadURL("https://www.vinted.it/member/items/favourite_list");
  win.loadFile(path.join(htmlDir, "index.html")).then(pageReady);
}

//------------------------------------------------------------------------------
