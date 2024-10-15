
// https://www.vinted.it/api/v2/users/25943425/items?page=1&per_page=21&cond=active&selected_item_id=5105638873
// https://www.vinted.it/api/v2/users/155761817/items?page=1&per_page=21&cond=active&selected_item_id=4170366942
// https://www.vinted.it/api/v2/users/155761817/items/favourites?page=0&include_sold=true&per_page=90

//------------------------------------------------------------------------------

const appPath = app.getAppPath();

const dataPath = "/m/_vinted";
const itemIndexPath = path.join(dataPath, "item", "index");
const favDumpPath = path.join(dataPath, "dump", "fav");

var photoQueue = [];

//------------------------------------------------------------------------------

mkdir(dataPath);
mkdir(itemIndexPath);
mkdir(favDumpPath);

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

//------------------------------------------------------------------------------

var loadFavList = function()
{
  var lastIndex = 35;
  for(var i = 0; i < lastIndex; i++)
  {
    var url = "https://www.vinted.it/api/v2/users/155761817/items/favourites?page=" + i + "&include_sold=true&per_page=20";
    processFavChunk(url, i, i === lastIndex);
  }
};

//------------------------------------------------------------------------------
