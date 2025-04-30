//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function InputDate(properties)
{
  return Class(InputDate).construct(this, undefined, properties);
}

Class(InputDate)
.inherit(Input)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

InputDate.prototype.construct = function()
{
  this.dom = {};
  this.dom.input = new core.Element("input").parent(this.node);
  this.dom.input.node.type = "text";
  this.dom.input.node.placeholder = "aaaa-mm-gg";
  $.datepicker.setDefaults($.datepicker.regional["it"]);
  $(this.dom.input.node).datepicker({dateFormat: "yy-mm-dd"});
};

//------------------------------------------------------------------------------

InputDate.prototype.value = function(value)
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

InputDate.prototype.readonly = function(value)
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

InputDate.prototype.enabled = function(value)
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
