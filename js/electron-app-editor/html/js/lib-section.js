
//------------------------------------------------------------------------------

var sections = {};

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

function buildSwitchSectionButtons(parent)
{
  var buttonsContainer = buildDivElem(parent, null, "switch-section-buttons-container");

  for(var k in sections)
  {
    var section = k;
    var button = buildButton(buttonsContainer, null, "button", section, function()
    {
      switchSection(this.section);
    });
    button.section = section;
  }

  return buttonsContainer;
}

//------------------------------------------------------------------------------
