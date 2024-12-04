
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

function dloadFile_p(url, filePath, force)
{
  return invoke("browserDownloadURLPromise", url)
  .then(text =>
  {
    if(fs.existsSync(filePath))
    {
      if(force === true) fs.rmSync(filePath)
      else return;
    }

    fs.writeFileSync(filePath, text, "utf-8");

    return text;
  });
}

//------------------------------------------------------------------------------

function updateItem(id)
{
  var itemPath = path.join(itemIndexPath, id);
  var itemJSONPath = path.join(itemPath, "item.json");
  dloadFile_p(itemURLPrefix + id, itemJSONPath, true)
  .then(text =>
  {
    var item = JSON.parse(text);
    console.log(item);

    var soldFile = path.join(itemPath, "SOLD");
    if(item.item_closing_action === "sold" || item.can_be_sold === false || item.instant_buy === false || item.can_buy === false)
    {
      console.log("SOLD", item.id, "item_closing_action", item.item_closing_action, "can_be_sold", item.can_be_sold, "instant_buy", item.instant_buy, "can_buy", item.can_buy);
      fs.writeFileSync(soldFile, "");
    }
    else if(fs.existsSync(soldFile)) fs.rmSync(soldFile);
  });
}

//------------------------------------------------------------------------------

function updateItems(items)
{
  if(Array.isArray(items))
  {
    for(var i = 0; i < items.length; i++)
    {
      updateItem(items[i]);
    }
  }
  else
  {
    updateItem(items);
  }

  console.log("updateItems - updated:" + items.length);
}

//------------------------------------------------------------------------------

function updateIndex()
{
  updateItems(fs.readdirSync(itemIndexPath));
}

//------------------------------------------------------------------------------

function orderListByTime(items)
{
  var itemsObj = [];
  for(var i = 0; i < items.length; i++)
  {
    var itemFullPath = path.join(itemIndexPath, items[i]);
    itemsObj[i] = JSON.parse(fs.readFileSync(path.join(itemFullPath, "item.json")));
  }

  itemsObj.sort(function(a, b)
  {
    // console.log(a.created_at_ts, b.created_at_ts, a.created_at_ts < b.created_at_ts);
    if(a.created_at_ts < b.created_at_ts) return -1;
    if(a.created_at_ts > b.created_at_ts) return 1;
    return 0;
  });
  // console.log(itemsObj);

  for(var i = 0; i < itemsObj.length; i++)
  {
    var itemFullPath = path.join(itemIndexPath, items[i]);
    itemsObj[i] = "" + itemsObj[i].id;
  }
  // console.log(itemsObj);

  return itemsObj;
}

//------------------------------------------------------------------------------

function orderListByUser(items)
{
  var itemsObj = [];
  for(var i = 0; i < items.length; i++)
  {
    var itemFullPath = path.join(itemIndexPath, items[i]);
    itemsObj[i] = JSON.parse(fs.readFileSync(path.join(itemFullPath, "item.json")));
  }

  itemsObj.sort(function(a, b)
  {
    // console.log(a.user_login, b.user_login, a.user_login < b.user_login);
    if(a.user_login < b.user_login) return -1;
    if(a.user_login > b.user_login) return 1;
    return 0;
  });
  // console.log(itemsObj);

  for(var i = 0; i < itemsObj.length; i++)
  {
    var itemFullPath = path.join(itemIndexPath, items[i]);
    itemsObj[i] = "" + itemsObj[i].id;
  }
  // console.log(itemsObj);

  return itemsObj;
}

//------------------------------------------------------------------------------

function processSearchDump(search)
{
  fs.readdirSync(favDumpPath).forEach(fileName =>
  {
    console.log("processFavDump", fileName);

    var fn = path.join(favDumpPath, fileName);
    var json = JSON.parse(fs.readFileSync(fn));
    var items = json.items;
    for(var i = 0; i < items.length; i++)
    {
      var item = items[i];
      var id = "" + item.id;
      if(typeof id !== "string" || id === "")
      {
        console.log("parseFavDump id null", id, item);
        continue;
      }
      var itemPath = path.join(itemIndexPath, id);
      if(fs.existsSync(itemPath))
      {
        console.log("parseFavDump id exists", id, item.path);
        continue;
      }
      mkdir(itemPath);
      var itemJSONPath = path.join(itemPath, "item.json");
      fs.writeFileSync(itemJSONPath, JSON.stringify(item, null, 2), "utf-8");
      addItemToTag(id, uncategorizedTag);
      addItemToTag(id, item.brand, "brand");
      addItemToTag(id, item.user_login, "user");
    }
  });
}

//------------------------------------------------------------------------------

function processFavDump()
{
  fs.readdirSync(favDumpPath).forEach(fileName =>
  {
    console.log("processFavDump", fileName);

    var fn = path.join(favDumpPath, fileName);
    var json = JSON.parse(fs.readFileSync(fn));
    var items = json.items;
    for(var i = 0; i < items.length; i++)
    {
      var item = items[i];
      var id = "" + item.id;
      if(typeof id !== "string" || id === "")
      {
        console.log("parseFavDump id null", id, item);
        continue;
      }
      var itemPath = path.join(itemIndexPath, id);
      if(fs.existsSync(itemPath))
      {
        console.log("parseFavDump id exists", id, item.path);
        continue;
      }
      mkdir(itemPath);
      var itemJSONPath = path.join(itemPath, "item.json");
      fs.writeFileSync(itemJSONPath, JSON.stringify(item, null, 2), "utf-8");
      addItemToTag(id, uncategorizedTag);
      addItemToTag(id, item.brand, "brand");
      addItemToTag(id, item.user_login, "user");
    }
  });
}

//------------------------------------------------------------------------------
