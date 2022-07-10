//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Date(properties)
{
  return Class(Date).construct(this, undefined, properties);
}

Class(Date)
.inherit(Input)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Date.prototype.construct = function()
{
  this.dom = {};
  this.dom.date = new core.Element().parent(this.node);
  
//  var _this = this;
//  this.dom.input.event.register("change", function(event){_this.eventInputChange(this.value);});
//  this.dom.input.event.register("change", function(event){_this.value(new Date(this.value).toISOString().split("T")[0]);});
//  
//  this.dom.input.event.register("change", function(event){_this.dom.date.visible(false);});
//  this.dom.input.event.register("blur", function(event){_this.dom.date.visible(false);});
//  this.dom.input.event.register("focus", function(event){_this.dom.date.visible(true);});
//  this.dom.text.event.register("keyup", function(event)
//  {
//  });
};

//------------------------------------------------------------------------------

Date.prototype.value = function(value)
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

Date.prototype.readonly = function(value)
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

Date.prototype.enabled = function(value)
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
