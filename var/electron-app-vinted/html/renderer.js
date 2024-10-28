
//------------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const https = require("https");
const {shell} = require("electron");

//------------------------------------------------------------------------------

const dataPath = "/m/_vinted";
const favDumpPath = path.join(dataPath, "dump", "fav");
const itemIndexPath = path.join(dataPath, "item", "index");
const tagPath = path.join(dataPath, "tag");
const orderPath = path.join(dataPath, "order");
const tagOrderPath = path.join(orderPath, "tag");

const uncategorizedTag = "uncategorized";
const uncategorizedTagPath = path.join(tagPath, uncategorizedTag);

//------------------------------------------------------------------------------

function mkdir(dir)
{
  if(!fs.existsSync(dir))
  {
    fs.mkdirSync(dir, {recursive: true});
  }
}

//------------------------------------------------------------------------------

function buildHRImage(parent, url)
{
  return buildImage(parent, url, null, "hr-image");
}

//------------------------------------------------------------------------------

function buildThumbnail(parent, url)
{
  return buildImage(parent, url, null, "thumbnail");
}

//------------------------------------------------------------------------------

function addThumbnailToItemElem(parent, itemID, url, clickCallback)
{
  var itemFullPath = path.join(itemIndexPath, itemID);
  var thPath = path.join(itemFullPath, "thumbnail.jpg");

  var img = buildThumbnail(parent);
  img.onclick = clickCallback;

  if(!fs.existsSync(thPath) || fs.statSync(thPath).size === 0)
  {
    var fstream = fs.createWriteStream(thPath);
    var req = https.get(url, (res) =>
    {
      res.pipe(fstream);
      res.on("end", () =>
      {
        img.src = thPath;
      });
    })
    .on("error", (error) => {console.error(error.message);});
  }
  else
  {
    img.src = thPath;
  }
}

//------------------------------------------------------------------------------

function addItemToListElem(parent, itemID)
{
  var itemFullPath = path.join(itemIndexPath, itemID);
  var item = JSON.parse(fs.readFileSync(path.join(itemFullPath, "item.json")));

  var itemElem = buildDivElem(parent, item.id, "item");
  itemElem.vintedItem = item;

  // brand city country created_at label title description id path photos price_numeric service_fee total_item_price status url user_login
  // instant_buy is_closed is_for_sell is_hidden is_reserved is_visible
  // buildImage(itemElem, item.photos[0].full_size_url);
  // buildImage(itemElem, item.photos[0].thumbnails[0].url);

  var desc_1 = buildDivElem(itemElem, null, "description");
  buildCheckbox(desc_1, null, "selector", false, function(event)
  {
    // console.log(event);
    if(event.srcElement.checked)
    {
      // console.log(itemID, true);
      parent.selection[itemID] = true;
      parent.selectionOrder.push(itemID);
    }
    else
    {
      // console.log(itemID, false);
      delete parent.selection[itemID];
      parent.selectionOrder.splice(parent.selectionOrder.indexOf(itemID), 1);
    }
    console.log(parent.selection, parent.selectionOrder);
  });
  buildDivElem(desc_1, null, "user", item.user_login);
  buildDivElem(desc_1, null, "price", "" + parseInt(parseFloat(item.price_numeric) + 0.5) + " €");
  buildDivElem(desc_1, null, "price", "" + parseInt(parseFloat(item.total_item_price) + 0.5) + " €");

  var desc_2 = buildDivElem(itemElem, null, "description");
  buildDivElem(desc_2, null, null, item.title);

  addThumbnailToItemElem(itemElem, itemID, item.photos[0].thumbnails[2].url, function()
  {
    // window.open(item.url);
    shell.openExternal(item.url);
  });
}

//------------------------------------------------------------------------------

function clearSelection(listElem)
{
  listElem.selection = {};
  listElem.selectionOrder = [];
  // var items = listElem.getElementsByTagName("input");
  var items = listElem.querySelectorAll("input[type='checkbox']");
  for(var i = 0; i < items.length; i++)
  {
    // if(items[i].type === "checkbox") items[i].checked = false;
    items[i].checked = false;
  }
}

//------------------------------------------------------------------------------

function buildPaginatedListElem(parent, items, id, nItemsPerPage)
{
}

//------------------------------------------------------------------------------

function buildListElem(parent, items, id)
{
  var listElem = buildDivElem(parent, id, "item-list");
  listElem.selection = {};
  listElem.selectionOrder = [];
  for(var i = 0; i < items.length; i++)
  {
    addItemToListElem(listElem, items[i]);
  }

  return listElem;
}

//------------------------------------------------------------------------------

function addItemToTag(itemID, tag)
{
  var thisTagPath = path.join(tagPath, tag);
  var itemPath = path.join(itemIndexPath, itemID);

  mkdir(thisTagPath);
  var link = path.relative(thisTagPath, itemPath);
  var target = path.join(thisTagPath, itemID);
  if(!fs.existsSync(target)) fs.symlink(link, target, function(error){if(error) console.log(error);});
  // todo reverse link to query tags of a particular item (put into item dir??? yes!)
}

//------------------------------------------------------------------------------

function remItemToTag(item, tag)
{
}

//------------------------------------------------------------------------------

function getTags()
{
  var tags = [];

  fs.readdirSync(tagPath).forEach(thisTagPath =>
  {
    tags.push(thisTagPath);
  });

  return tags;
}

//------------------------------------------------------------------------------

function getTagList(tag)
{
  var items = [];
  var orderedItems = {};

  var thisTagPath = path.join(tagPath, tag);
  if(!fs.existsSync(thisTagPath)) return items;

  var thisTagOrderPath = path.join(tagOrderPath, tag + ".json");
  if(fs.existsSync(thisTagOrderPath))
  {
    items = JSON.parse(fs.readFileSync(thisTagOrderPath));
    for(var i = 0; i < items.length; i++)
    {
      orderedItems[items[i]] = true;
    }
  }

  fs.readdirSync(thisTagPath).forEach(itemPath =>
  {
    // items.push(itemPath);
    // if(-1 === items.indexOf(itemPath)) items.push(itemPath);
    if(!orderedItems[itemPath]) items.push(itemPath);
  });

  return items;
}

//------------------------------------------------------------------------------

function updateItem(item)
{
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
    console.log(a.created_at_ts, b.created_at_ts, a.created_at_ts < b.created_at_ts);
    if(a.created_at_ts < b.created_at_ts) return -1;
    if(a.created_at_ts > b.created_at_ts) return 1;
    return 0;
  });
  console.log(itemsObj);
  // todo translate itemsObj into items

  return items;
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

function refreshListElem(listElem)
{
  listElem.innerHTML = "";
  var startIndex = listElem.currentPage * listElem.itemsPerPage;
  var endIndex = startIndex + listElem.itemsPerPage;
  var items = listElem.items.slice(startIndex, endIndex);
  for(var i = 0; i < items.length; i++)
  {
    addItemToListElem(listElem, items[i]);
  }
}

//------------------------------------------------------------------------------

function addTag(parent, tag)
{
  buildButton(parent, "tag", "button", tag, function()
  {
    var listElem = getSection("update").listElem;
    listElem.items = getTagList(tag);
    refreshListElem(listElem);
  });
}

//------------------------------------------------------------------------------

function addTags(parent, tags)
{
  for(var i = 0; i < tags.length; i++)
  {
    addTag(parent, tags[i]);
  }
}

//------------------------------------------------------------------------------

function buildSectionGUIupdate(parent)
{
  var toolbar = buildDivElem(parent, null, "toolbar");

  var currPage = buildButton(toolbar, "current_page", "text-indicator", "0");
  var prevPage = buildButton(toolbar, "prev_page", "button", "Prev Page", function()
  {
    listElem.currentPage--;
    if(listElem.currentPage < 0) listElem.currentPage = 0;
    // currPage.innerText = "" + listElem.currentPage;
    currPage.value = "" + listElem.currentPage;
    refreshListElem(parent.listElem);
  });
  var nextPage = buildButton(toolbar, "next_page", "button", "Next Page", function()
  {
    listElem.currentPage++;
    if(listElem.items.length < listElem.currentPage * listElem.itemsPerPage) listElem.currentPage--;
    // currPage.innerText = "" + listElem.currentPage;
    currPage.value = "" + listElem.currentPage;
    refreshListElem(parent.listElem);
  });

  var unselectAll = buildButton(toolbar, "unselect_all", "button", "Unselect All", function(){clearSelection(parent.listElem);});

  var orderTime = buildButton(toolbar, "order_time", "button", "Order by Time", function()
  {
    listElem.items = orderListByTime(listElem.items);
    refreshListElem(parent.listElem);
  });

  var tags = getTags();
  addTags(toolbar, tags);

  var listElem = buildDivElem(parent, "update_list", "item-list");
  parent.listElem = listElem;
  listElem.selection = {};
  listElem.selectionOrder = [];
  listElem.items = [];
  listElem.itemsPerPage = 999;
  listElem.currentPage = 0;
}

//------------------------------------------------------------------------------

function buildSectionGUIorganize(parent)
{
}

//------------------------------------------------------------------------------

function buildSectionGUIsearch(parent)
{
}

//------------------------------------------------------------------------------

function main()
{
  console.log("main");

  buildSection("update", buildSectionGUIupdate);
  buildSection("organize", buildSectionGUIorganize);
  buildSection("search", buildSectionGUIsearch);
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
