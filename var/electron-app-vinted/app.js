
//------------------------------------------------------------------------------

var win = null;

//------------------------------------------------------------------------------

app.on("ready", function(event, launchInfo)
{
  console.log(event, launchInfo, arguments);
  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

  win = new BrowserWindow({width: w, height: h});
  // win.loadFile("index.html");
  // win.loadURL("https://mail.google.com");
  // win.loadURL("https://www.vinted.it");
  // win.loadURL("https://www.vinted.it/member/items/favourite_list");
  win.loadFile("index.html").then(function()
  {
    win.webContents.openDevTools();
    console.log(event, launchInfo, arguments);
    win.webContents.console.log(event, launchInfo, arguments);
  });
  win.webContents.send("message", arguments);
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

  // winfav = new BrowserWindow({width: 800, height: 600});
  // winfav.loadURL("https://www.vinted.it/member/items/favourite_list");
  // // winfav.webContents.openDevTools();
  // winfav.on("closed", () =>
  // {
  //   winfav = null;
  // });

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
