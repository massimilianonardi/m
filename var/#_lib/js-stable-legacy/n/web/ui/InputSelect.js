//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function InputSelect(properties)
{
  return Class(InputSelect).construct(this, undefined, properties);
}

Class(InputSelect)
.inherit(Input)
.implement(data.Data)
//.implement(data.DataFilterTable)
.properties()
.property("key", 0)
.property("text", 1)
.property("selected", 0)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

InputSelect.prototype.construct = function()
{
  this.dom = {};
  this.dom.input = new core.Element("select").parent(this.node);
  
  var _this = this;
  this.node.firstChild.addEventListener("change", function(event){_this.eventInputChange(this.value);});
};

//------------------------------------------------------------------------------

InputSelect.prototype.render = function()
{
//  console.log(this);
  var html = "";
  var key = this.key();
  var text = this.text();
  var selected = this.selected();
  var value = this.value();
  var data = (this.data() || {}).data || [];
  for(var i = 0; i < data.length; i++)
  {
    var optionKey = data[i][key];
    var optionValue = data[i][text];
    var optionSelected = (selected === i || value === optionKey) ? "selected" : "";
    html += "<option value='" + optionKey + "' " + optionSelected + ">" + optionValue + "</option>";
  }
  this.dom.input.html(html);
  
  return this;
};

//------------------------------------------------------------------------------

InputSelect.prototype.eventDataLoad = function(data, mime)
{
  this.render();
};

//------------------------------------------------------------------------------

InputSelect.prototype.eventPropertiesChanged = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------

InputSelect.prototype.value = function(value)
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

InputSelect.prototype.readonly = function(value)
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

InputSelect.prototype.enabled = function(value)
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
