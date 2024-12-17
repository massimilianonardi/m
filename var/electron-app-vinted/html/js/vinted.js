
//------------------------------------------------------------------------------

// dump
// - fav
// - search / [named-searches]
// index / [id] /
// - item.json
// - thumbnail.jpg
// - photo / [hi-res-photos]
// group
// - brand
// - country
// - user
// - status / sold, untagged, hidden, reserved
// - tag / [tags] + sold + uncategorized
// order
// - brand
// - country
// - user
// - status
// - tag

//------------------------------------------------------------------------------

const dataPath = "/m/_vinted";

const dumpPath = path.join(dataPath, "dump");
const favDumpPath = path.join(dumpPath, "fav");
const searchDumpPath = path.join(dumpPath, "search");

const itemIndexPath = path.join(dataPath, "index");

const groupPath = path.join(dataPath, "group");

const brandGroupPath = path.join(groupPath, "brand");
const countryGroupPath = path.join(groupPath, "country");
const userGroupPath = path.join(groupPath, "user");
const tagGroupPath = path.join(groupPath, "tag");
const statusGroupPath = path.join(groupPath, "status");

const soldStatusGroupPath = path.join(statusGroupPath, "sold");
const untaggedStatusGroupPath = path.join(statusGroupPath, "untagged");
const hiddenStatusGroupPath = path.join(statusGroupPath, "hidden");
const reservedStatusGroupPath = path.join(statusGroupPath, "reserved");

const orderPath = path.join(dataPath, "order");

const brandOrderPath = path.join(orderPath, "brand");
const countryOrderPath = path.join(orderPath, "country");
const userOrderPath = path.join(orderPath, "user");
const tagOrderPath = path.join(orderPath, "tag");
const statusOrderPath = path.join(orderPath, "status");

//------------------------------------------------------------------------------

const defaultVintedUserID = "155761817";

// const itemURLPrefix = "https://www.vinted.it/api/v2/items/";

const itemURLTemplate = "https://www.vinted.it/api/v2/items/${itemID}";
const userFavouriteURLTemplate = "https://www.vinted.it/api/v2/users/${userID}/items/favourites?page=${page}&include_sold=true&per_page=90";
const searchURLTemplate = "https://www.vinted.it/api/v2/catalog/items?page=${page}&per_page=96&time=1732028313&search_text=hot+wheels&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=";

//------------------------------------------------------------------------------
// PROXY FUNCTIONS TO DEDICATED VINTED WINDOW
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
// DOWNLOAD
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
  if(fs.existsSync(filePath))
  {
    if(force === true) fs.rmSync(filePath)
    else return false;
  }

  mkdir(path.dirname(filePath));

  return dloadURL_p(url)
  .then(text =>
  {
    fs.writeFileSync(filePath, text, "utf-8");

    return text;
  });
}

//------------------------------------------------------------------------------

// function ___dloadFile_p(url, filePath, force)
// {
//   return dloadURL_p(url)
//   .then(text =>
//   {
//     saveTextFile(text, filePath, force);
//
//     return text;
//   });
// }

//------------------------------------------------------------------------------
// FAVOURITES AND SEARCH
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

// function getSearchPage_p(page)
// {
//   return dloadJSON_p(searchURLTemplate.replace("${page}", page));
// }

//------------------------------------------------------------------------------

function getSearchPagePromiseCallback(searchURL)
{
  return function(page){dloadJSON_p(searchURL.replace("${page}", page));};
}

//------------------------------------------------------------------------------
// ITEM
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

function getItemTagPath(id, tag)
{
  return path.join(getItemPath(id), "tags", tag);
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

function itemIsUntagged(id)
{
  // todo
  return true;
  // return fs.readdirSync(getItemTagPath(id, "")).length === 0;
}

//------------------------------------------------------------------------------

function itemIsHidden(id)
{
  // todo
}

//------------------------------------------------------------------------------

function itemIsReserved(id)
{
  // todo
}

//------------------------------------------------------------------------------

function dloadItemThumbnail_p(item)
{
  // return downloadFile_p(item.photos[0].thumbnails[2].url, getItemThumbnailFilePath(item.id), true);
  return downloadFile_p(item.photos[0].thumbnails[2].url, getItemThumbnailFilePath(item.id), false);
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
// GROUPS AND TAGS
//------------------------------------------------------------------------------

function getGroupPath(group, name)
{
  return path.join(groupPath, group, name);
}

//------------------------------------------------------------------------------

function getBrandGroupPath(brand)
{
  return path.join(brandGroupPath, brand);
}

//------------------------------------------------------------------------------

function getCountryGroupPath(country)
{
  return path.join(countryGroupPath, country);
}

//------------------------------------------------------------------------------

function getUserGroupPath(user)
{
  return path.join(userGroupPath, user);
}

//------------------------------------------------------------------------------

function getStatusGroupPath(status)
{
  return path.join(statusGroupPath, status);
}

//------------------------------------------------------------------------------

function getStatusItems(status)
{
  var items = [];

  var thisStatusPath = getStatusGroupPath(status);

  fs.readdirSync(thisStatusPath).forEach(id =>
  {
    items.push(getItem(id));
  });

  return items;
}

//------------------------------------------------------------------------------

function addItemToGroup(id, group, name)
{
  var thisGroupPath = getGroupPath(group, name);
  var itemPath = getItemPath(id);

  mkdir(thisGroupPath);
  var link = path.relative(thisGroupPath, itemPath);
  var target = path.join(thisGroupPath, "" + id);
  if(!fs.existsSync(target)) fs.symlink(link, target, function(error){if(error) console.log(error);});
}

//------------------------------------------------------------------------------

function remItemToGroup(id, group, name)
{
  var target = path.join(getGroupPath(group, name), "" + id);
  if(fs.existsSync(target)) fs.rmSync(target);
}

//------------------------------------------------------------------------------

function getTagPath(tag)
{
  return path.join(tagGroupPath, tag);
}

//------------------------------------------------------------------------------

function getTagOrderedItemsPath(tag)
{
  return path.join(tagOrderPath, tag + ".json");
}

//------------------------------------------------------------------------------

function getTagOrderedItems(tag)
{
  var items = [];

  var thisTagOrderPath = getTagOrderedItemsPath(tag);
  if(fs.existsSync(thisTagOrderPath)) items = JSON.parse(fs.readFileSync(thisTagOrderPath));

  return items;
}

//------------------------------------------------------------------------------

function setTagOrderedItems(tag, items)
{
  return saveJSONFile(items, getTagOrderedItemsPath(tag), true);
}

//------------------------------------------------------------------------------

function addItemToTag(id, tag)
{
  if(!tag || tag === "")
  {
    console.log("addItemToTag - invalid tag:" + tag);
    return;
  }

  var thisTagPath = getTagPath(tag);
  var itemPath = getItemPath(id);

  mkdir(thisTagPath);
  var link = path.relative(thisTagPath, itemPath);
  var target = path.join(thisTagPath, id);
  if(!fs.existsSync(target)) fs.symlink(link, target, function(error){if(error) console.log(error);});

  // reverse link from item index to tag
  link = path.relative(itemPath, thisTagPath);
  target = getItemTagPath(id, tag);
  if(!fs.existsSync(target)) fs.symlink(link, target, function(error){if(error) console.log(error);});
}

//------------------------------------------------------------------------------

function remItemToTag(id, tag)
{
  if(!tag || tag === "")
  {
    console.log("addItemToTag - invalid tag:" + tag);
    return;
  }

  var thisTagPath = getTagPath(tag);

  var target = path.join(thisTagPath, "" + id);
  if(fs.existsSync(target)) fs.rmSync(target);

  // reverse link from item index to tag
  target = getItemTagPath(id, tag);
  if(fs.existsSync(target)) fs.rmSync(target);
}

//------------------------------------------------------------------------------

function getTags()
{
  return lsdir(tagGroupPath);
}

//------------------------------------------------------------------------------

function getTagItems(tag)
{
  var items = [];
  var orderedItems = {};

  var thisTagPath = getTagPath(tag);
  // if(!fs.existsSync(thisTagPath)) return items;

  items = getTagOrderedItems(tag);
  // fill temp object for faster searches during dir read for not ordered items
  for(var i = 0; i < items.length; i++)
  {
    orderedItems[items[i]] = true;
  }

  fs.readdirSync(thisTagPath).forEach(id =>
  {
    // items.push(id);
    // if(-1 === items.indexOf(id)) items.push(id);
    // if(!orderedItems[id]) items.push(id);
    // if(!orderedItems[id]) if(fs.existsSync(path.join(thisTagPath, id, "item.json"))) items.push(id);
    if(!orderedItems[id]) items.push(id);
  });

  return items;
}

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

function updateItemFiles(item, force)
{
  if(!saveJSONFile(item, getItemFilePath(item.id), force)) return false;

  if(itemIsSold(item))
  {
    // addItemToGroupStatusSold(item.id);
    addItemToGroup(item.id, "status", "sold");
  }

  if(itemIsUntagged(item))
  {
    // addItemToGroupStatusUntagged(item.id);
    addItemToGroup(item.id, "status", "untagged");
  }

  // addItemToGroupBrand(item.brand, id);
  // addItemToGroupUser(item.user_login, id);
  addItemToGroup(item.id, "brand", item.brand);
  addItemToGroup(item.id, "user", item.user_login);

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
  updateItems_p(fs.readdirSync(itemIndexPath));
}

//------------------------------------------------------------------------------
// ORDER
//------------------------------------------------------------------------------

function orderItemsBy(items, orderingFunction)
{
  return items.sort(orderingFunction);
}

//------------------------------------------------------------------------------

function orderItemsByTime(items)
{
  return orderItemsBy(items, function(a, b)
  {
    // console.log(a.created_at_ts, b.created_at_ts, a.created_at_ts < b.created_at_ts);
    if(a.created_at_ts < b.created_at_ts) return -1;
    if(a.created_at_ts > b.created_at_ts) return 1;
    return 0;
  });
}

//------------------------------------------------------------------------------

function orderItemsByUser(items)
{
  return orderItemsBy(items, function(a, b)
  {
    // console.log(a.user_login, b.user_login, a.user_login < b.user_login);
    if(a.user_login < b.user_login) return -1;
    if(a.user_login > b.user_login) return 1;
    return 0;
  });
}

//------------------------------------------------------------------------------
// DUMP
//------------------------------------------------------------------------------

function processDumpPage(filePath, forceOrQuitOnExisting)
{
  var page = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  var items = page.items;

  if(typeof items === "undefined" || items.length === 0) return null;

  for(var i = 0; i < items.length; i++)
  {
    if(!updateItemFiles(items[i], forceOrQuitOnExisting) && forceOrQuitOnExisting === false) return false;
  }

  return true;
}

//------------------------------------------------------------------------------

function processDumpPages(filePaths, forceOrQuitOnExisting)
{
  for(var i = 0; i < filePaths.length; i++)
  {
    var res = processDumpPage(filePaths[i], forceOrQuitOnExisting);
    console.log("processDumpPage", filePaths[i], forceOrQuitOnExisting, res);
    if(res === false) return false;
  }
}

//------------------------------------------------------------------------------

// todo another function to process a dump jobid
// todo load last saved page to be checked against every pagewith fuzzy match to understand when to stop
// because further pages where already processed in the past
// todo check last saved page with fuzzy match to understand when to stop
// because further pages where already processed in the past
function dumpPages_p(getPageFunction_p, pageDir, startPage, endPage, jobID)
{
  var _jobID = typeof jobID === "string" ? jobID : "" + new Date().getTime();
  var _startPage = typeof startPage === "number" ? startPage : 0;
  var _endPage = typeof endPage === "number" ? endPage : 999;

  if(_startPage <= _endPage) return getPageFunction_p(_startPage).then((page) =>
  {
    var pageName = "dumpItemsPage_" + _jobID + "_" + (999 - _startPage) + ".json";
    saveJSONFile(page, path.join(pageDir, _jobID, pageName), false);

    var items = page.items;
    console.log("dumpPage_p", pageName, [items], page);

    if(typeof items === "undefined" || items.length === 0) return true;

    return dumpPages_p(getPageFunction_p, pageDir, _startPage + 1, _endPage, _jobID);
  });
}

//------------------------------------------------------------------------------

// function dumpPages_p(getPageFunction_p, pageDir, startPage, endPage, force, quitOnExisting, jobID)
// {
//   var _jobID = jobID;
//   if(typeof _jobID !== "string" && typeof _jobID !== "number") _jobID = "" + new Date().getTime();
//
//   if(startPage <= endPage) return getPageFunction_p(startPage).then((page) =>
//   {
//     var pageName = "dumpItemsPage_" + _jobID + "_" + (999 - startPage);
//     saveJSONFile(page, path.join(pageDir, pageName), false);
//
//     var items = page.items;
//     console.log("dumpPage_p", [items], page);
//
//     if(typeof items === "undefined" || items.length === 0) return true;
//
//     for(var j = 0; j < items.length; j++)
//     {
//       var item = items[j];
//       console.log("dumpPage_p - item", item, page);
//       if(!updateItemFiles(item, force) && quitOnExisting) return false;
//     }
//
//     return dumpPages_p(getPageFunction_p, pageDir, startPage + 1, endPage, force, quitOnExisting, _jobID);
//   });
// }

//------------------------------------------------------------------------------

function dumpFavourites_p(startPage, endPage)
{
  return dumpPages_p(getFavouritePage_p, favDumpPath, startPage, endPage);
}

//------------------------------------------------------------------------------
