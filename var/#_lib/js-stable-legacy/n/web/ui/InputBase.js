//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function InputBase(properties)
{
  return Class(InputBase).construct(this, undefined, properties);
}

Class(InputBase)
.inherit(Input)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

InputBase.prototype.construct = function()
{
  this.dom = {};
  this.dom.input = new core.Element("input").parent(this.node);
  
  var _this = this;
  this.node.firstChild.addEventListener("change", function(event){_this.eventInputChange(this.value);});
};

//------------------------------------------------------------------------------

InputBase.prototype.value = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.value;
  }
  else
  {
    this.dom.input.node.value = value;
    this.eventPropertiesChanged("value");
    return this;
  }
};

//------------------------------------------------------------------------------

InputBase.prototype.readonly = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.readOnly;
  }
  else
  {
    this.dom.input.node.readOnly = value;
    this.eventPropertiesChanged("readonly");
    return this;
  }
};

//------------------------------------------------------------------------------

InputBase.prototype.enabled = function(value)
{
  if(typeof value === "undefined")
  {
    return !this.dom.input.node.disabled;
  }
  else
  {
    this.dom.input.node.disabled = !value;
    this.eventPropertiesChanged("enabled");
    return this;
  }
};

//------------------------------------------------------------------------------

InputBase.prototype.type = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.type;
  }
  else
  {
    this.dom.input.node.type = value;
    this.eventPropertiesChanged("type");
    return this;
  }
};

//------------------------------------------------------------------------------

InputBase.prototype.min = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.min;
  }
  else
  {
    this.dom.input.node.min = value;
    this.eventPropertiesChanged("min");
    return this;
  }
};

//------------------------------------------------------------------------------

InputBase.prototype.max = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.max;
  }
  else
  {
    this.dom.input.node.max = value;
    this.eventPropertiesChanged("max");
    return this;
  }
};

//------------------------------------------------------------------------------

InputBase.prototype.step = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.step;
  }
  else
  {
    this.dom.input.node.step = value;
    this.eventPropertiesChanged("step");
    return this;
  }
};

//------------------------------------------------------------------------------
