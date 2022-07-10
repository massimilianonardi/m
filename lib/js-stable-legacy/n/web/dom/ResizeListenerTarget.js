//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ResizeListenerTarget()
{
  if(!(this instanceof Element))
  {
    throw new TypeError();
  }
  
  this.dom = this.dom || {};
  
  this.dom.resize = new ResizeListener();
  
  this.node.insertBefore(this.dom.resize.node, this.node.firstChild);
  
  var _this = this;
  this.dom.resize.eventResizeListenerResize = function()
  {
    if(window.getComputedStyle(_this.node).position === "static")
    {
      _this.style.position = "relative";
    }
    _this.eventResizeListenerTargetResize();
  };
}

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ResizeListenerTarget.prototype.eventResizeListenerTargetResize = function()
{
};

//------------------------------------------------------------------------------



////------------------------------------------------------------------------------
//// Class -----------------------------------------------------------------------
////------------------------------------------------------------------------------
//
//function ResizeListenerTarget(element)
//{
//  var _this;
//  
//  if(element instanceof Element)
//  {
//    _this = element;
//  }
//  else if(this instanceof Element)
//  {
//    _this = this;
//  }
//  else
//  {
//    _this = new Element();
//  }
//  
//  _this.dom = _this.dom || {};
//  
//  _this.dom.resize = new ResizeListener();
//  
//  _this.node.insertBefore(_this.dom.resize.node, _this.node.firstChild);
//  
//  _this.dom.resize.eventResizeListenerResize = function()
//  {
//    if(window.getComputedStyle(_this.node).position === "static")
//    {
//      _this.style.position = "relative";
//    }
//    _this.eventResizeListenerTargetResize();
//  };
//  
//  return _this;
//}
//
////------------------------------------------------------------------------------
//// Methods ---------------------------------------------------------------------
////------------------------------------------------------------------------------
//
//ResizeListenerTarget.prototype.eventResizeListenerTargetResize = function()
//{
//  console.log(this);
//};
//
////------------------------------------------------------------------------------
