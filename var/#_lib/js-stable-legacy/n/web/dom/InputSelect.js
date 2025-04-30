//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function InputSelect(properties)
{
  return Class(InputSelect).construct(this, undefined, properties, ["select"]);
}

Class(InputSelect)
.inherit(Element)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

InputSelect.prototype.construct = function()
{
  var _this = this;
  
  this.event.register("change", function(event)
  {
    _this.eventInputSelectChange(_this.node.value);
  });
};

//------------------------------------------------------------------------------

InputSelect.prototype.value = function(value)
{
  if(arguments.length === 0)
  {
    return this.node.value;
  }
  else if(typeof value === "string" || typeof value === "number")
  {
    this.node.value = value;
    var item = this.node.namedItem(value);
    if(typeof item !== "undefined" && item !== null)
    {
      this.node.selectedIndex = item.index;
//      this.node.dispatchEvent(new Event("change"));
    }
//    this.node.dispatchEvent(new Event("change"));
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

InputSelect.prototype.add = function(value, text, index)
{
  if(typeof value !== "undefined")
  {
    var option = document.createElement("option");
    option.setAttribute("value", value);
//    option.setAttribute("id", value);
//    option.setAttribute("name", value);
    
    if(typeof text !== "undefined")
    {
      option.text = text;
    }
    else
    {
      option.text = value;
    }
    
    if(typeof index !== "undefined")
    {
      this.node.add(option, index);
    }
    else
    {
      this.node.add(option);
    }
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

InputSelect.prototype.remove = function(index)
{
  if(arguments.length === 0)
  {
    this.node.remove(0);
    
    return this;
  }
  else if(typeof index === "number")
  {
    var prevVal = this.value();
    this.node.remove(index);
    var actualVal = this.value();
    if(prevVal !== actualVal)
    {
//      this.node.dispatchEvent(new Event("change"));
    }
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

InputSelect.prototype.selected = function(index)
{
  if(arguments.length === 0)
  {
    return this.node.selectedIndex;
  }
  else if(typeof index === "number")
  {
    if(index < this.node.length)
    {
      this.node.selectedIndex = index;
//      this.node.dispatchEvent(new Event("change"));
    }
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

InputSelect.prototype.options = function(value)
{
  if(arguments.length === 0)
  {
    return this.node.options;
  }
  else if(Array.isArray(value))
  {
    this.html("");
    for(var i = 0; i < value.length; i++)
    {
      if(Array.isArray(value[i]))
      {
        this.add(value[i][0], value[i][1]);
      }
      else
      {
        this.add(value[i]);
      }
    }
//    this.node.dispatchEvent(new Event("change"));
    
    return this;
  }
  else if(typeof value === "undefined" || value === null || value === "")
  {
    this.html("");
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

InputSelect.prototype.enabled = function(value)
{
  if(arguments.length === 0)
  {
    return !this.node.disabled;
  }
  else if(typeof value === "boolean")
  {
    this.node.disabled = !value;
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

InputSelect.prototype.readonly = function(value)
{
  if(arguments.length === 0)
  {
    return this.node.readOnly;
  }
  else if(typeof value === "boolean")
  {
    this.node.readOnly = value;
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

InputSelect.prototype.eventInputSelectChange = function(value)
{
};

//------------------------------------------------------------------------------
