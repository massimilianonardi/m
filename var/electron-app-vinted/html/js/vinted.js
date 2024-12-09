
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
const searchURLTemplate = "https://www.vinted.it/api/v2/catalog/items?page=${page}&per_page=96&time=1732028313&search_text=hot+wheels&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=";

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
    else return false;
  }

  mkdir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, "utf-8");

  return true
}

//------------------------------------------------------------------------------

function saveJSONFile(json, filePath, force)
{
  return saveTextFile(JSON.stringify(json, null, 2), filePath, force);
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

function getSearchPage_p(page)
{
  return dloadJSON_p(searchURLTemplate.replace("${page}", page));
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

  if(!saveJSONFile(item, getItemFilePath(item.id), force)) return false;

  // if(itemIsSold(item))
  // {
  //   addItemToTag(item.id, soldTag);
  // }
  //
  // addItemToTag(id, uncategorizedTag);
  // addItemToTag(id, item.brand, "brand");
  // addItemToTag(id, item.user_login, "user");

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

function updateItems_p(ids, recursionIndex)
{
  if(Array.isArray(ids))
  {
    var index = 0;
    if(typeof recursionIndex !== "undefined") index = recursionIndex;
    if(index < ids.length) return updateItem_p(ids[index]).then((res) => {return updateItems_p(ids, index + 1);})
    else return true;
  }
  else
  {
    return updateItem_p(ids);
  }
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

function ______dumpPages_p(getPageFunction_p, pageDir, startPage, endPage, force, quitOnExisting, jobID)
{
  var _jobID = jobID;
  if(typeof _jobID !== "string" && typeof _jobID !== "number") _jobID = new Date().getMilliseconds();

  // todo load last saved page to be checked against every pagewith fuzzy match to understand when to stop
  // because further pages where already processed in the past
  if(startPage <= endPage) return getPageFunction_p(startPage).then((page) =>
  {
    // todo check last saved page with fuzzy match to understand when to stop
    // because further pages where already processed in the past
    var pageName = "dumpItemsPage_" + _jobID + "_" + (999 - startPage);
    saveJSONFile(page, path.join(pageDir, pageName), false);

    var items = page.items;
    console.log("dumpPage_p", [items], page);

    if(typeof items === "undefined" || items.length === 0) return true;

    for(var j = 0; j < items.length; j++)
    {
      var item = items[j];
      console.log("dumpPage_p - item", item, page);
      if(quitOnExisting && !updateItemFiles(item, force)) return false;
    }

    return dumpPage_p(getPageFunction_p, pageDir, startPage + 1, endPage, force, quitOnExisting, _jobID);
  });
}

//------------------------------------------------------------------------------

function dumpPages_p(getPageFunction_p, pageDir, startPage, endPage, force, quitOnExisting, jobID)
{
  var _jobID = jobID;
  if(typeof _jobID !== "string" && typeof _jobID !== "number") _jobID = new Date().getMilliseconds();

  if(startPage <= endPage) return getPageFunction_p(startPage).then((page) =>
  {
    var pageName = "dumpItemsPage_" + _jobID + "_" + (999 - startPage);
    saveJSONFile(page, path.join(pageDir, pageName), false);

    var items = page.items;
    console.log("dumpPage_p", [items], page);

    if(typeof items === "undefined" || items.length === 0) return true;

    for(var j = 0; j < items.length; j++)
    {
      var item = items[j];
      console.log("dumpPage_p - item", item, page);
      if(quitOnExisting && !updateItemFiles(item, force)) return false;
    }

    return dumpPages_p(getPageFunction_p, pageDir, startPage + 1, endPage, force, quitOnExisting, _jobID);
  });
}

//------------------------------------------------------------------------------

function ___dumpPages_p(getPageFunction_p, startPage, endPage, force, quitOnExisting)
{
  if(startPage <= endPage) return getPageFunction_p(startPage).then((page) =>
  {
    var items = page.items;
    console.log("dumpPage_p", [items], page);

    if(typeof items === "undefined" || items.length === 0) return true;

    for(var j = 0; j < items.length; j++)
    {
      var item = items[j];
      console.log("dumpPage_p - item", item, page);
      if(quitOnExisting && !updateItemFiles(item, force)) return false;
    }

    return dumpPages_p(getPageFunction_p, startPage + 1, endPage, force, quitOnExisting);
  });
}

//------------------------------------------------------------------------------

function dumpFavourites_p(force)
{
  return dumpPages_p(getFavouritePage_p, favDumpPath, 0, 99, force, false);
  // return dumpPages_p(getFavouritePage_p, 0, 99, force, false);
}

//------------------------------------------------------------------------------
