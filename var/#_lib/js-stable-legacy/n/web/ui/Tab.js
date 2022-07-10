//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Tab()
{
  return Class(Tab).construct(this, arguments);
}

Class(Tab)
//.inherit(core.ElementControl)
.inherit(core.Element)
.implement(data.Data)
.property("test", false)
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Tab.prototype.construct = function()
{
  this.props = this.props || {};
//  this.classAdd("Tab");
  this.classes.add("horizontal");
  
//  this.render();
};

//------------------------------------------------------------------------------

Tab.prototype.vertical = function(value)
{
  this.props.vertical = value;
  if(value)
  {
    this.classes.add("vertical");
    this.classes.remove("horizontal");
  }
  else
  {
    this.classes.add("horizontal");
    this.classes.remove("vertical");
  }
  this.render();
  
  return this;
};

//------------------------------------------------------------------------------

Tab.prototype.render = function()
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
    for(var i = 0; i < data.length; i++)
    {
      html += "<div class='container hidden' data-index='" + i + "'>";
      html += "</div>";
    }
  }
  html += "</div>";
  
  this.html(html);
  
  if(data)
  {
    for(var i = 0; i < data.length; i++)
    {
      if(data[i].object)
      {
        var obj = data[i].object.node;
        $(this.node).find(".container[data-index='" + i + "']")[0].appendChild(obj);
      }
    }
  }
  
  var obj = this;
  $(this.node).find(".selector").on("click", function(){obj.click(this.getAttribute("data-index"));});
  $(this.node).find(".section").on("click", function(){obj.section(this.getAttribute("data-section"));});
  $(this.node).find(".section").each(function()
  {
    $(obj.node).find(".selector[data-section='" + this.getAttribute("data-section") + "']").hide();
  });

  return this;
};

//------------------------------------------------------------------------------

Tab.prototype.click = function(index)
{
  $(this.node).find(".selector").removeClass("selected");
  $(this.node).find(".selector[data-index='" + index + "']").addClass("selected");
  
  $(this.node).find(".container").removeClass("visible");
  $(this.node).find(".container").addClass("hidden");
  $(this.node).find(".container[data-index='" + index + "']").removeClass("hidden");
  $(this.node).find(".container[data-index='" + index + "']").addClass("visible");
  
//  this.fit(index);
  return this;
};

//------------------------------------------------------------------------------

Tab.prototype.section = function(sectionName)
{
  $(this.node).find(".selector[data-section='" + sectionName + "']").toggle();

  return this;
};

//------------------------------------------------------------------------------

Tab.prototype.fit = function(index)
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

  return this;
};

//------------------------------------------------------------------------------

Tab.prototype.eventDataLoad = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------

Tab.prototype.saved = function(data)
{
};

//------------------------------------------------------------------------------

Tab.prototype.errorLoad = function(response)
{
};

//------------------------------------------------------------------------------

Tab.prototype.errorSave = function(response)
{
};

//------------------------------------------------------------------------------
