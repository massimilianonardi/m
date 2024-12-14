
//------------------------------------------------------------------------------

function browseGUI()
{
  // win.webContents.executeJavaScript('switchSection("item-browser-section");');
  win.webContents.send("execute", 'switchSection("item-browser-section");');
}

//------------------------------------------------------------------------------

function updateGUI()
{
  // win.webContents.executeJavaScript('switchSection("update");');
  win.webContents.send("execute", 'switchSection("update");');
}

//------------------------------------------------------------------------------

function organizeGUI()
{
  // win.webContents.executeJavaScript('switchSection("organize");');
  win.webContents.send("execute", 'switchSection("organize");');
}

//------------------------------------------------------------------------------

function searchGUI()
{
  // win.webContents.executeJavaScript('switchSection("search");');
  win.webContents.send("execute", 'switchSection("search");');
}

//------------------------------------------------------------------------------

function updateIndex()
{
  // win.webContents.executeJavaScript('updateIndex();');
  win.webContents.send("execute", 'updateIndex();');
}

//------------------------------------------------------------------------------

function dumpFavourites()
{
  // win.webContents.executeJavaScript('processFavDump();');
  win.webContents.send("execute", 'dumpFavourites_p();');
  // win.webContents.invoke("execute", 'dumpFavourites_p();')
  // .then((...args) => {log("favourites completely processed!!!")});
}

//------------------------------------------------------------------------------
