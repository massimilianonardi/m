//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Certification()
{
  return Certification.Class.construct(this, arguments, [["certificator"]]);
}

Class(Certification)
.inherit(Service)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Certification.prototype.certificate = function(name)
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").params({name: name}).command("certificate");
  
  return this;
};

//------------------------------------------------------------------------------

Certification.prototype.certificates = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").command("certificates");
  
  return this;
};

//------------------------------------------------------------------------------
