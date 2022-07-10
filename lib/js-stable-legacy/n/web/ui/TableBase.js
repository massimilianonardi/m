//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TableBase()
{
  return Class(TableBase).construct(this);
}

Class(TableBase)
.inherit(core.Element)
.properties()
.property("data")
.property("title")
.property("fields")
.property("header", true)
.property("footer", false)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

TableBase.prototype.construct = function()
{
  this.dom = {};
  this.dom.table = new core.Element("table").parent(this);
  this.dom.caption = new core.Element("caption").parent(this.dom.table);
  this.dom.header = new core.Element("thead").parent(this.dom.table);
  this.dom.footer = new core.Element("tfoot").parent(this.dom.table);
  this.dom.tbody = new core.Element("tbody").parent(this.dom.table);
};

//------------------------------------------------------------------------------

TableBase.prototype.render = function()
{
  if(this.title())
  {
    this.dom.caption.text(this.title());
    this.dom.caption.visible(true);
  }
  else
  {
    this.dom.caption.visible(false);
  }
  
  if(typeof this.data() === "undefined" || this.data() === null)
  {
    return this;
  }
  
  var fields = this.fields();
  var data = this.data();
  
  if(this.header())
  {
    var domrow = new core.Element("tr").parent(this.dom.header);
    for(var i = 0; i < fields.length; i++)
    {
      var domcol = new core.Element("th").parent(domrow).text(fields[i]);
      domcol.node.setAttribute("data-index", i);
    }
    this.dom.header.visible(true);
  }
  else
  {
    this.dom.header.visible(false);
  }
  
  if(this.footer())
  {
    var domrow = new core.Element("tr").parent(this.dom.footer);
    for(var i = 0; i < fields.length; i++)
    {
      var domcol = new core.Element("th").parent(domrow).text(fields[i]);
      domcol.node.setAttribute("data-index", i);
    }
    this.dom.footer.visible(true);
  }
  else
  {
    this.dom.footer.visible(false);
  }
  
  var rows = data;
  for(var i = 0; i < rows.length; i++)
  {
    var row = rows[i];
    var domrow = new core.Element("tr").parent(this.dom.tbody);
    domrow.node.setAttribute("data-index", i);
    for(var j = 0; j < row.length; j++)
    {
      var col = row[j];
      var domcol = new core.Element("td").parent(domrow).text(col);
      domcol.node.setAttribute("data-index-row", i);
      domcol.node.setAttribute("data-index-col", j);
    }
  }
  
  return this;
};

//------------------------------------------------------------------------------

TableBase.prototype.eventPropertiesChanged = function(property)
{
  this.render();
};

//------------------------------------------------------------------------------
