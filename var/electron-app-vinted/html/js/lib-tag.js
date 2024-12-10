
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
