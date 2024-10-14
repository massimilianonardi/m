
//------------------------------------------------------------------------------

var win = null;

//------------------------------------------------------------------------------

app.on("ready", function()
{
  var { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  var w = parseInt(width);
  var h = parseInt(height);

  win = new BrowserWindow(
  {
    width: w,
    height: h,
    webPreferences:
    {
      preload: path.join(app.getAppPath(), "preload.js"),
      contextIsolation: false,
      devTools: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      sandbox: false
    }
  });

  // win.loadURL("https://www.vinted.it/member/items/favourite_list");
  win.loadFile("index.html").then(function()
  {
    var jsFileName = "page_ready.js";
    var jsFilePath = path.resolve(path.join(app.getAppPath(), jsFileName));
    console.log("executing javascript file:", jsFilePath);
    eval(fs.readFileSync(jsFilePath, "utf-8"));
  });

  win.on("closed", () =>
  {
    // win = null;
  });
});

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
