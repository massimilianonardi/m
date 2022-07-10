//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TabShared()
{
  return Class(TabShared).construct(this, arguments);
}

Class(TabShared)
.inherit(core.ElementControl)
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

TabShared.prototype.construct = function()
{
  this.props = this.props || {};
//  this.render();
};

//------------------------------------------------------------------------------

TabShared.prototype.vertical = function(value)
{
  this.props.vertical = value;
  if(value)
  {
    this.classAdd("vertical");
    this.classRemove("horizontal");
  }
  else
  {
    this.classAdd("horizontal");
    this.classRemove("vertical");
  }
  this.render();
  
  return this;
};

//------------------------------------------------------------------------------

TabShared.prototype.render = function()
{
  var html = "";
  var data = this.data();
  
  // build tab selector
  html += "<div class='selectors'>";
  if(data)
  {
    for(var i = 0; i < data.length; i++)
    {
      if(data[i].sectionSeparator)
      {
        html += "<div class='section' data-index='" + i + "' data-section='" + data[i].section + "'>" + data[i].title + "</div>";
      }
      else
      {
        html += "<div class='selector' data-index='" + i + "' data-section='" + data[i].section + "'>" + data[i].title + "</div>";
      }
    }
  }
  html += "</div>";
  
  // build tab containers
  html += "<div class='containers'>";
  if(data)
  {
    html += "<div class='container visible' data-index='0'>";
    html += "</div>";
  }
  html += "</div>";
  
  this.html(html);
  
  if(data && data[0].object)
  {
    var obj = data[0].object.node;
    $(this.node).find(".container[data-index='0']")[0].appendChild(obj);
  }
  
  var obj = this;
  $(this.node).find(".selector").on("click", function(){obj.click(this.getAttribute("data-index"));});
  $(this.node).find(".section").on("click", function(){obj.section(this.getAttribute("data-index"), this.getAttribute("data-section"));});
  $(this.node).find(".section").each(function()
  {
    $(obj.node).find(".selector[data-section='" + this.getAttribute("data-section") + "']").hide();
  });
};

//------------------------------------------------------------------------------

TabShared.prototype.click = function(index)
{
  var data = this.data();
  
  if(data && data[index] && typeof data[index].action === "function"  )
  {
    data[index].action();
  }
  
  return this;
};

//------------------------------------------------------------------------------

TabShared.prototype.section = function(index, sectionName)
{
  $(this.node).find(".selector[data-section='" + sectionName + "']").toggle();
  
  var data = this.data();
  
  if(data && data[index] && typeof data[index].action === "function"  )
  {
    data[index].action();
  }
  
  return this;
};

//------------------------------------------------------------------------------

TabShared.prototype.fit = function(index)
{
  var domobj = $(this.dom.node).find(".container[data-index='" + index + "']")[0];
  if(!$(domobj).find("iframe")[0])
  {
    return;
  }
  var iframe = $(domobj).find("iframe")[0];
  var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//  var child = domobj.firstChild;
//  var child = domobj.children[0];
//  domobj.style.height = "100%";
  domobj.style.height = Math.max(iframeDoc.body.offsetHeight, iframeDoc.body.clientHeight, iframeDoc.body.scrollHeight) + "px";
//  console.log(iframeDoc.body.clientHeight);
//  console.log(iframeDoc.body.offsetHeight);
//  console.log(iframeDoc.body.scrollHeight);
//  console.log(this.dom.node.offsetHeight);
//  console.log(this.dom.node.getElementsByTagName("div")[0].offsetHeight);
//  this.dom.node.getElementsByTagName("div")[1].offsetHeight = this.dom.node.offsetHeight - this.dom.node.getElementsByTagName("div")[0].offsetHeight;
//  console.log(this.dom.node.getElementsByTagName("div")[1].offsetHeight);
};

//------------------------------------------------------------------------------

TabShared.prototype.changed = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------

TabShared.prototype.saved = function(data)
{
};

//------------------------------------------------------------------------------

TabShared.prototype.errorLoad = function(response)
{
};

//------------------------------------------------------------------------------

TabShared.prototype.errorSave = function(response)
{
};

//------------------------------------------------------------------------------
