
//------------------------------------------------------------------------------

var sections = {};

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

  // var e = document.createElement("div");
  // if(typeof id === "string") e.id = id;
  // if(typeof css_class === "string") e.classList.add(css_class);
  // if(typeof text === "string") e.innerText = text;
  //
  // parent.appendChild(e);
  //
  // return e;
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

function buildSection(name, resetFunction)
{
  var section = document.createElement("div");
  section.id = name;
  section.resetFunction = resetFunction;
  section.classList.add("section");
  section.style.display = "none";

  document.body.appendChild(section);
  sections[name] = section;

  resetSection(name);

  return sections[name];
}

//------------------------------------------------------------------------------

function getSection(name)
{
  return sections[name];
}

//------------------------------------------------------------------------------

function clearSection(name)
{
  sections[name].innerHTML = "";

  return sections[name];
}

//------------------------------------------------------------------------------

function resetSection(name)
{
  clearSection(name);
  sections[name].resetFunction(sections[name]);

  return sections[name];
}

//------------------------------------------------------------------------------

function switchSection(name)
{
  for(var k in sections)
  {
    sections[k].style.display = "none";
  }

  sections[name].style.display = "flex";

  return sections[name];
}

//------------------------------------------------------------------------------
