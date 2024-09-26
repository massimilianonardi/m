
var electron = require("electron");
var {app, BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow, globalShortcut} = require("electron");
var {exec} = require("child_process");
var https = require("https");
var fs = require("fs");
var path = require("path");
// var url = require("url");

var win = null;
var dataPath = app.getAppPath() + "/data"

function parseFavDump()
{
  var dumppath = dataPath + "/fav_dump";

  var lastIndex = 99;
  for(var i = 0; i < lastIndex; i++)
  {
    var fn = dumppath + "/favourites_" + i + ".json";
    if(fs.existsSync(fn))
    {
      var text = fs.readFileSync(fn);
      var json = JSON.parse(text);
      console.log(fn);
      var items = json.items;
      for(var j = 0; j < items.length; j++)
      {
        var item = items[j];
        var itemfn = dataPath + item.path;
        fs.writeFileSync(itemfn, JSON.stringify(item), "utf-8");
      }
    }
  }
}
// https://www.vinted.it/api/v2/users/25943425/items?page=1&per_page=21&cond=active&selected_item_id=5105638873
// https://www.vinted.it/api/v2/users/155761817/items?page=1&per_page=21&cond=active&selected_item_id=4170366942

var processFavChunk = function(url, i, lastChunk)
{
  var dlpath = dataPath + "/tmp";
  https.get(url,(res) =>
  {
    var body = "";
    res.on("data", (chunk) => {body += chunk;} );
    res.on("end", () =>
    {
      try
      {
        var fn = dlpath + "/fav_" + i;
        console.log(body);
        // todo save to file
        try
        {
          fs.writeFileSync(fn, body, "utf-8");
        }
        catch(e)
        {
          alert("Failed to save file");
        }
        var json = JSON.parse(body);
        // do something with JSON
        console.log(json);
      }
      catch (error)
      {
        console.error(error.message);
      };
    });
  }).on("error", (error) =>
  {
    console.error(error.message);
  });

  // win.webContents.openDevTools();
};

var loadFavList = function()
{
  var lastIndex = 35;
  for(var i = 0; i < lastIndex; i++)
  {
    // https://www.vinted.it/api/v2/users/155761817/items/favourites?page=0&include_sold=true&per_page=90
    var url = "https://www.vinted.it/api/v2/users/155761817/items/favourites?page=" + i + "&include_sold=true&per_page=20";
    processFavChunk(url, i, i === lastIndex);
  }
};

app.on("ready", function()
{
  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

  win = new BrowserWindow({width: w, height: h});
  // win.loadURL("https://mail.google.com");
  win.loadURL("https://www.vinted.it");
  // win.loadURL("https://www.vinted.it/member/items/favourite_list");
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
    {label: "Parse Favourite List", type: "normal", click: parseFavDump}
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
