
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

function buildText(parent, id, css_class, text, changeFunction)
{
  var e = buildElem("input", parent, id, css_class);
  // e.type = "button";
  if(typeof text === "string") e.value = text;
  if(typeof changeFunction === "function") e.addEventListener("change", changeFunction);

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
