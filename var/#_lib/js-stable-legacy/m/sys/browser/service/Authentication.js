//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Authentication()
{
  return Authentication.Class.construct(this, arguments, [["authenticator"]]);
}

Class(Authentication)
//.inherit(m.service.Authentication)
.inherit(Service)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Authentication.prototype.authenticate = function(id, credential)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({id: id, credential: credential}).command("authenticate");
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.unauthenticate = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").command("unauthenticate");
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.credential = function(id, credential, credentialNew)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({id: id, credential: credential, credentialNew: credentialNew}).command("credential");
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.session = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").command("session");
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.state = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").command("state");
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.profile = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").command("profile");
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.id = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("GET").command("id");
  
  return this;
};

//------------------------------------------------------------------------------
