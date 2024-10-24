
//------------------------------------------------------------------------------

function updateGUI()
{
  // win.webContents.executeJavaScript('switchSection("update")');
  win.webContents.send("execute", 'switchSection("update")');
}

//------------------------------------------------------------------------------

function organizeGUI()
{
  // win.webContents.executeJavaScript('switchSection("organize")');
  win.webContents.send("execute", 'switchSection("organize")');
}

//------------------------------------------------------------------------------

function searchGUI()
{
  // win.webContents.executeJavaScript('switchSection("search")');
  win.webContents.send("execute", 'switchSection("search")');
}

//------------------------------------------------------------------------------
