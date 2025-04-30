//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function InputSelectChosen(properties)
{
  return Class(InputSelectChosen).construct(this, undefined, properties);
}

Class(InputSelectChosen)
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

InputSelectChosen.prototype.construct = function()
{
  this.dom = {};
  this.dom.input = new core.Element("select").parent(this.node);
  this.dom.input.node.setAttribute("data-placeholder", " ");
//  this.dom.chosen = new Chosen(this.dom.input.node);
//  this.dom.chosen = $(this.dom.input.node).chosen();
  
  var _this = this;
  this.node.firstChild.addEventListener("change", function(event){_this.eventInputChange(this.value);});
};

//------------------------------------------------------------------------------

InputSelectChosen.prototype.render = function()
{
  console.log(this);
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
//  $(this.dom.input.node).show().find(".chosen-container").destroy();
  $(this.dom.input.node).chosen("destroy");
  this.dom.chosen = $(this.dom.input.node).chosen({width: "initial"});
//  this.dom.chosen = $(this.dom.input.node).chosen({width: "100%"});
//  $(this.dom.input.node).trigger("liszt:updated");
  
  return this;
};

//------------------------------------------------------------------------------

InputSelectChosen.prototype.eventDataLoad = function(data, mime)
{
  this.render();
};

//------------------------------------------------------------------------------

InputSelectChosen.prototype.eventPropertiesChanged = function(data)
{
  this.render();
};

//------------------------------------------------------------------------------

InputSelectChosen.prototype.value = function(value)
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

InputSelectChosen.prototype.readonly = function(value)
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

InputSelectChosen.prototype.enabled = function(value)
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
