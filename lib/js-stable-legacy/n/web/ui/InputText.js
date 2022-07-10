//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function InputText(properties)
{
  return Class(InputText).construct(this, undefined, properties);
}

Class(InputText)
.inherit(Input)
.properties()
//.property("type", "text") // button, checkbox, text, number, range
//.property("readonly", false)
//.property("validator")
//.property("min")
//.property("max")
//.property("step")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

InputText.prototype.construct = function()
{
  this.dom = {};
  this.dom.input = new core.Element("textarea").parent(this.node);
  
  var _this = this;
  this.node.firstChild.addEventListener("change", function(event){_this.eventInputChange(this.value);});
};

//------------------------------------------------------------------------------

InputText.prototype.value = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.value;
  }
  else
  {
    this.dom.input.node.value = value;
    this.dom.input.node.cols = 60;
//    this.dom.input.node.rows = Math.floor(value.length / 60 + 1);
    this.dom.input.node.rows = Math.min(10, value.split("\n").length);
    this.eventPropertiesChanged("value");
    return this;
  }
};

//------------------------------------------------------------------------------

InputText.prototype.readonly = function(value)
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

InputText.prototype.enabled = function(value)
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
