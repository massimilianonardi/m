
//------------------------------------------------------------------------------

function Queue()
{
  if(!(this instanceof Queue)) throw new ReferenceError();

  this.queue = [];
}

Queue.prototype.add = function(callbackReturningPromise, args)
{
  if(typeof callbackReturningPromise === "undefined" || callbackReturningPromise === null)
  {
    throw new ReferenceError();
  }

  if(typeof callbackReturningPromise !== "function")
  {
    throw new TypeError();
  }

  this.queue.push({callback: callbackReturningPromise, args: args});

  return this;
};

Queue.prototype.exec = function()
{
  var _this = this;

  return new Promise((resolve, reject) =>
  {
    var f = function()
    {
      if(_this.queue.length === 0)
      {
        resolve();
        return;
      }

      var obj = _this.queue.splice(0, 1)[0];
      try
      {
        obj.callback.apply(global, obj.args)
        .then(() => f())
        .catch(() => f());
      }
      catch(error)
      {
        console.error(error);
        f();
      }
    };
    f();
  });
};

//------------------------------------------------------------------------------

function mkdir(dir)
{
  if(!fs.existsSync(dir))
  {
    fs.mkdirSync(dir, {recursive: true});
  }
}

//------------------------------------------------------------------------------

function lsdir(dir, followLinks)
{
  var list = [];

  fs.readdirSync(dir, {recursive: true}).forEach(file =>
  {
    var filePath = path.join(dir, file);
    var stat = fs.lstatSync(filePath);
    if(stat.isDirectory())
    {
      if(stat.isSymbolicLink())
      {
        if(followLinks === true) list.push(file);
      }
      else list.push(file);
    }
  });

  return list;
}

//------------------------------------------------------------------------------

function lspath(dir, absolute)
{
  var list = fs.readdirSync(dir, {recursive: true});

  var root = dir;
  if(absolute === true) root = path.resolve(dir);

  for(var i = 0; i < list.length; i++)
  {
    list[i] = path.join(root, list[i]);
  }

  return list;
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
