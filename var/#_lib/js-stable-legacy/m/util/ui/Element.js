//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

// todo static instance only, property for current ui, calls and new will return an underlying ui element not this class
function Element()
{
  return Element.Class.construct(this, arguments, [arguments]);
}

Element.def = m.sys.browser.ui.html.Element;

Class(Element).inherit(Element.def);

//Class(Element);

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Element.prototype.construct = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

//Element.prototype.reset = function()
//{
//  m.global.log.debug(this, arguments);
//
//  e.register(selectEventMapping, function(e){this.select(e);}.bind(this, e));
////  e.register(selectEventMapping, this.select.bind(this, e));
//
//  return this;
//};

//------------------------------------------------------------------------------
