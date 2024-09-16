
var {app, BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow, globalShortcut} = require("electron");
var {exec} = require("child_process");
var electron = require("electron");

var win = null;
var tray = null;

var loadFavList = function()
{
};

app.on("ready", function()
{
  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

  win = new BrowserWindow({width: w, height: h});
  // win.loadURL("https://www.vinted.it");
  win.loadURL("https://www.vinted.it/member/items/favourite_list");
  // win.webContents.openDevTools();
  win.on("closed", () =>
  {
    win = null;
  });

  function reload()
  {
//    getCurrentWindow().reload();
    win.reload();
  }
//https://www.vinted.it/api/v2/users/155761817/items/favourites?page=2&include_sold=true&per_page=20
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
    {label: "Item1", type: "radio", click: function(){win.loadURL("https://www.vinted.it");}},
    {label: "Item2", type: "radio"},
    {label: "Item3", type: "radio", checked: true}
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
//   tray = new Tray(app.getAppPath() + "/icon-systray.png");
//   tray.setToolTip("This is my application.");
//   var contextMenu = Menu.buildFromTemplate(
//   [
//     {label: "Item1", type: "radio"},
//     {label: "Item2", type: "radio"},
//     {label: "Item3", type: "radio", checked: true},
//     {label: "Item4", type: "radio"}
//   ]);
//   tray.setContextMenu(contextMenu);
//   tray.on("click", (event) =>
//   {
// //    win.isVisible() ? win.hide() : win.show();
//     console.log(event);
//     exec("/bin/ls -la", function(error, stdout, stderr)
//     {
//       console.log("done");
//       console.log(error, stdout, stderr);
//     });
// //    tray.emit("right-click");
// //    mainMenu.popup();
// //    tray.popUpContextMenu(mainMenu);
//   });

});

app.on("window-all-closed", function()
{
  // on macos apps usually keep running even if all windows are closed
  if(process.platform === "darwin")
  {
    return;
  }

//  globalShortcut.unregister("F5", reload);
//  globalShortcut.unregister("CommandOrControl+R", reload);

  app.quit();
});

app.on("activate", function()
{
  if(win === null)
  {
    createWindow();
  }
});
