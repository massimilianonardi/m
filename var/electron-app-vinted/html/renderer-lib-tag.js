
//------------------------------------------------------------------------------

function addItemToTag(itemID, tag, dir)
{
  if(!tag || tag === "")
  {
    console.log("addItemToTag - invalid tag:" + tag);
    return;
  }

  if(dir && dir !== "")
  {
    tag = path.join(dir, tag);
    console.log(tag);
  }

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
