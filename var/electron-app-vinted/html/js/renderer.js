
//------------------------------------------------------------------------------
// MAIN GUI
//------------------------------------------------------------------------------

// todo decide if and which sections are needed
// todo decide initial set of items to be put into item browser
function buildSectionGUIItemBrowser(parent)
{
  var itemListBrowser = new ItemListBrowser(parent);
  // var items = getStatusItems("untagged");
  // console.log(items);
  // itemListBrowser.setItems(items);
}

//------------------------------------------------------------------------------

function buildSectionGUIupdate(parent)
{
  var dumpFavouritesStartPage = buildText(parent, "current_page", "text-indicator", "0");
  var dumpFavouritesEndPage = buildText(parent, "current_page", "text-indicator", "999");
  var dumpFavourites = buildButton(parent, "dump_fav", "button", "Dump Favourites", function()
  {
    var startPage = dumpFavouritesStartPage.value;
    var endPage = dumpFavouritesEndPage.value;
    dumpFavourites_p(startPage, endPage).then(function()
    {
      console.log("dumpFavourites", startPage, endPage);
    });
  });
}

//------------------------------------------------------------------------------

function main()
{
  console.log("main");

  buildSection("item-browser-section", buildSectionGUIItemBrowser);
  buildSection("update", buildSectionGUIupdate);

  buildSwitchSectionButtons(document.body);

  switchSection("item-browser-section");
}

//------------------------------------------------------------------------------

window.addEventListener("load", main);
