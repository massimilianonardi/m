
var electron = require("electron");
var {app, BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow, globalShortcut} = require("electron");
var {exec} = require("child_process");
var https = require("https");

var win = null;

var loadFavList = function()
{
  // win.loadURL("https://www.vinted.it");
  // https://www.reddit.com/r/popular.json
  let url = "https://www.reddit.com/r/popular.json";

https.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            console.log(body);
            let json = JSON.parse(body);
            // do something with JSON
            console.log(json);
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});

win.webContents.openDevTools();

};

app.on("ready", function()
{
  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

  win = new BrowserWindow({width: w, height: h});
  // win.loadURL("https://www.vinted.it");
  win.loadURL("https://www.vinted.it/member/items/favourite_list");
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
    {label: "Load Favourite List", type: "normal", click: loadFavList}
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
