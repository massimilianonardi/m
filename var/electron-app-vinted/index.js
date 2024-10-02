
// https://www.vinted.it/api/v2/users/25943425/items?page=1&per_page=21&cond=active&selected_item_id=5105638873
// https://www.vinted.it/api/v2/users/155761817/items?page=1&per_page=21&cond=active&selected_item_id=4170366942
// https://www.vinted.it/api/v2/users/155761817/items/favourites?page=0&include_sold=true&per_page=90

const electron = require("electron");
const {app, BrowserWindow, Menu, MenuItem, Tray, getCurrentWindow, globalShortcut} = require("electron");
const {exec} = require("child_process");
// const url = require("url");
const https = require("https");
const fs = require("fs");
const path = require("path");

//------------------------------------------------------------------------------

const appPath = app.getAppPath();

const dataPath = "/m/_vinted";
const itemIndexPath = path.join(dataPath, "item", "index");
const favDumpPath = path.join(dataPath, "dump", "fav");

var win = null;
var photoQueue = [];

//------------------------------------------------------------------------------

mkdir(dataPath);
mkdir(itemIndexPath);
mkdir(favDumpPath);

//------------------------------------------------------------------------------

function mkdir(dir)
{
  if(!fs.existsSync(dir))
  {
    fs.mkdirSync(dir, {recursive: true});
  }
}

//------------------------------------------------------------------------------

function parseFavDump()
{
  fs.readdirSync(favDumpPath).forEach(fileName =>
  {
    var fn = path.join(favDumpPath, fileName);
    console.log(fn);
    var json = JSON.parse(fs.readFileSync(fn));
    var items = json.items;
    for(var i = 0; i < items.length; i++)
    {
      var item = items[i];
      var id = "" + item.id;
      if(typeof id !== "string" || id === "")
      {
        console.log("id null", id, item);
        // throw new Exception();
      }
      var itemPath = path.join(itemIndexPath, id);
      if(fs.existsSync(itemPath))
      {
        console.log("id exists", id, item.path);
        // console.log("id exists", id, item.path, item);
        // throw new Exception();
      }
      mkdir(itemPath);
      fs.writeFileSync(path.join(itemPath, "item.json"), JSON.stringify(item, null, 2), "utf-8");
      var photosPath = path.join(itemPath, "photos");
      mkdir(photosPath);

      // todo: download hires images (item.photos, photo.url, photo.full_size_url)
      var photos = item.photos;
      for(var j = 0; j < photos.length; j++)
      {
        var photo = photos[j];
        var photoPath = path.join(photosPath, "img_" + j + ".jpg");
        photoQueue.push({url: photo.full_size_url, path: photoPath});
      }
    }
    var sold = json.sold;
    if(sold != null)
    {
      console.log(sold);
    }
  });

  console.log("processing photo download queue. #photos:" + photoQueue.length);
  processPhotoQueue(0);
}

//------------------------------------------------------------------------------

function processPhotoQueue(index)
{
  var photoPath = photoQueue[index].path;
  var url = photoQueue[index].url;
  console.log("photo", index, photoPath, url);

  if(fs.existsSync(photoPath))
  {
    console.log("photo -> skipped, already exists!", index, photoPath, url);
    processNextPhotoQueue(index);
    return;
  }

  var fstream = fs.createWriteStream(photoPath);
  var req = https.get(url,(res) =>
  {
    res.pipe(fstream);
    // res.on("data", (chunk) => {body += chunk;});
    res.on("end", () => {processNextPhotoQueue(index);});
  }).on("error", (error) =>
  {
    console.error(error.message);
  });
}

function processNextPhotoQueue(index)
{
  if(index + 1 < photoQueue.length)
  {
    processPhotoQueue(index + 1);
  }
  else
  {
    console.log("processing photo download completed! #photos:" + photoQueue.length);
    photoQueue = [];
  }
}

//------------------------------------------------------------------------------

function viewFavList()
{
}

//------------------------------------------------------------------------------

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
  win.loadFile("index.html");
  // win.loadURL("https://mail.google.com");
  // win.loadURL("https://www.vinted.it");
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
