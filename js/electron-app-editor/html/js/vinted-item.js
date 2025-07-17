
//------------------------------------------------------------------------------
// ITEM PATHS AND OBJECT GETTERS
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

function getItemTagsPath(id, tag)
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

function getItemsID(items)
{
  var ids = [];

  for(var i = 0; i < items.length; i++)
  {
    ids[i] = items[i].id;
  }

  return ids;
}

//------------------------------------------------------------------------------
// ITEM STATUS
//------------------------------------------------------------------------------

function itemIsSold(item)
{
  if(item.item_closing_action === "sold" || item.can_be_sold === false || item.instant_buy === false || item.can_buy === false) return true
  else return false;
}

//------------------------------------------------------------------------------

function itemIsUntagged(item)
{
  var itemTagsPath = getItemTagsPath(item.id, "");

  if(!fs.existsSync(itemTagsPath) || fs.readdirSync(itemTagsPath).length === 0) return true
  else return false;
}

//------------------------------------------------------------------------------

function itemIsHidden(item)
{
  return item.is_hidden;
}

//------------------------------------------------------------------------------

function itemIsReserved(item)
{
  return item.is_reserved;
}

//------------------------------------------------------------------------------

function itemIsFavourite(item)
{
  return item.is_favourite;
}

//------------------------------------------------------------------------------
// ITEM PHOTOS AND THUMBNAILS
//------------------------------------------------------------------------------

function dloadItemThumbnail_p(item, force)
{
  return downloadFile_p(item.photos[0].thumbnails[2].url, getItemThumbnailFilePath(item.id), force);
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
// ITEM UPDATE
//------------------------------------------------------------------------------

function updateItemFiles(item, force)
{
  if(!saveJSONFile(item, getItemFilePath(item.id), force)) return false;

  addItemToGroupBrand(item.id, item.brand);
  addItemToGroupCountry(item.id, item.country);
  addItemToGroupUser(item.id, item.user_login);

  if(itemIsSold(item)) addItemToGroupStatusSold(item.id);
  if(itemIsUntagged(item)) addItemToGroupStatusUntagged(item.id);
  if(itemIsHidden(item)) remItemToGroupStatusHidden(item.id);
  if(itemIsReserved(item)) addItemToGroupStatusReserved(item.id);
  if(itemIsFavourite(item)) addItemToGroupStatusFavourite(item.id);

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
