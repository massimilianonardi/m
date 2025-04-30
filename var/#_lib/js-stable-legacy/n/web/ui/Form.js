//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Form()
{
  return Class(Form).construct(this, arguments);
}

Class(Form)
.inherit(core.ElementControl)
//.inherit(core.Element)
.implement(web.data.DataFilterTable)
.property("title", "")
.property("validator")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Form.prototype.render = function()
{
  this.html("");
  
  if(typeof this.data() === "undefined" || this.data() === null)
  {
    return this;
  }
  
  var meta = this.data().meta;
  var data = this.data().data;
  
  for(var i = 0; i < meta.fields.length; i++)
  {
    var field = this.field(i);
    if(typeof field.label() === "undefined")
    {
      // TODO traslate column name with lang
      field.label(meta.fields[i]);
    }
    // TODO eventually translate data with lang
    // TODO reimplement select so that data has the same meaning and keep table key/value as subobject
    field.datum(data[i] || "");
    field.render();
    field.parent(this);
  }
  
  var html = "";
  var toolbar = new core.Element().parent(this);
  toolbar.classes.add("toolbar");
  var meta = this.data().meta;
  var data = this.data().data;
  if(data.length === 0)
  {
    for(var i = 0; i < meta.fields.length; i++)
    {
      data.push(null);
    }
    html += "<input type='button' class='button insert' value='Inserisci'>";
  }
  else
  {
    html += "<input type='button' class='button update' value='Aggiorna'>";
    html += "<input type='button' class='button delete' value='Elimina'>";
  }
  html += "<input type='button' class='button cancel' value='Chiudi'>";
  toolbar.html(html);
  html = "";
  
  var statusbar = new core.Element().parent(this);
  statusbar.classes.add("statusbar");
  this.statusbar = statusbar;
  
  var obj = this;
  $(this.node).find("input.insert").on("click", function(){obj.insert();});
  $(this.node).find("input.update").on("click", function(){obj.update();});
  $(this.node).find("input.delete").on("click", function(){obj.delete();});
  $(this.node).find("input.cancel").on("click", function(){obj.cancel();});
  
  return this;
};

//------------------------------------------------------------------------------

Form.prototype.field = function(field)
{
  this.fields = this.fields || {};
  
  if(typeof field === "string")
  {
  }
  else if(typeof field === "number")
  {
    field = "" + field;
//    return this.fields[this.data().meta.fields[field]] || new FormField();
  }
  else
  {
    throw new TypeError();
  }
  
  this.fields[field] = this.fields[field] || new FormField();
  
  return this.fields[field];
};

//------------------------------------------------------------------------------

Form.prototype.dataMapOriginal = function()
{
  var res = {};
  
  for(var i = 0; i < this.data().meta.fields.length; i++)
  {
    res[this.data().meta.fields[i]] = this.data().data[i];
  }
  
  return res;
//  var res = {};
//  
//  if(!this.params.keys)
//  {
//    this.params.keys = this.params.data.header;
//  }
//  
//  var keys = {};
//  for(var i = 0; i < this.params.keys.length; i++)
//  {
//    keys[this.params.keys[i]] = true;
//  }
//  
//  for(var i = 0; i < this.params.data.header.length; i++)
//  {
//    if(keys[this.params.data.header[i]])
//    {
//      res[this.params.data.header[i]] = this.params.data.data[i];
//    }
//  }
//  
//  return res;
};

//------------------------------------------------------------------------------

Form.prototype.dataMapModified = function()
{
  var res = {};
  
  for(var i = 0; i < this.data().meta.fields.length; i++)
  {
    res[this.data().meta.fields[i]] = this.field(i).datum();
    if(this.data().meta.fields[i] === "" || res[this.data().meta.fields[i]] === "null")
    {
      res[this.data().meta.fields[i]] = null;
    }
  }
  
  return res;
};

//------------------------------------------------------------------------------

Form.prototype.insert = function()
{
  this.set([[{}, this.dataMapModified()]]);
};

//------------------------------------------------------------------------------

Form.prototype.update = function()
{
  this.set([[this.dataMapOriginal(), this.dataMapModified()]]);
};

//------------------------------------------------------------------------------

Form.prototype.delete = function()
{
  this.set([[this.dataMapOriginal(), {}]]);
};

//------------------------------------------------------------------------------

Form.prototype.cancel = function()
{
  this.visible(false);
  if(this.params.callbackCancel)
  {
    this.params.callbackCancel();
  }
  // forces table to reload
  this.set();
};

//------------------------------------------------------------------------------

Form.prototype.eventDataSave = function(data)
{
  if(!data)
  {
    return;
  }
  
  data = data[0];
  if(data.exceptionMessage || data.savedCount === -1 || (data.meta && data.meta.savedCount === -1))
  {
    this.messageError(data.sqlCode + " " + data.exceptionMessage);
    return;
  }
  this.messageSuccess();
};

//------------------------------------------------------------------------------

Form.prototype.eventDataErrorSave = function(status, data, xhr)
{
  console.log(data);
  this.messageError(status + " " + xhr.statusText);
};

//------------------------------------------------------------------------------

Form.prototype.messageSuccess = function()
{
  $(this.node).find("div.statusbar").removeClass("error");
  $(this.node).find("div.statusbar").addClass("success");
  $(this.node).find("div.statusbar")[0].innerHTML = "Operazione completata con successo!";
  $(this.node).find("input.insert").hide();
  $(this.node).find("input.update").hide();
  $(this.node).find("input.delete").hide();
  $(this.node).find(".FormField").hide();
};

//------------------------------------------------------------------------------

Form.prototype.messageError = function(message)
{
  $(this.node).find(".FormField").hide();
  $(this.node).find("input.insert").hide();
  $(this.node).find("input.update").hide();
  $(this.node).find("input.delete").hide();
  if(!message)
  {
    message = "";
  }
  $(this.node).find("div.statusbar").removeClass("success");
  $(this.node).find("div.statusbar").addClass("error");
  $(this.node).find("div.statusbar")[0].innerHTML = "ERRORE!!! " + message;
//  console.log(this.statusbar);
//  this.statusbar.classRemove("success");
//  this.statusbar.classAdd("error");
//  this.statusbar.node.innerHTML = "ERRORE!!! " + message;
};

//------------------------------------------------------------------------------

Form.prototype.eventDataLoad = function(data)
{
};

//------------------------------------------------------------------------------
