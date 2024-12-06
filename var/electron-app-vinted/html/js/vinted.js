
//------------------------------------------------------------------------------

// dump
// - fav
// - search
// index / [id]
// - item.json
// - thumbnail.jpg
// - photo / [hi-res-photos]
// group
// - brand
// - country
// - user
// order
// - tag
// - time
// tag
// - uncategorized

//------------------------------------------------------------------------------

const defaultVintedUserID = "155761817";

// const itemURLPrefix = "https://www.vinted.it/api/v2/items/";

const itemURLTemplate = "https://www.vinted.it/api/v2/items/${itemID}";
const userFavouriteURLTemplate = "https://www.vinted.it/api/v2/users/${userID}/items/favourites?page=${page}&include_sold=true&per_page=90";

//------------------------------------------------------------------------------

function dloadJSON_p(url)
{
  return invoke("browserDownloadJSONPromise", url);
}

//------------------------------------------------------------------------------

function dloadURL_p(url)
{
  return invoke("browserDownloadURLPromise", url);
}

//------------------------------------------------------------------------------

function saveTextFile(text, filePath, force)
{
  if(fs.existsSync(filePath))
  {
    if(force === true) fs.rmSync(filePath)
    else return;
  }

  mkdir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, "utf-8");
}

//------------------------------------------------------------------------------

function saveJSONFile(json, filePath, force)
{
  saveTextFile(JSON.stringify(json, null, 2), filePath, force);
}

//------------------------------------------------------------------------------

function dloadFile_p(url, filePath, force)
{
  return dloadURL_p(url)
  .then(text =>
  {
    saveTextFile(text, filePath, force);

    return text;
  });
}

//------------------------------------------------------------------------------

function getUserFavouriteURL(userID, page)
{
  return userFavouriteURLTemplate.replace("${userID}", userID).replace("${page}", page);
}

//------------------------------------------------------------------------------

function getFavouriteURL(page)
{
  return getUserFavouriteURL(defaultVintedUserID, page);
}

//------------------------------------------------------------------------------

function getFavouritePage_p(page)
{
  return dloadJSON_p(getFavouriteURL(page));
}

//------------------------------------------------------------------------------

function getItemPath(id)
{
  return path.join(itemIndexPath, "" + id);
}

//------------------------------------------------------------------------------

function getItemFilePath(id)
{
  return path.join(getItemPath(id), "item.json");
}

//------------------------------------------------------------------------------

function getItemThumbnailFilePath(id)
{
  return path.join(getItemPath(id), "thumbnail.jpg");
}

//------------------------------------------------------------------------------

function getItemPhotoFilePath(id, i)
{
  return path.join(getItemPath(id), "photos", "img_" + i + ".jpg");
}

//------------------------------------------------------------------------------

function getItem(id)
{
  return JSON.parse(fs.readFileSync(getItemFilePath(id)));
}

//------------------------------------------------------------------------------

function getItems(ids)
{
  var items = [];

  for(var i = 0; i < ids.length; i++)
  {
    items[i] = getItem(ids[i]);
  }

  return items;
}

//------------------------------------------------------------------------------

function itemIsSold(item)
{
  if(item.item_closing_action === "sold" || item.can_be_sold === false || item.instant_buy === false || item.can_buy === false) return true
  else return false;
}

//------------------------------------------------------------------------------

function dloadItemThumbnail_p(item)
{
  return downloadFile_p(item.photos[0].thumbnails[2].url, getItemThumbnailFilePath(item.id), true);
}

//------------------------------------------------------------------------------

function dloadItemPhoto_p(item, i, force)
{
  return downloadFile_p(item.photos[i].full_size_url, getItemPhotoFilePath(item.id, i), force);
}

//------------------------------------------------------------------------------

function dloadItemPhotos_p(item, force)
{
  var q = new Queue();
  var photos = item.photos;
  for(var i = 0; i < photos.length; i++)
  {
    q.add(dloadItemPhoto_p, [item, i, force]);
  }

  return q.exec();
}

//------------------------------------------------------------------------------

function updateItemFiles(item, force)
{
  // todo check what to update, but keep it sync: json, thumb, photos, tags, etc.
  // returns true if has updated overwriting, false if skipped because existing and nothing changed

  saveJSONFile(item, filePath, force);

  if(itemIsSold(item))
  {
    addItemToTag(item.id, soldTag);
  }

  addItemToTag(id, uncategorizedTag);
  addItemToTag(id, item.brand, "brand");
  addItemToTag(id, item.user_login, "user");

  return true;
}

//------------------------------------------------------------------------------

function updateItem_p(id)
{
  return dloadJSON_p(itemURLTemplate.replace("${itemID}", id))
  .then(item =>
  {
    updateItemFiles(item, true);

    return item;
  });
}

//------------------------------------------------------------------------------

function updateItems(ids)
{
  // todo promisify with queue
  if(Array.isArray(ids))
  {
    for(var i = 0; i < ids.length; i++)
    {
      updateItem_p(ids[i]);
    }
  }
  else
  {
    updateItem_p(ids);
  }

  console.log("updateItems - updated:" + ids.length);
}

//------------------------------------------------------------------------------

function updateIndex()
{
  updateItems(fs.readdirSync(itemIndexPath));
}

//------------------------------------------------------------------------------

function orderItemsBy(ids, orderingFunction)
{
  var items = getItems(ids);

  items.sort(orderingFunction);
  // console.log(items);

  for(var i = 0; i < items.length; i++)
  {
    items[i] = "" + items[i].id;
  }
  // console.log(items);

  return items;
}

//------------------------------------------------------------------------------

function orderItemsByTime(ids)
{
  return orderItemsBy(ids, function(a, b)
  {
    // console.log(a.created_at_ts, b.created_at_ts, a.created_at_ts < b.created_at_ts);
    if(a.created_at_ts < b.created_at_ts) return -1;
    if(a.created_at_ts > b.created_at_ts) return 1;
    return 0;
  });
}

//------------------------------------------------------------------------------

function orderItemsByUser(ids)
{
  return orderItemsBy(ids, function(a, b)
  {
    // console.log(a.user_login, b.user_login, a.user_login < b.user_login);
    if(a.user_login < b.user_login) return -1;
    if(a.user_login > b.user_login) return 1;
    return 0;
  });
}

//------------------------------------------------------------------------------

async function dumpPage_p(getPagePromise_p)
{
  return await getPagePromise_p.then((page) =>
  {
    var items = page.items;
    console.log("dumpPage_p", items, page);

    if(items.length === 0) return false;

    // for(var j = 0; j < items.length; j++)
    // {
    //   var item = items[j];
    //   if(!updateItemFiles(item, force)) return false;
    // }
  });
}

//------------------------------------------------------------------------------

async function dumpPages_p(getPagePromise_p, numPagesMax, force)
{
  return new Promise((resolve, reject) =>
  {
    var hasMore = true;
    for(var i = 50; hasMore; i++)
    {
      console.log("dumpPages_p", i);

      hasMore = dumpPage_p(getPagePromise_p(i))

      console.log("dumpPages_p- return", hasMore);
    }

    resolve();
  });
}

//------------------------------------------------------------------------------

async function dumpFavourites_p(force)
{
  return new Promise((resolve, reject) =>
  {
    var hasMore = true;
    for(var i = 0; hasMore; i++)
    {
      // var page = await getFavouritePage_p(i);
      var items = page.items;
      // console.log("dumpFavourites", i, items, page);

      if(items.length === 0) break;

      for(var j = 0; j < items.length; j++)
      {
        var item = items[j];
        if(!updateItemFiles(item, force)) hasMore = false;
      }
    }

    resolve();
  });
}

//------------------------------------------------------------------------------

// function processSearchDump(search)
// {
//   fs.readdirSync(favDumpPath).forEach(fileName =>
//   {
//     console.log("processFavDump", fileName);
//
//     var fn = path.join(favDumpPath, fileName);
//     var json = JSON.parse(fs.readFileSync(fn));
//     var items = json.items;
//     for(var i = 0; i < items.length; i++)
//     {
//       var item = items[i];
//       var id = "" + item.id;
//       if(typeof id !== "string" || id === "")
//       {
//         console.log("parseFavDump id null", id, item);
//         continue;
//       }
//       var itemPath = path.join(itemIndexPath, id);
//       if(fs.existsSync(itemPath))
//       {
//         console.log("parseFavDump id exists", id, item.path);
//         continue;
//       }
//       mkdir(itemPath);
//       var itemJSONPath = path.join(itemPath, "item.json");
//       fs.writeFileSync(itemJSONPath, JSON.stringify(item, null, 2), "utf-8");
//       addItemToTag(id, uncategorizedTag);
//       addItemToTag(id, item.brand, "brand");
//       addItemToTag(id, item.user_login, "user");
//     }
//   });
// }

//------------------------------------------------------------------------------

// function processFavDump()
// {
//   fs.readdirSync(favDumpPath).forEach(fileName =>
//   {
//     console.log("processFavDump", fileName);
//
//     var fn = path.join(favDumpPath, fileName);
//     var json = JSON.parse(fs.readFileSync(fn));
//     var items = json.items;
//     for(var i = 0; i < items.length; i++)
//     {
//       var item = items[i];
//       var id = "" + item.id;
//       if(typeof id !== "string" || id === "")
//       {
//         console.log("parseFavDump id null", id, item);
//         continue;
//       }
//       var itemPath = path.join(itemIndexPath, id);
//       if(fs.existsSync(itemPath))
//       {
//         console.log("parseFavDump id exists", id, item.path);
//         continue;
//       }
//       mkdir(itemPath);
//       var itemJSONPath = path.join(itemPath, "item.json");
//       fs.writeFileSync(itemJSONPath, JSON.stringify(item, null, 2), "utf-8");
//       addItemToTag(id, uncategorizedTag);
//       addItemToTag(id, item.brand, "brand");
//       addItemToTag(id, item.user_login, "user");
//     }
//   });
// }

//------------------------------------------------------------------------------
