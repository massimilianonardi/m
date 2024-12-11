
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
