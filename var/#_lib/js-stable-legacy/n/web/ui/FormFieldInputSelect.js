//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function FormFieldInputSelect()
{
  return Class(FormFieldInputSelect).construct(this, arguments);
}

Class(FormFieldInputSelect)
.inherit(core.ElementControl)
.implement(FormField)
//.inherit(FormField)
//.inherit(core.Element)
.property("key", 0)
.property("value", 1)
.property("selected", 0)
//.property("datum", "")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//FormFieldInputSelect.prototype.construct = function()
//{
//  console.log(this, this.parse());
//};

//------------------------------------------------------------------------------

FormFieldInputSelect.prototype.render = function()
{
  this.html("");
  this.classes.add("FormField");
  
  var html = "";
  
  var label = this.label();
  if(typeof label === "undefined" || label === null)
  {
  }
  else
  {
//    new m.web.ui.core.Element().parent(this).html(label).classes.add("Label");
    html += "<div class=\"Label\">" + label + "</div>";
  }
  
  html += "<select>";
  var key = this.key();
  var value = this.value();
  var selected = this.selected();
  var datum = this.datum();
  var data = (this.data() || {}).data || [];
  for(var i = 0; i < data.length; i++)
  {
    var optionKey = data[i][key];
    var optionValue = data[i][value];
    var optionSelected = (selected === i) ? "selected" : "";
    if(datum)
    {
      optionSelected = (datum === optionKey) ? "selected" : "";
    }
    html += "<option value='" + optionKey + "' " + optionSelected + ">" + optionValue + "</option>";
  }
  html += "</select>";
  this.html(html);
  
  return this;
};

//------------------------------------------------------------------------------

FormFieldInputSelect.prototype.datum = function(value)
{
//  if(typeof value === "undefined")
  if(arguments.length === 0)
  {
    if(this.select("select")[0])
    {
      this._classinstance._properties.datum = this.select("select")[0].value;
    }
    return this._classinstance._properties.datum;
  }
  else
  {
    this._classinstance._properties.datum = value;
    if(this.select("select")[0])
    {
      this.select("select")[0].value = value;
    }

    return this;
  }
};

//------------------------------------------------------------------------------
