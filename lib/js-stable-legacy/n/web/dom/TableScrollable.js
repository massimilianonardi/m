//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TableScrollable(properties)
{
  return Class(TableScrollable).construct(this, undefined, properties);
}

Class(TableScrollable)
.inherit(Element)
.implement(ResizeListenerTarget)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

TableScrollable.prototype.construct = function()
{
  var _this = this;
  
  this.dom = this.dom || {};
  
  this.dom.caption = new Element().parent(this);
  this.dom.caption.classes.add("TableScrollableCaption");
  
  this.dom.headerWrapper = new Element().parent(this);
  this.dom.headerWrapper.classes.add("TableScrollableHeader");
  this.dom.header = new Table().parent(this.dom.headerWrapper);
  
  this.dom.container = new Container().parent(this);
  this.dom.container.event.register("scroll", function(event){_this.eventTableScrollableScroll(event);});
  
  this.dom.body = new Table().parent(this.dom.container);
  this.dom.body.classes.add("TableScrollableBody");
  
  this.dom.footerWrapper = new Element().parent(this);
  this.dom.footerWrapper.classes.add("TableScrollableFooter");
  this.dom.footer = new Table().parent(this.dom.footerWrapper);
};

//------------------------------------------------------------------------------

TableScrollable.prototype.caption = function(value)
{
  if(arguments.length === 0)
  {
    return this.dom.caption.text();
  }
  
  if(typeof value === "undefined")
  {
    value = "";
  }
  
  this.dom.caption.text(value);
  this.eventResizeListenerTargetResize();
  return this;
};

//------------------------------------------------------------------------------

//TableScrollable.prototype.colgroup = function(value)
//{
//  this.dom.header.colgroup(value);
//  this.dom.footer.colgroup(value);
//  this.dom.tbody.colgroup(value);
//  this.eventResizeListenerTargetResize();
//  return this;
//};

//------------------------------------------------------------------------------

TableScrollable.prototype.header = function(value)
{
  if(arguments.length === 0)
  {
    return this.dom.header.select("th");
  }
  
  this.dom.header.header(value);
  this.dom.body.header(value);
  this.eventResizeListenerTargetResize();
  return this;
};

//------------------------------------------------------------------------------

TableScrollable.prototype.footer = function(value)
{
  if(arguments.length === 0)
  {
    return this.dom.footer.select("th");
  }
  
  this.dom.footer.footer(value);
  this.dom.body.footer(value);
  this.eventResizeListenerTargetResize();
  return this;
};

//------------------------------------------------------------------------------

TableScrollable.prototype.body = function(value)
{
  if(arguments.length === 0)
  {
    return this.dom.body.select("td");
  }
  
  this.dom.body.body(value);
  this.eventResizeListenerTargetResize();
  return this;
};

//------------------------------------------------------------------------------

TableScrollable.prototype.eventResizeListenerTargetResize = function()
{
  this.dom.container.style.height = "";
  this.dom.container.style.width = "";
  
  if(0 === this.node.clientHeight)
  {
    return;
  }
  
//  this.node.style.height = "";
//  var initialHeight = this.node.offsetHeight;
//  var css = window.getComputedStyle(this.node);
//  this.node.style.height = "calc((100% - " + css.marginTop + ") - " + css.marginBottom + ")";
//  this.node.style.width = "calc((100% - " + css.marginLeft + ") - " + css.marginRight + ")";
////  this.node.style.height = "calc((100% - " + css.borderTopWidth + ") - " + css.borderBottomWidth + ")";
////  this.node.style.width = "calc((100% - " + css.borderLeftWidth + ") - " + css.borderRightWidth + ")";
////  this.node.style.height = "100%";
////  this.node.style.width = "100%";
////  console.log(this, window.getComputedStyle(this.node));
//  if(initialHeight < this.node.offsetHeight)
//  {
//    this.node.style.height = "";
//  }
  
//  console.log(this.node.clientHeight, window.getComputedStyle(this.node).height);
  this.dom.container.style.height = (this.node.clientHeight - this.dom.caption.node.scrollHeight) + "px";
  
  if(this.dom.body.node.offsetHeight < this.dom.container.node.clientHeight)
  {
    this.dom.container.style.height = this.dom.body.node.offsetHeight + this.dom.container.node.offsetHeight - this.dom.container.node.clientHeight + "px";
  }
  
  if(this.dom.body.node.offsetWidth < this.dom.container.node.clientWidth)
  {
    this.dom.container.style.width = this.dom.body.node.offsetWidth + this.dom.container.node.offsetWidth - this.dom.container.node.clientWidth + "px";
    this.dom.caption.style.width = this.dom.container.style.width;
  }
//  else if(this.node.clientWidth === this.dom.container.node.offsetWidth && this.dom.container.node.offsetWidth === this.dom.body.node.offsetWidth)
//  {
//    this.dom.container.style.width = this.node.clientWidth + this.dom.container.node.offsetWidth - this.dom.container.node.clientWidth + "px";
//  }
  
  this.dom.headerWrapper.style.width = this.dom.container.node.clientWidth + "px";
  this.dom.footerWrapper.style.width = this.dom.container.node.clientWidth + "px";
  
  var bodyRow = this.dom.body.select("tbody>tr")[0];
  if(typeof bodyRow !== "undefined")
  {
    var bodyColumns = bodyRow.Element.select("td");
    if(typeof bodyColumns !== "undefined")
    {
      var headerColumns = this.dom.header.select("th");
      if(typeof headerColumns !== "undefined")
      {
        for(var i = 0; i < headerColumns.length; i++)
        {
          headerColumns[i].style.width = bodyColumns[i].offsetWidth + "px";
        }
      }
      var footerColumns = this.dom.footer.select("th");
      if(typeof footerColumns !== "undefined")
      {
        for(var i = 0; i < footerColumns.length; i++)
        {
          footerColumns[i].style.width = bodyColumns[i].offsetWidth + "px";
        }
      }
    }
  }
  
//  this.dom.footerWrapper.style.bottom = (this.dom.container.node.offsetHeight - this.dom.container.node.clientHeight) + "px";
  this.dom.footerWrapper.style.bottom = (this.node.clientHeight - this.dom.container.node.clientHeight - this.dom.caption.node.scrollHeight) + "px";
};

//------------------------------------------------------------------------------

TableScrollable.prototype.eventTableScrollableScroll = function(event)
{
  this.dom.headerWrapper.node.scrollLeft = event.target.scrollLeft;
  this.dom.footerWrapper.node.scrollLeft = event.target.scrollLeft;
};

//------------------------------------------------------------------------------
