
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

function downloadText(url, callback)
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

function downloadFile(url, fileName, force, callback)
{
  if(fs.existsSync(fileName))
  {
    if(force === true) fs.rmSync(fileName)
    else return;
  }

  var fstream = fs.createWriteStream(fileName);
  var req = https.get(url, (res) =>
  {
    res.pipe(fstream);
    res.on("end", () => {if(typeof callback === "function") callback();});
  })
  .on("error", (error) => {console.error(error.message);});
}

//------------------------------------------------------------------------------

function downloadFileHTML(url, fileName)
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

function buildCheckbox(parent, id, css_class, selected, changeFunction)
{
  var e = buildElem("input", parent, id, css_class);
  e.type = "checkbox";
  if(selected === true) e.checked = true;
  if(typeof changeFunction === "function") e.addEventListener("change", changeFunction);

  return e;
}

//------------------------------------------------------------------------------

function buildButton(parent, id, css_class, text, clickFunction)
{
  var e = buildElem("input", parent, id, css_class);
  e.type = "button";
  if(typeof text === "string") e.value = text;
  if(typeof clickFunction === "function") e.addEventListener("click", clickFunction);

  return e;
}

//------------------------------------------------------------------------------

function buildText(parent, id, css_class, text)
{
  var e = buildElem("input", parent, id, css_class);
  // e.type = "button";
  if(typeof text === "string") e.value = text;
  if(typeof clickFunction === "function") e.addEventListener("click", clickFunction);

  return e;
}

//------------------------------------------------------------------------------

function buildHRImage(parent, url)
{
  return buildImage(parent, url, null, "hr-image");
}

//------------------------------------------------------------------------------

function buildThumbnail(parent, url)
{
  return buildImage(parent, url, null, "thumbnail");
}

//------------------------------------------------------------------------------

function buildImage(parent, url, id, css_class)
{
  var e = buildElem("img", parent, id, css_class);
  if(typeof url === "string") e.src = url;

  return e;
}

//------------------------------------------------------------------------------

function buildDivElem(parent, id, css_class, text)
{
  return buildElem("div", parent, id, css_class, text);
}

//------------------------------------------------------------------------------

function buildElem(tag, parent, id, css_class, text)
{
  if(typeof tag !== "string") throw new Error("Undefined html tag to create!");

  var e = document.createElement(tag);
  if(typeof id === "string") e.id = id;
  if(typeof css_class === "string") e.classList.add(css_class);
  if(typeof text === "string") e.innerText = text;

  parent.appendChild(e);

  return e;
}

//------------------------------------------------------------------------------
