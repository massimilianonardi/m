
//------------------------------------------------------------------------------
// MAIN GUI
//------------------------------------------------------------------------------

// todo decide if and which sections are needed
// todo decide initial set of items to be put into item browser
function buildSectionGUIItemBrowser(parent)
{
  var itemListBrowser = new ItemListBrowser(parent);
  var items = getStatusItems("untagged");
  console.log(items);
  itemListBrowser.setItems(items);
}

//------------------------------------------------------------------------------

// todo manage dump downloads, updates, etc.
function buildSectionGUIupdate(parent)
{
}

//------------------------------------------------------------------------------

function main()
{
  console.log("main");

  buildSection("item-browser-section", buildSectionGUIItemBrowser);
  buildSection("update", buildSectionGUIupdate);

  switchSection("item-browser-section");
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
