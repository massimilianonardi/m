
//------------------------------------------------------------------------------
// ORDER
//------------------------------------------------------------------------------

function getOrderFilePath(group, name)
{
  return path.join(orderPath, group, name + ".json");
}

//------------------------------------------------------------------------------

function getOrderedItemsID(group, name)
{
  var orderFilePath = getOrderFilePath(group, name);

  if(fs.existsSync(orderFilePath)) return JSON.parse(fs.readFileSync(orderFilePath))
  else return [];
}

//------------------------------------------------------------------------------

function setOrderedItemsID(ids, group, name)
{
  return saveJSONFile(ids, getOrderFilePath(group, name), true);
}

//------------------------------------------------------------------------------

function setOrderedItems(items, group, name)
{
  return setOrderedItemsID(getItemsID(items), group, name);
}

//------------------------------------------------------------------------------
// GROUP PATHS
//------------------------------------------------------------------------------

function getGroupPath(group, name)
{
  return path.join(groupPath, group, name);
}

//------------------------------------------------------------------------------

function getBrandGroupPath(brand)
{
  return getGroupPath(brandGroup, brand);
}

//------------------------------------------------------------------------------

function getCountryGroupPath(country)
{
  return getGroupPath(countryGroup, country);
}

//------------------------------------------------------------------------------

function getUserGroupPath(user)
{
  return getGroupPath(userGroup, user);
}

//------------------------------------------------------------------------------

function getStatusGroupPath(status)
{
  return getGroupPath(status);
}

//------------------------------------------------------------------------------

function getTagGroupPath(tag)
{
  return getGroupPath(tagGroup, tag);
}

//------------------------------------------------------------------------------
// GROUP ADD AND REMOVE
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
  return addItemToGroup(id, brandGroup, brand);
}

//------------------------------------------------------------------------------

function remItemToGroupBrand(id, brand)
{
  return remItemToGroup(id, brandGroup, brand);
}

//------------------------------------------------------------------------------

function addItemToGroupCountry(id, country)
{
  return addItemToGroup(id, countryGroup, country);
}

//------------------------------------------------------------------------------

function remItemToGroupCountry(id, country)
{
  return remItemToGroup(id, countryGroup, country);
}

//------------------------------------------------------------------------------

function addItemToGroupUser(id, user)
{
  return addItemToGroup(id, userGroup, user);
}

//------------------------------------------------------------------------------

function remItemToGroupUser(id, user)
{
  return remItemToGroup(id, userGroup, user);
}

//------------------------------------------------------------------------------

// function addItemToGroupTag(id, tag)
// {
//   return addItemToGroup(id, tagGroup, tag);
// }

//------------------------------------------------------------------------------

// function remItemToGroupTag(id, tag)
// {
//   return remItemToGroup(id, tagGroup, tag);
// }

//------------------------------------------------------------------------------

function addItemToGroupTag(id, tag)
{
  // reverse link from item index to tag
  link = path.relative(getItemPath(id), getTagGroupPath(tag));
  target = getItemTagsPath(id, tag);
  if(!fs.existsSync(target)) fs.symlink(link, target, function(error){if(error) console.log(error);});

  return addItemToGroup(id, tagGroup, tag);
}

//------------------------------------------------------------------------------

function remItemToGroupTag(id, tag)
{
  // reverse link from item index to tag
  target = getItemTagsPath(id, tag);
  if(fs.existsSync(target)) fs.rmSync(target);

  return remItemToGroup(id, tagGroup, tag);
}

//------------------------------------------------------------------------------

function addItemToGroupStatus(id, status)
{
  return addItemToGroup(id, statusGroup, status);
}

//------------------------------------------------------------------------------

function remItemToGroupStatus(id, status)
{
  return remItemToGroup(id, statusGroup, status);
}

//------------------------------------------------------------------------------

function addItemToGroupStatusSold(id)
{
  return addItemToGroupStatus(id, soldStatus);
}

//------------------------------------------------------------------------------

function remItemToGroupStatusSold(id)
{
  return remItemToGroupStatus(id, soldStatus);
}

//------------------------------------------------------------------------------

function addItemToGroupStatusUntagged(id)
{
  return addItemToGroupStatus(id, untaggedStatus);
}

//------------------------------------------------------------------------------

function remItemToGroupStatusUntagged(id)
{
  return remItemToGroupStatus(id, untaggedStatus);
}

//------------------------------------------------------------------------------

function addItemToGroupStatusHidden(id)
{
  return addItemToGroupStatus(id, hiddenStatus);
}

//------------------------------------------------------------------------------

function remItemToGroupStatusHidden(id)
{
  return remItemToGroupStatus(id, hiddenStatus);
}

//------------------------------------------------------------------------------

function addItemToGroupStatusReserved(id)
{
  return addItemToGroupStatus(id, reservedStatus);
}

//------------------------------------------------------------------------------

function remItemToGroupStatusReserved(id)
{
  return remItemToGroupStatus(id, reservedStatus);
}

//------------------------------------------------------------------------------

function addItemToGroupStatusFavourite(id)
{
  return addItemToGroupStatus(id, favouriteStatus);
}

//------------------------------------------------------------------------------

function remItemToGroupStatusFavourite(id)
{
  return remItemToGroupStatus(id, favouriteStatus);
}

//------------------------------------------------------------------------------
// GROUP GET ITEMS
//------------------------------------------------------------------------------

// function getGroupItemsID(group, name)
// {
//   return fs.readdirSync(getGroupPath(group, name));
// }

//------------------------------------------------------------------------------

function getGroupItemsID(group, name)
{
  var ids = getOrderedItemsID(group, name);
  var orderedIDs = {};
  for(var i = 0; i < ids.length; i++)
  {
    orderedIDs[ids[i]] = true;
  }

  fs.readdirSync(getGroupPath(group, name)).forEach(id =>
  {
    if(!orderedIDs[id]) ids.push(id);
  });

  return ids;
}

//------------------------------------------------------------------------------

function getGroupItems(group, name)
{
  return getItems(getGroupItemsID(group, name));
}

//------------------------------------------------------------------------------

function getGroupBrandItemsID(brand)
{
  return getGroupItemsID(brandGroup, brand);
}

//------------------------------------------------------------------------------

function getGroupBrandItems(brand)
{
  return getGroupItems(brandGroup, brand);
}

//------------------------------------------------------------------------------

function getGroupCountryItemsID(country)
{
  return getGroupItemsID(countryGroup, country);
}

//------------------------------------------------------------------------------

function getGroupCountryItems(country)
{
  return getGroupItems(countryGroup, country);
}

//------------------------------------------------------------------------------

function getGroupUserItemsID(user)
{
  return getGroupItemsID(userGroup, user);
}

//------------------------------------------------------------------------------

function getGroupUserItems(user)
{
  return getGroupItems(userGroup, user);
}

//------------------------------------------------------------------------------

function getGroupTagItemsID(tag)
{
  return getGroupItemsID(tagGroup, tag);
}

//------------------------------------------------------------------------------

function getGroupTagItems(tag)
{
  return getGroupItems(tagGroup, tag);
}

//------------------------------------------------------------------------------

function getGroupStatusItemsID(status)
{
  return getGroupItemsID(statusGroup, status);
}

//------------------------------------------------------------------------------

function getGroupStatusItems(status)
{
  return getGroupItems(statusGroup, status);
}

//------------------------------------------------------------------------------

function getGroupStatusSoldItemsID()
{
  return getGroupItemsID(statusGroup, soldStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusSoldItems()
{
  return getGroupItems(statusGroup, soldStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusUntaggedItemsID()
{
  return getGroupItemsID(statusGroup, untaggedStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusUntaggedItems()
{
  return getGroupItems(statusGroup, untaggedStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusHiddenItemsID()
{
  return getGroupItemsID(statusGroup, hiddenStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusHiddenItems()
{
  return getGroupItems(statusGroup, hiddenStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusReservedItemsID()
{
  return getGroupItemsID(statusGroup, reservedStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusReservedItems()
{
  return getGroupItems(statusGroup, reservedStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusFavouriteItemsID()
{
  return getGroupItemsID(statusGroup, favouriteStatus);
}

//------------------------------------------------------------------------------

function getGroupStatusFavouriteItems()
{
  return getGroupItems(statusGroup, favouriteStatus);
}

//------------------------------------------------------------------------------
