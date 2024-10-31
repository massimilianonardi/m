
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

function processFavDump()
{
  // win.webContents.executeJavaScript('processFavDump();');
  win.webContents.send("execute", 'processFavDump();');
}

//------------------------------------------------------------------------------
