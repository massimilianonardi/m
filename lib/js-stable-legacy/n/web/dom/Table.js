//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Table(properties)
{
  return Class(Table).construct(this, undefined, properties, ["table"]);
}

Class(Table)
.inherit(Element)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Table.prototype.construct = function()
{
  this.dom = this.dom || {};
  this.dom.caption = new Element("caption").parent(this);
  this.dom.caption.visible(false);
  this.dom.colgroup = new Element("colgroup").parent(this);
  this.dom.header = new Element("thead").parent(this);
  this.dom.header.visible(false);
  this.dom.footer = new Element("tfoot").parent(this);
  this.dom.footer.visible(false);
  this.dom.tbody = new Element("tbody").parent(this);
};

//------------------------------------------------------------------------------

Table.prototype.caption = function(value)
{
  var dom = this.dom.caption;
  
  if(arguments.length === 0)
  {
    return dom.text();
  }
  else if(typeof value === "boolean")
  {
    dom.visible(value);
    
    return this;
  }
  else if(typeof value === "string")
  {
    dom.text(value);
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

//Table.prototype.colgroup = function(value)
//{
//  var dom = this.dom.colgroup;
//  
//  if(arguments.length === 0)
//  {
//    return dom.html();
//  }
//  else if(typeof value === "boolean")
//  {
//    dom.visible(value);
//    
//    return this;
//  }
//  else if(typeof value === "string")
//  {
//    dom.html(value);
//    
//    return this;
//  }
//  else
//  {
//    throw new TypeError();
//  }
//};

//------------------------------------------------------------------------------

Table.prototype.header = function(value)
{
  var dom = this.dom.header;
  
  if(arguments.length === 0)
  {
    return dom;
  }
  else if(typeof value === "boolean")
  {
    dom.visible(value);
    
    return this;
  }
  else if(Array.isArray(value))
  {
    dom.visible(false);
    dom.html("");
    var row = new Element("tr").parent(dom);
    for(var i = 0; i < value.length; i++)
    {
      var col = new Element("th").parent(row).text(value[i]);
      col.node.setAttribute("data-index", i);
    }
    dom.visible(true);
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Table.prototype.footer = function(value)
{
  var dom = this.dom.footer;
  
  if(arguments.length === 0)
  {
    return dom;
  }
  else if(typeof value === "boolean")
  {
    dom.visible(value);
    
    return this;
  }
  else if(Array.isArray(value))
  {
    dom.visible(false);
    dom.html("");
    var row = new Element("tr").parent(dom);
    for(var i = 0; i < value.length; i++)
    {
      var col = new Element("th").parent(row).text(value[i]);
      col.node.setAttribute("data-index", i);
    }
    dom.visible(true);
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Table.prototype.body = function(value)
{
  var dom = this.dom.tbody;
  
  if(arguments.length === 0)
  {
    return dom;
  }
  else if(typeof value === "boolean")
  {
    dom.visible(value);
    
    return this;
  }
  else if(Array.isArray(value))
  {
    dom.visible(false);
    dom.html("");
    var rows = value;
    for(var i = 0; i < rows.length; i++)
    {
      var row = rows[i];
      var domrow = new Element("tr").parent(dom);
      domrow.node.setAttribute("data-index", i);
      for(var j = 0; j < row.length; j++)
      {
        var col = row[j];
        var domcol = new Element("td").parent(domrow).text(col);
        domcol.node.setAttribute("data-index-row", i);
        domcol.node.setAttribute("data-index-col", j);
      }
    }
    dom.visible(true);
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------
