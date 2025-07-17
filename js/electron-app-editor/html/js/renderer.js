
//------------------------------------------------------------------------------
// MAIN GUI
//------------------------------------------------------------------------------

// todo decide if and which sections are needed
// todo decide initial set of items to be put into item browser
function buildSectionGUIItemBrowser(parent)
{
  var itemListBrowser = new ItemListBrowser(parent);
  // var items = getGroupStatusUntaggedItems();
  // console.log(items);
  // itemListBrowser.setItems(items);
}

//------------------------------------------------------------------------------

function buildSectionGUIupdate(parent)
{
  var dumpContainer = buildDivElem(parent, null, "dump-container");

  var dumpFavouritesStartPage = buildText(dumpContainer, null, "text-indicator", "0");
  var dumpFavouritesEndPage = buildText(dumpContainer, null, "text-indicator", "999");
  var dumpFavourites = buildButton(dumpContainer, null, "button", "Dump Favourites", function()
  {
    var startPage = dumpFavouritesStartPage.value;
    var endPage = dumpFavouritesEndPage.value;
    dumpFavourites_p(startPage, endPage).then(function()
    {
      console.log("dumpFavourites", startPage, endPage);
    });
  });

  var processDumpContainer = buildDivElem(parent, null, "process-dump-container");

  var listDumps = buildButton(processDumpContainer, null, "button", "List Available Dumps", function()
  {
    var currentDumpPath = dumpDir.value === "" ? dumpPath : dumpDir.value;
    filesTextArea.value = JSON.stringify(lspath(currentDumpPath, true), null, 2);
  });
  var dumpDir = buildText(processDumpContainer, null, "text-indicator", "");
  var filesTextArea = buildElem("textarea", processDumpContainer, null, "files-area");
  filesTextArea.rows = 20;
  filesTextArea.cols = 100;

  var forceOrQuitOnExistingFlag = buildText(processDumpContainer, null, "text-indicator", "true");
  var processDump = buildButton(processDumpContainer, null, "button", "Process Selected Dump", function()
  {
    // console.log(eval(forceOrQuitOnExistingFlag.value), JSON.parse(filesTextArea.value));
    processDumpPages(JSON.parse(filesTextArea.value), eval(forceOrQuitOnExistingFlag.value));
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
