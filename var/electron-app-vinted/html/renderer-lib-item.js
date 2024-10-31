
//------------------------------------------------------------------------------

function updateItem(id)
{
  var itemPath = path.join(itemIndexPath, id);
  var itemJSONPath = path.join(itemPath, "item.json");
  var item = JSON.parse(fs.readFileSync(itemJSONPath, "utf-8"));
  addItemToTag(id, item.brand, "brand");
  addItemToTag(id, item.user_login, "user");
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
  var items = [];

  fs.readdirSync(itemIndexPath).forEach(itemID => {items.push(itemID);});
  updateItems(items);
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
    }
  });
}

//------------------------------------------------------------------------------
