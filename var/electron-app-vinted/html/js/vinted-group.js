
//------------------------------------------------------------------------------

function addTagToGUI(parent, tag)
{
  buildButton(parent, "tag", "button", tag, function()
  {
    var listElem = getSection("update").listElem;
    listElem.items = getTagList(tag);
    refreshListElem(listElem);
  });
}

//------------------------------------------------------------------------------

function addTagsToGUI(parent, tags)
{
  for(var i = 0; i < tags.length; i++)
  {
    addTagToGUI(parent, tags[i]);
  }
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
  if(typeof id !== "string" && typeof id !== "number") throw new TypeError();
  if(typeof group !== "string" || group === "") throw new TypeError();

  var _name = name;
  if(typeof _name !== "string" || _name === "") _name = "_unnamed";

  var thisGroupPath = getGroupPath(group, _name);
  var itemPath = getItemPath(id);

  mkdir(thisGroupPath);
  var link = path.relative(thisGroupPath, itemPath);
  var target = path.join(thisGroupPath, "" + id);
  if(!fs.existsSync(target)) fs.symlink(link, target, function(error){if(error) console.log(error);});
}

//------------------------------------------------------------------------------

function remItemToGroup(id, group, name)
{
  if(typeof id !== "string" && typeof id !== "number") throw new TypeError();
  if(typeof group !== "string" || group === "") throw new TypeError();

  var _name = name;
  if(typeof _name !== "string" || _name === "") _name = "_unnamed";

  var target = path.join(getGroupPath(group, _name), "" + id);
  if(fs.existsSync(target)) fs.rmSync(target);
}

//------------------------------------------------------------------------------

function addItemToGroupBrand(id, brand)
{
  return addItemToGroup(id, "brand", brand);
}

//------------------------------------------------------------------------------

function remItemToGroupBrand(id, brand)
{
  return remItemToGroup(id, "brand", brand);
}

//------------------------------------------------------------------------------

function addItemToGroupCountry(id, country)
{
  return addItemToGroup(id, "country", country);
}

//------------------------------------------------------------------------------

function remItemToGroupCountry(id, country)
{
  return remItemToGroup(id, "country", country);
}

//------------------------------------------------------------------------------

function addItemToGroupUser(id, user)
{
  return addItemToGroup(id, "user", user);
}

//------------------------------------------------------------------------------

function remItemToGroupUser(id, user)
{
  return remItemToGroup(id, "user", user);
}

//------------------------------------------------------------------------------

function addItemToGroupStatus(id, tag)
{
  return addItemToGroup(id, "tag", tag);
}

//------------------------------------------------------------------------------

function remItemToGroupStatus(id, tag)
{
  return remItemToGroup(id, "tag", tag);
}

//------------------------------------------------------------------------------

function addItemToGroupStatus(id, status)
{
  return addItemToGroup(id, "status", status);
}

//------------------------------------------------------------------------------

function remItemToGroupStatus(id, status)
{
  return remItemToGroup(id, "status", status);
}

//------------------------------------------------------------------------------

function addItemToGroupStatusSold(id)
{
  return addItemToGroup(id, "status", "sold");
}

//------------------------------------------------------------------------------

function remItemToGroupStatusSold(id)
{
  return remItemToGroup(id, "status", "sold");
}

//------------------------------------------------------------------------------

function addItemToGroupStatusUntagged(id)
{
  return addItemToGroup(id, "status", "untagged");
}

//------------------------------------------------------------------------------

function remItemToGroupStatusUntagged(id)
{
  return remItemToGroup(id, "status", "untagged");
}

//------------------------------------------------------------------------------

function addItemToGroupStatusHidden(id)
{
  return addItemToGroup(id, "status", "hidden");
}

//------------------------------------------------------------------------------

function remItemToGroupStatusHidden(id)
{
  return remItemToGroup(id, "status", "hidden");
}

//------------------------------------------------------------------------------

function addItemToGroupStatusReserved(id)
{
  return addItemToGroup(id, "status", "reserved");
}

//------------------------------------------------------------------------------

function remItemToGroupStatusReserved(id)
{
  return remItemToGroup(id, "status", "reserved");
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
