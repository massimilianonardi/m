
//------------------------------------------------------------------------------

win.webContents.openDevTools();
win.webContents.executeJavaScript('console.log("hello from main");');
win.webContents.send("message", "my message");
win.webContents.send("message", arguments[0]);
console.log(global.zzz);
console.log(global.xxx);

//------------------------------------------------------------------------------
