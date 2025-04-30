
//------------------------------------------------------------------------------

function downloadFile_p(url, filePath, force)
{
  return new Promise((resolve, reject) =>
  {
    if(fs.existsSync(filePath))
    {
      if(force === true || fs.statSync(filePath).size === 0) fs.rmSync(filePath)
      else
      {
        resolve();
        return;
      }
    }

    var req = https.get(url, (res) =>
    {
      if(res.statusCode !== 200)
      {
        reject("Status Code: " + res.statusCode + "; Status Message: " + res.statusMessage);
      }

      mkdir(path.dirname(filePath));
      var fstream = fs.createWriteStream(filePath);
      fstream.on("finish", () =>
      {
        console.log("downloadFile_p: OK -> ", filePath);
        resolve();
      });

      res.pipe(fstream);
      // res.on("end", () =>
      // {
      // });
    })
    .on("error", (error) =>
    {
      reject(error.message);
    });
  });
}

//------------------------------------------------------------------------------

function downloadFile(url, filePath, force, callback)
{
  if(fs.existsSync(filePath))
  {
    if(force === true) fs.rmSync(filePath)
    else return;
  }

  var fstream = fs.createWriteStream(filePath);
  var req = https.get(url, (res) =>
  {
    res.pipe(fstream);
    res.on("end", () => {if(typeof callback === "function") callback();});
  })
  .on("error", (error) => {console.error(error.message);});
}

//------------------------------------------------------------------------------

function downloadURL(url, callback)
{
  fetch(url, {method: "get", mode: "no-cors", referrerPolicy: "no-referrer"})
  .then((response) => response.text())
  .then(text => {if(typeof callback === "function") callback(text);});
}

//------------------------------------------------------------------------------

function downloadURL_alternative(url, callback)
{
  var req = https.get(url, (res) =>
  {
    var body = "";
    res.on("data", (chunk) => {body += chunk;});
    res.on("end", () => {if(typeof callback === "function") callback(body);});
  })
  .on("error", (error) => {console.error(error.message);});
}

//------------------------------------------------------------------------------

function downloadFileHTMLDialog(url, fileName)
{
  fetch(url, {method: "get", mode: "no-cors", referrerPolicy: "no-referrer"})
  .then(res => res.blob())
  .then(res =>
  {
    var aElement = document.createElement("a");
    aElement.setAttribute("download", fileName);
    var href = URL.createObjectURL(res);
    aElement.href = href;
    aElement.setAttribute("target", "_blank");
    aElement.click();
    URL.revokeObjectURL(href);
  });
}

//------------------------------------------------------------------------------
