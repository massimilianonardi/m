
function init()
{
  if(typeof document.currentScript !== "undefined" && document.currentScript !== null && typeof document.currentScript.src === "string" && document.currentScript.src !== "")
  {
    m.env.path = document.currentScript.src.split("/data.read/")[1];
  }
  else
  {
    m.env.path = m.env.path || parent.m.env.path;
  }
//  m.env.path = document.currentScript.src;
//  window.addEventListener("load", initOnLoadPage);
}

//function initOnLoadPage()
//{
//  m.service.Data.eventServiceAuthenticationRequired = function()
//  {
//    var username = window.prompt("username", "");
//    if(username === null)
//    {
//      return;
//    }
//    var password = window.prompt("password", "");
//    if(password === null)
//    {
//      return;
//    }
//    new m.service.Authentication().login(username, password);
//  };
//}

window.getFunctionsDefinitions = function()
{
  for(var k in this)
  {
    if(typeof this[k] === "function" && this[k].toString().indexOf("native") === -1)
    {
      console.log(this[k].name);
    }
  }
};

window.getObjectsDefinitions = function()
{
  for(var k in this)
  {
    if(this[k].toString().indexOf("native") === -1)
    {
      console.log([k, this[k]]);
    }
  }
};
