//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Element()
{
  return Element.Class.construct(this, arguments);
}

Class(Element)
//.inherit(m.ui.core.Input)
.inherit(m.data.Data)
.inherit(m.lang.Lang) // lang as a root element of conf loaded/merged from a different place
.property("meta")
.property("data")
.property("lang")
.property("style")
.property("id")
.property("classes")
.property("parent")
.property("children")
.property("show")
.property("enable")
.property("interactive")
.property("interact")
.property("value")
.property("focus")
.property("select", false)
.listener("select", function(value)
{
  if(value === true)
  {
    this.eventElementSelectTrue();
  }
  else if(value === false)
  {
    this.eventElementSelectFalse();
  }
  else
  {
    this.eventElementSelect(value);
  }
})
.property("selection")
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Element.prototype.construct = function()
{
  m.global.log.debug(this, arguments);
  
  var _this = this;
  
  m.global.conf.register(function(){_this.eventConfigurationChange();});
};

//------------------------------------------------------------------------------

Element.prototype.stateless = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.destroy = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.clear = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.reset = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.update = function()
{
  m.global.log.debug(this, arguments);
  
//  this.eventConfigurationChange(conf);
  this.reset();
};

//------------------------------------------------------------------------------

Element.prototype.register = function(name, listener)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.unregister = function(name, listener)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.actions = function(data)
{
  m.global.log.debug(this, arguments);
  
  // todo make registrations update on id change
  var _this = this;
  
  var event = m.global.conf.get(["ui.event.map.id." + this.id(), "ui.event.map.classes." + this.constructor.name], null);
  
  this.registered = this.registered || [];
  
//  if(event !== null && typeof event.name === "string" && typeof event.action === "string" && typeof this[event.action] === "function")
  if(event !== null && typeof event.name === "string" && typeof event.action === "string")
  {
    var func = function(){_this[event.action].apply(_this, arguments);};
    this.registered.push(func);
    this.register(event.name, func);
  }
};

//------------------------------------------------------------------------------

Element.prototype.eventConfigurationChange = function(data)
{
  m.global.log.debug(this, arguments);
  
  this.actions();
  
  this.update();
};

//------------------------------------------------------------------------------

Element.prototype.eventLangChanged = function(value, prev)
{
  m.global.log.debug(this, arguments);
  
  this.update();
};

//------------------------------------------------------------------------------

Element.prototype.eventDataMetaChanged = function(value, prev)
{
  m.global.log.debug(this, arguments);
  
//  this.update();
};

//------------------------------------------------------------------------------

Element.prototype.eventDataChanged = function(value, prev)
{
  m.global.log.debug(this, arguments);
  
  this.update();
};

//------------------------------------------------------------------------------

Element.prototype.eventDataElementEnter = function(data)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventDataElementMove = function(data)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventDataElementExit = function(data)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementShowTrue = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementShowFalse = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementEnableTrue = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementEnableFalse = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementEditableTrue = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementEditableFalse = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementFocusTrue = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementFocusFalse = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementSelect = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementSelectTrue = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementSelectFalse = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------
