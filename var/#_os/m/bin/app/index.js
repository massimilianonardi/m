
var {app, BrowserWindow, Menu, Tray, getCurrentWindow, globalShortcut} = require("electron");
var {exec} = require("child_process");

var win = null;
var tray = null;

app.on("ready", function()
{
  win = new BrowserWindow({width: 800, height: 600});
  win.loadFile("index.html");
  win.webContents.openDevTools();
  win.on("closed", () =>
  {
    win = null;
  });
  
  tray = new Tray(app.getAppPath() + "/icon-systray.png");
  tray.setToolTip("This is my application.");
  var contextMenu = Menu.buildFromTemplate(
  [
    {label: "Item1", type: "radio"},
    {label: "Item2", type: "radio"},
    {label: "Item3", type: "radio", checked: true},
    {label: "Item4", type: "radio"}
  ]);
  tray.setContextMenu(contextMenu);
  var mainMenu = Menu.buildFromTemplate(
  [
    {label: "Item1", type: "radio"},
    {label: "Item2", type: "radio"},
    {label: "Item3", type: "radio", checked: true}
  ]);
  tray.on("click", (event) =>
  {
//    win.isVisible() ? win.hide() : win.show();
    console.log(event);
    exec("/bin/ls -la", function(error, stdout, stderr)
    {
      console.log("done");
      console.log(error, stdout, stderr);
    });
//    tray.emit("right-click");
//    mainMenu.popup();
//    tray.popUpContextMenu(mainMenu);
  });
  
  function reload()
  {
//    getCurrentWindow().reload();
    win.reload();
  }
  
  globalShortcut.register("F5", reload);
  globalShortcut.register("CommandOrControl+R", reload);
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
