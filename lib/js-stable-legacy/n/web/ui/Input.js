//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Input(properties)
{
  return Class(Input).construct(this, undefined, properties);
}

Class(Input)
.inherit(core.Element)
//.implement(sys.EventTarget)
.properties()
.property("validator")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Input.prototype.construct = function()
{
//  this.render();
};

//------------------------------------------------------------------------------

Input.prototype.render = function()
{
};

//------------------------------------------------------------------------------

Input.prototype.value = function(value)
{
  return this;
};

//------------------------------------------------------------------------------

Input.prototype.readonly = function(value)
{
  return this;
};

//------------------------------------------------------------------------------

Input.prototype.enabled = function(value)
{
  return this;
};

//------------------------------------------------------------------------------

Input.prototype.eventPropertiesChanged = function()
{
//  this.render();
};

//------------------------------------------------------------------------------

Input.prototype.eventInputChange = function(value)
{
  if(typeof this.validator() === "function")
  {
    var res = this.validator()(value);
    if(res)
    {
      this.classes.remove("error");
      this.classes.add("success");
      this.eventValidationSuccess();
    }
    else
    {
      this.classes.remove("success");
      this.classes.add("error");
      this.eventValidationError(res);
    }
  }
  else
  {
    this.classes.remove("error");
    this.classes.remove("success");
  }
};

//------------------------------------------------------------------------------

Input.prototype.eventInputValidationSuccess = function()
{
};

//------------------------------------------------------------------------------

Input.prototype.eventInputValidationError = function(error)
{
};

//------------------------------------------------------------------------------
