
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

var sections = {};

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
  var e = document.createElement("img");
  if(typeof url === "string") e.src = url;
  e.classList.add("hr-image");

  parent.appendChild(e);

  return e;
}

//------------------------------------------------------------------------------

function buildImage(parent, url)
{
  var e = document.createElement("img");
  if(typeof url === "string") e.src = url;
  e.classList.add("thumbnail");

  parent.appendChild(e);

  return e;
}

//------------------------------------------------------------------------------

function buildElem(parent, id, css_class, text)
{
  var e = document.createElement("div");
  if(typeof id === "string") e.id = id;
  if(typeof css_class === "string") e.classList.add(css_class);
  if(typeof text === "string") e.innerText = text;

  parent.appendChild(e);

  return e;
}

//------------------------------------------------------------------------------

function addItemToPage(parent, itemPath)
{
  var itemFullPath = path.join(itemIndexPath, itemPath);
  var item = JSON.parse(fs.readFileSync(path.join(itemFullPath, "item.json")));
  var e = buildElem(parent, item.id, "item");
  e.vintedItem = item;

  // brand city country created_at label title description id path photos price_numeric service_fee total_item_price status url user_login
  // instant_buy is_closed is_for_sell is_hidden is_reserved is_visible

  var desc = buildElem(e, null, "description");
  buildElem(desc, null, "user", item.user_login);
  buildElem(desc, null, "price", "" + parseInt(parseFloat(item.price_numeric) + 0.5) + " €");
  buildElem(desc, null, "price", "" + parseInt(parseFloat(item.total_item_price) + 0.5) + " €");
  // buildElem(desc, null, "price", "€" + item.price_numeric);
  // buildElem(desc, null, "price", "€" + item.total_item_price);

  var desc = buildElem(e, null, "description");
  buildElem(desc, null, null, item.title);

  var thPath = path.join(itemFullPath, "thumbnail.jpg");
  var img = buildImage(e);
  img.onclick = function()
  {
    console.log("clicked");
    // window.open(item.url);
    shell.openExternal(item.url);
  };
  if(!fs.existsSync(thPath) || fs.statSync(thPath).size === 0)
  {
    var url = item.photos[0].thumbnails[2].url;
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

  // buildImage(e, item.photos[0].full_size_url);
  // buildImage(e, item.photos[0].thumbnails[0].url);
}

//------------------------------------------------------------------------------

function addListToPage(parent, items)
{
  console.log("addListToPage", items);
  var p = buildElem(parent, null, "item-list");
  for(var i = 0; i < items.length; i++)
  {
    addItemToPage(p, items[i]);
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

function parseFavDump()
{
  fs.readdirSync(favDumpPath).forEach(fileName =>
  {
    console.log("parseFavDump", fileName);

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
  parseFavDump();
  var items = getTagList("uncategorized");
  console.log("buildSectionGUIupdate", items);
  addListToPage(parent, items);
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

function buildSection(name, resetFunction)
{
  var section = document.createElement("div");
  section.id = name;
  section.resetFunction = resetFunction;
  section.classList.add("section");
  section.style.display = "none";

  document.body.appendChild(section);
  sections[name] = section;

  resetSection(name);

  return sections[name];
}

//------------------------------------------------------------------------------

function getSection(name)
{
  return sections[name];
}

//------------------------------------------------------------------------------

function clearSection(name)
{
  sections[name].innerHTML = "";

  return sections[name];
}

//------------------------------------------------------------------------------

function resetSection(name)
{
  clearSection(name);
  sections[name].resetFunction(sections[name]);

  return sections[name];
}

//------------------------------------------------------------------------------

function switchSection(name)
{
  for(var k in sections)
  {
    sections[k].style.display = "none";
  }

  sections[name].style.display = "block";

  return sections[name];
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
