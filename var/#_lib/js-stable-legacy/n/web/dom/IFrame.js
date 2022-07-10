//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function IFrame(properties)
{
  return Class(IFrame).construct(this, undefined, properties, ["iframe"]);
}

Class(IFrame)
.inherit(Element)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

IFrame.prototype.source = function(value)
{
  if(arguments.length === 0)
  {
    return this.node.src;
  }
  else if(typeof value === "string")
  {
    this.node.src = value;
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

IFrame.prototype.document = function(value)
{
  if(arguments.length === 0)
  {
    return this.node.srcdoc;
  }
  else if(typeof value === "string")
  {
    this.node.srcdoc = value;
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------
