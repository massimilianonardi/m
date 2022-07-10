//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Data()
{
  return Data.Class.construct(this, arguments, [["data"]]);
}

Class(Data)
.inherit(Service)
.property("source", "")
.setter("source", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Data.prototype.read = function()
{
  m.global.log.debug(this, arguments);
  
  this.command("read");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.write = function()
{
  m.global.log.debug(this, arguments);
  
  this.command("write");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.create = function()
{
  m.global.log.debug(this, arguments);
  
  this.command("create");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.destroy = function()
{
  m.global.log.debug(this, arguments);
  
  this.command("destroy");
  
  return this;
};

//------------------------------------------------------------------------------
