//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

// NB parent must not have position static/blank/initial (or if inherit, the same for parent)
function ResizeListener()
{
  return Class(ResizeListener).construct(this, undefined, undefined, ["iframe"]);
//  return Class(ResizeListener).construct(this, undefined, undefined, ["object"]);
}

Class(ResizeListener)
.inherit(core.Element)
//.implement(sys.EventTarget)
.properties()
//.property("validator")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ResizeListener.prototype.construct = function()
{
  var _this = this;
  this.event.register("load", function()
  {
    _this.node.contentWindow.addEventListener("resize", function(){_this.eventResizeListenerResize();});
  });
  
//  this.node.src = "blank.html";
  
  var html = "<!DOCTYPE html><html><head><title></title></head><body></body></html>";
//  this.node.src = "data:text/html;charset=utf-8," + encodeURI(html);
  this.node.srcdoc = html;
  
//  this.event.register("resize", this.eventResizeListenerResize);
//  this.event.register("resize", function(){_this.eventResizeListenerResize();});
};

//------------------------------------------------------------------------------

ResizeListener.prototype.eventResizeListenerResize = function()
{
};

//------------------------------------------------------------------------------
