
//------------------------------------------------------------------------------

var win = null;

//------------------------------------------------------------------------------

app.on("ready", function()
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
      preload: path.join(app.getAppPath(), "preload.js"),
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

  // win.loadURL("https://www.vinted.it/member/items/favourite_list");
  win.loadFile("index.html").then(function()
  {
    win.webContents.openDevTools();
    win.webContents.executeJavaScript('console.log("hello from main");');
    win.webContents.send("message", "my message");
    win.webContents.send("message", arguments[0]);
    console.log(global.zzz);
    console.log(global.xxx);
  });

  // win.webContents.send("message", "my message");

  win.on("closed", () =>
  {
    win = null;
  });

  function reload()
  {
//    getCurrentWindow().reload();
    win.reload();
  }

  globalShortcut.register("F5", reload);
  globalShortcut.register("CommandOrControl+R", reload);

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
});

//------------------------------------------------------------------------------

app.on("window-all-closed", function()
{
  // on macos apps usually keep running even if all windows are closed
  if(process.platform === "darwin")
  {
    return;
  }

  app.quit();
});

//------------------------------------------------------------------------------

app.on("activate", function()
{
  if(win === null)
  {
    createWindow();
  }
});

//------------------------------------------------------------------------------
