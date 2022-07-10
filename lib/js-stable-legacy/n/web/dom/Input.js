//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Input(properties)
{
  return Class(Input).construct(this, undefined, properties, ["input"]);
}

Class(Input)
.inherit(Element)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Input.prototype.type = function(value)
{
  if(arguments.length === 0)
  {
    return this.node.type;
  }
  else if(typeof value === "string")
  {
    this.node.type = value;
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Input.prototype.value = function(value)
{
  if(arguments.length === 0)
  {
    return this.node.value;
  }
  else if(typeof value === "string" || typeof value === "number")
  {
    this.node.value = value;
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Input.prototype.enabled = function(value)
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

Input.prototype.readonly = function(value)
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
