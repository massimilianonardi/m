//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Select()
{
  return Class(Select).construct(this, arguments);
}

Class(Select)
.inherit(m.ui.Element)
.property("value", undefined, 
function()
{
  return typeof this.selected !== "undefined" ? this.selected.value() : undefined;
}, 
function(value)
{
//  this._classinstance._properties.value = value;
//  return this;
// loop through all elements until value match, then update this.selected
})
//.property("select", false, undefined, function(value)
//{
//  var prev = this._classinstance._properties.select;
//  
//  this._classinstance._properties.select = value;
//  
//  if(value === true)
//  {
//    this.eventElementSelectTrue();
//  }
//  else if(value === false)
//  {
//    this.eventElementSelectFalse();
//  }
//  else
//  {
//    prev instanceof m.ui.Element ? prev.select(false) : undefined;
//    value instanceof m.ui.Element ? value.select(true) : undefined;
//    this.eventElementSelect();
//  }
//  
//  return this;
//})
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Select.prototype.construct = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Select.prototype.reset = function()
{
  m.global.log.debug(this, arguments);

  var type = (this.meta() || {}).type;
  var data = this.data();

  this.clear();

  if(type !== "table")
  {
    data = this.translate("table");
  }
  data = data || [];

  for(var i = 0; i < data.length; i++)
  {
    var row = typeof data[i] !== "undefined" ? data[i] : [];
    var value = null;
    var label = null;
    if(Array.isArray(row))
    {
      value = row[0];
      label = row[1];
    }
    else
    {
      value = row.toString();
      label = value;
    }
    var e = new Button().parent(this).value(value).data(label);
    var _this = this;
    e.actionExecute = function()
    {
      _this.select() instanceof m.ui.Element ? _this.select().select(false) : undefined;
      _this.select(this);
    };
  }

  return this;
};

//------------------------------------------------------------------------------

Select.prototype.eventElementSelect = function()
{
  m.global.log.debug(this, "Select.prototype.eventElementSelect");
};

//------------------------------------------------------------------------------
