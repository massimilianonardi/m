//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Tabs()
{
  return Class(Tabs).construct(this, arguments);
}

Class(Tabs)
.inherit(m.ui.Element)
//.property("value", undefined, 
//function()
//{
//  return typeof this.selected !== "undefined" ? this.selected.value() : undefined;
//}, 
//function(value)
//{
////  this._classinstance._properties.value = value;
////  return this;
//// loop through all elements until value match, then update this.selected
//})
//.property("select", false, undefined, function(value)
//{
//  m.global.log.debug(this, arguments);
//  
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
//    if(prev instanceof m.ui.Element){prev.select(false); prev.value().show(false)};
//    if(value instanceof m.ui.Element){value.select(true); value.value().show(true)};
//    this.eventElementSelect();
//  }
//  
//  return this;
//})
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Tabs.prototype.construct = function()
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Tabs.prototype.reset = function()
{
  m.global.log.debug(this, arguments);

  var meta = this.meta();
  var type = (meta || {}).type;
  var data = this.data();

  this.clear();

  if(type !== "table")
  {
    data = this.translate("table");
  }
  data = data || [];

  // rebuild based on new data
  // id, label, object -> new select with same data + data loop for objects
//    var selectEventMapping = g.conf.get("ui.Select.event.map.select", "click");
  // how to make a separate conf value for select event mapping only for tabs and make select aware of this???
//    this.select = __this.newElement().parent(this).data(data);
  this.container = new Element();
  
  var selectors = [];
  for(var i = 0; i < data.length; i++)
  {
    var row = typeof data[i] !== "undefined" ? data[i] : [];
    if(Array.isArray(row))
    {
      var object = null;

      if(row[1] instanceof Element)
      {
        object = row[1];
      }
      else if(typeof row[1] === "string")
      {
        object = new m.ui[row[1]](ui).meta(row[2]).data(row[3]);
      }
      else
      {
        object = new Element(ui);
      }

//      object.show(false || i === 0).parent(this.container);
      object.show(false).parent(this.container);
      selectors.push([object, row[0]]);
    }
  }
  this.selector = new Select().meta({type: "table"}).data(selectors).parent(this);
  this.container.parent(this);
  
//  this.selector.select = this.select.bind(this);
  this.selector.eventElementSelect = function()
  {
    var prev = this.select();
    if(prev instanceof m.ui.Element)
    {
      prev.select(false);
    }
    this.select(e);
  }.bind(this);
  // select first

  return this;
};

//------------------------------------------------------------------------------

Tabs.prototype.eventElementSelect = function()
{
  m.global.log.debug(this, "Select.prototype.eventElementSelect");
};

//------------------------------------------------------------------------------
