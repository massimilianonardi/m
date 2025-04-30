//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Data()
{
  return Data.Class.construct(this, arguments, [["data"]]);
}

Class(Data)
//.implements(m.ifaces.Data)
//.inherit(m.service.Data)
.inherit(Service)
.property("source", "web.app.file")
.setter("source", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Data.prototype.command = function(command)
{
  m.global.log.debug(this, arguments);
  
  m.service.Service.prototype.command.call(this, command + "/" + this.source())
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.read = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").command("read");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.write = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("write");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.create = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("create");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.destroy = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("destroy");
  
  return this;
};

//------------------------------------------------------------------------------
