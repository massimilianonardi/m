//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Button()
{
  return Button.Class.construct(this, arguments);
}

Class(Button)
.inherit(m.ui.Element)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Button.prototype.construct = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Button.prototype.reset = function()
{
  m.global.log.debug(this, arguments);
  
  Element.prototype.reset.apply(this);

  return this;
};

//------------------------------------------------------------------------------

Button.prototype.actionExecute = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Button.prototype.actionOption = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Button.prototype.actionFocus = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------
