
//------------------------------------------------------------------------------

app.on("ready", appReady);

//------------------------------------------------------------------------------

app.on("window-all-closed", function()
{
  // on macos apps usually keep running even if all windows are closed
  if(process.platform === "darwin")
  {
    return;
  }

  app.quit();
});

//------------------------------------------------------------------------------

app.on("activate", function()
{
  if(win === null)
  {
    createWindow();
  }
});

//------------------------------------------------------------------------------
