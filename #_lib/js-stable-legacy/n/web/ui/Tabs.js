//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Tabs()
{
  return Class(Tabs).construct(this, arguments, undefined, undefined, undefined, undefined, undefined);
}

Class(Tabs)
.inherit(core.Element);

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Tabs.prototype.construct = function(params)
{
//  this.dom = new www.ui.DOMObject();
  this.dom = new core.Element();
  this.node = this.dom.node;
  this.dom.classes.add("Tabs");
  
  this.params = {};
  this.params.data = params;
  
  this.data = [];
  
  this.reload();
};

//------------------------------------------------------------------------------

Tabs.prototype.reload = function()
{
  this.render();
};

//------------------------------------------------------------------------------

Tabs.prototype.render = function()
{
  var html = "";
  
  // build tab selector
  html += "<div class='selectors'>";
  if(this.params.data)
  {
    for(var i = 0; i < this.params.data.length; i++)
    {
      if(this.params.data[i].sectionSeparator)
      {
        html += "<div class='section' data-index='" + i + "' data-section='" + this.params.data[i].section + "'>" + this.params.data[i].title + "</div>";
      }
      else
      {
        html += "<div class='selector' data-index='" + i + "' data-section='" + this.params.data[i].section + "'>" + this.params.data[i].title + "</div>";
      }
    }
  }
  html += "</div>";
  
  // build tab containers
  html += "<div class='containers'>";
  if(this.params.data)
  {
    for(var i = 0; i < this.params.data.length; i++)
    {
      html += "<div class='container hidden' data-index='" + i + "'>";
      if(this.params.data[i].url)
      {
        html += "<iframe src='" + this.params.data[i].url + "'></iframe>";
      }
      html += "</div>";
    }
  }
  html += "</div>";
  
  this.dom.node.innerHTML = html;
  
  if(this.params.data)
  {
    for(var i = 0; i < this.params.data.length; i++)
    {
      if(this.params.data[i].object)
      {
        var obj = this.params.data[i].object.node;
        if(obj.dom)
        {
          obj = obj.dom.node;
        }
        $(this.dom.node).find(".container[data-index='" + i + "']")[0].appendChild(obj);
      }
    }
  }
  
  var obj = this;
  $(this.dom.node).find(".selector").on("click", function(){obj.click(this.getAttribute("data-index"));});
  $(this.dom.node).find(".section").on("click", function(){obj.section(this.getAttribute("data-section"));});
  $(this.dom.node).find(".section").each(function()
  {
    $(obj.dom.node).find(".selector[data-section='" + this.getAttribute("data-section") + "']").hide();
  });
};

//------------------------------------------------------------------------------

Tabs.prototype.click = function(index)
{
  $(this.dom.node).find(".selector").removeClass("selected");
  $(this.dom.node).find(".selector[data-index='" + index + "']").addClass("selected");
  
  $(this.dom.node).find(".container").removeClass("visible");
  $(this.dom.node).find(".container").addClass("hidden");
  $(this.dom.node).find(".container[data-index='" + index + "']").removeClass("hidden");
  $(this.dom.node).find(".container[data-index='" + index + "']").addClass("visible");
  
//  this.fit(index);

  return this;
};

//------------------------------------------------------------------------------

Tabs.prototype.section = function(sectionName)
{
  $(this.dom.node).find(".selector[data-section='" + sectionName + "']").toggle();

  return this;
};

//------------------------------------------------------------------------------

Tabs.prototype.fit = function(index)
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
