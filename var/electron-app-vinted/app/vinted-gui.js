
//------------------------------------------------------------------------------

function updateGUI()
{
  // viewFavList();
  win.webContents.executeJavaScript('switchSection("update")');
}

//------------------------------------------------------------------------------

function organizeGUI()
{
  win.webContents.executeJavaScript('switchSection("organize")');
}

//------------------------------------------------------------------------------

function searchGUI()
{
  win.webContents.executeJavaScript('switchSection("search")');
}

//------------------------------------------------------------------------------
