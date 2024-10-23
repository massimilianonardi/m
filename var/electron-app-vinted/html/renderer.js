
//------------------------------------------------------------------------------

var fs = require("fs");
var path = require("path");

//------------------------------------------------------------------------------

const dataPath = "/m/_vinted";
const itemIndexPath = path.join(dataPath, "item", "index");
const favDumpPath = path.join(dataPath, "dump", "fav");

//------------------------------------------------------------------------------

var sections = {};

//------------------------------------------------------------------------------

function addItemToPage(item)
{
  console.log(item);
}

//------------------------------------------------------------------------------

function viewFavList2(list)
{
  // calc items per page, then calc pages, then build buttons, then build first page
  var items = [];

  console.log(dataPath, itemIndexPath, favDumpPath);
  fs.readdirSync(favDumpPath).forEach(fileName =>
  {
    var fn = path.join(favDumpPath, fileName);
    console.log(fn);
    var json = JSON.parse(fs.readFileSync(fn));
    items.push(json.items);
    var sold = json.sold;
    if(sold != null)
    {
      console.log(sold);
    }
  });

  console.log(items);

  // prepare page
  for(var i = 0; i < items.length; i++)
  {
    addItemToPage(items[i]);
  }
}

//------------------------------------------------------------------------------

function buildSection(name)
{
  var section = document.createElement("div");
  section.id = name;
  section.classList.add("section");
  section.style.display = "none";

  document.body.appendChild(section);
  sections[name] = section;
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
}

//------------------------------------------------------------------------------

function switchSection(name)
{
  for(var k in sections)
  {
    sections[k].style.display = "none";
  }

  sections[name].style.display = "block";
}

//------------------------------------------------------------------------------

function main()
{
  console.log("main");

  buildSection("update");
  buildSection("organize");
  buildSection("search");
}

//------------------------------------------------------------------------------

main();
