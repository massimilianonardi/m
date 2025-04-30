
// require

var child_process = require("child_process");

var path = require("path");
var url = require("url");

var electron = require("electron");



// require global

var {exec} = child_process;
var {app, BrowserWindow, Menu, Tray, getCurrentWindow, globalShortcut} = electron;



// global

var win = null;
var tray = null;



// main

// open index.html that loads m-js and js-apps, then send signal or provide interrogation-api to communicate specific app to load
// this way is a general app framework that can be evolved to a desktop
console.log("nodejs", process.versions.node, "chrome", process.versions.chrome, "electron", process.versions.electron);
//process.stdout.write("hello: ");
console.log("test", process.argv);

app.on("ready", function()
{
//  const {dialog} = electron;
//  console.log(dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }));
  
  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
//  var w = parseInt(width * .8);
//  var h = parseInt(height * .8);
  var w = parseInt(width);
  var h = parseInt(height);
  
//  win = new BrowserWindow({width: 800, height: 600});
//  win = new BrowserWindow({width: w, height: h, icon: app.getAppPath() + "/icon-app.png"});
  win = new BrowserWindow(
  {
    width: w, height: h, icon: app.getAppPath() + "/icon-app.png",
    webPreferences:
    {
      contextIsolation: false,
      nodeIntegration: true,
      preload: app.getAppPath() + "/preload.js"
    }
  });
  win.loadFile("index.html");
//  win.loadFile("app/index.html");
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
