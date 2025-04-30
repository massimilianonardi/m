//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function FormField()
{
  return Class(FormField).construct(this, arguments);
}

Class(FormField)
//.inherit(core.ElementControl)
.inherit(core.Element)
.property("label")
//.property("datum", "")
.property("type", 12)
.property("control")
.property("validator")
.property("readonly", false)
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

FormField.prototype.render = function()
{
  this.html("");
  
  var label = this.label();
  if(typeof label === "undefined" || label === null)
  {
  }
  else
  {
    new m.web.ui.core.Element().parent(this).html(label).classes.add("Label");
  }
  
  var readonly = this.readonly();
  if(typeof readonly === "undefined" || readonly === null)
  {
    readonly = false;
  }
  
  var validator = this.validator();
  if(typeof validator !== "function")
  {
    validator = function(data){return true;};
  }
  
  var data = this.datum();
  if(typeof data === "undefined" || data === null)
  {
    data = "";
  }
  
  var type = this.type();
  if(typeof type === "undefined" || type === null)
  {
    type = 12;
  }
  
  var control = this.control();
  if(typeof control === "undefined" || control === null)
  {
    if(data.length < 30)
    {
      control = new InputBase().value(data).readonly(readonly);
    }
    else
    {
      control = new InputText().value(data).readonly(readonly);
    }
    
    if(type === 0) // null
    {
    }
    else if(type === 16) // boolean
    {
    }
    else if(type === 91) // date
    {
      control = new Date().value(data).readonly(readonly);
    }
    else if(type === 92) // time
    {
    }
    else if(type === 93) // timestamp
    {
    }
  }

  control.parent(this).classes.add("Control");
  
  return this;
  
//  this.html("");
//  
//  var label = this.label();
//  if(typeof label === "undefined" || label === null)
//  {
//    label = "";
//  }
//  var data = this.datum();
//  if(typeof data === "undefined" || data === null)
//  {
//    data = "";
//  }
//  var type = this.type();
//  if(typeof type === "undefined" || type === null)
//  {
//    type = 12;
//  }
//  var control = this.control();
//  if(typeof control === "undefined" || control === null)
//  {
//    control = new m.web.ui.core.Element();
//    var controlType = "text";
//    if(type === 91)
//    {
//      controlType = "date";
//    }
//    else if(type === 92)
//    {
//      controlType = "datetime-local";
//    }
//    else if(type === 93)
//    {
//      controlType = "datetime-local";
//    }
//    control.html("<input class='textinput' type='" + controlType + "' name='" + label + "' value='" + data + "' />");
//  }
//  var validator = this.validator();
//  if(typeof validator !== "function")
//  {
//    validator = function(data){return true;};
//  }
//  var visible = this.visible();
//  if(typeof visible === "undefined" || visible === null)
//  {
//    visible = false;
//  }
//  var readonly = this.readonly();
//  if(typeof readonly === "undefined" || readonly === null)
//  {
//    readonly = false;
//  }
//
//  new m.web.ui.core.Element().parent(this).html(label).classes.add("Label");
//  control.parent(this).classes.add("Control");
//  
//  return this;
};

//------------------------------------------------------------------------------

FormField.prototype.add = function(label, data, type, control, validator, visible, readonly, parent)
{
};

//------------------------------------------------------------------------------

FormField.prototype.datum = function(value)
{
//  if(typeof value === "undefined")
  if(arguments.length === 0)
  {
    if(this.select("input")[0])
    {
      this._classinstance._properties.datum = this.select("input")[0].value;
    }
    if(this.select("textarea")[0])
    {
      this._classinstance._properties.datum = this.select("textarea")[0].value;
    }
    return this._classinstance._properties.datum;
  }
  else
  {
    this._classinstance._properties.datum = value;
    if(this.select("input")[0])
    {
      this.select("input")[0].value = value;
    }
    if(this.select("textarea")[0])
    {
      this.select("textarea")[0].value = value;
    }

    return this;
  }
};

//------------------------------------------------------------------------------
