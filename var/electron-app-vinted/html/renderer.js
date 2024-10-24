
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
const uncategorizedTagPath = path.join(tagPath, "uncategorized");

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

function buildListElem(parent, items, id)
{
  var listElem = buildDivElem(parent, id, "item-list");
  for(var i = 0; i < items.length; i++)
  {
    addItemToListElem(listElem, items[i]);
  }
}

//------------------------------------------------------------------------------

function getTagList(tag)
{
  var items = [];

  var thisTagPath = path.join(tagPath, tag);
  fs.readdirSync(thisTagPath).forEach(itemPath =>
  {
    items.push(itemPath);
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
        // console.log("parseFavDump id exists", id, item.path);
      }
      mkdir(itemPath);
      var itemJSONPath = path.join(itemPath, "item.json");
      fs.writeFileSync(itemJSONPath, JSON.stringify(item, null, 2), "utf-8");
      mkdir(uncategorizedTagPath);
      var link = path.relative(uncategorizedTagPath, itemPath);
      var target = path.join(uncategorizedTagPath, id);
      if(!fs.existsSync(target)) fs.symlink(link, target, function(error){if(error) console.log(error);});
    }
  });
}

//------------------------------------------------------------------------------

function buildSectionGUIupdate(parent)
{
  // processFavDump();
  var items = getTagList("uncategorized");
  console.log("buildSectionGUIupdate", items);
  buildListElem(parent, items, "update");
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
