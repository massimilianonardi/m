
//------------------------------------------------------------------------------

// dump
// - fav
// - search / [named-searches]
// index / [id] /
// - item.json
// - thumbnail.jpg
// - photo / [hi-res-photos]
// - tags / [link-to-tag-dir]
// group
// - brand
// - country
// - user
// - status / sold, untagged, hidden, reserved, favourite
// - tag / [tags] + sold + uncategorized
// order
// - brand
// - country
// - user
// - status
// - tag
// search / [named-json-search-url]

//------------------------------------------------------------------------------

const dataPath = "/m/_vinted";

const dumpPath = path.join(dataPath, "dump");
const favDumpPath = path.join(dumpPath, "fav");
const searchDumpPath = path.join(dumpPath, "search");

const itemIndexPath = path.join(dataPath, "index");

const groupPath = path.join(dataPath, "group");

const brandGroup = "brand";
const countryGroup = "country";
const userGroup = "user";
const tagGroup = "tag";
const statusGroup = "status";

// const brandGroupPath = path.join(groupPath, "brand");
// const countryGroupPath = path.join(groupPath, "country");
// const userGroupPath = path.join(groupPath, "user");
// const tagGroupPath = path.join(groupPath, "tag");
// const statusGroupPath = path.join(groupPath, "status");

const soldStatus = "sold";
const untaggedStatus = "untagged";
const hiddenStatus = "hidden";
const reservedStatus = "reserved";
const favouriteStatus = "favourite";

// const soldStatusGroupPath = path.join(statusGroupPath, "sold");
// const untaggedStatusGroupPath = path.join(statusGroupPath, "untagged");
// const hiddenStatusGroupPath = path.join(statusGroupPath, "hidden");
// const reservedStatusGroupPath = path.join(statusGroupPath, "reserved");
// const favouriteStatusGroupPath = path.join(statusGroupPath, "favourite");

const orderPath = path.join(dataPath, "order");

// const brandOrderPath = path.join(orderPath, "brand");
// const countryOrderPath = path.join(orderPath, "country");
// const userOrderPath = path.join(orderPath, "user");
// const tagOrderPath = path.join(orderPath, "tag");
// const statusOrderPath = path.join(orderPath, "status");

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
  var _startPage = startPage;
  var _endPage = endPage;

  if(typeof _startPage !== "number" && typeof _startPage === "string") _startPage = parseInt(_startPage);
  if(typeof _startPage !== "number") _startPage = 0;
  if(typeof _endPage !== "number" && typeof _endPage === "string") _endPage = parseInt(_endPage);
  if(typeof _endPage !== "number") _endPage = 999;

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
