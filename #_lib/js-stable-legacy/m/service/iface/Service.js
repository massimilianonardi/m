//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Service()
{
  return Service.Class.construct(this, arguments);
}

Class(Service)
.property("path", "")
.setter("path", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("params", {})
.setter("params", function(value){if(typeof value === "undefined"){return {};} else if(typeof value === "object"){return value;} else {throw new TypeError();}})
.property("data")
.listener("data", function(value, prev){this.eventServiceData(value, prev);})
.property("response")
.setter("response", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("success")
.setter("success", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("authentication")
.setter("authentication", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("password")
.setter("password", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("unauthorized")
.setter("unauthorized", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("send")
.setter("send", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("receive")
.setter("receive", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("error")
.setter("error", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("abort")
.setter("abort", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.property("timeout")
.setter("timeout", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.properties()
.event("Data")
.event("Response")
.event("Success")
.event("Authentication")
.event("Password")
.event("Unauthorized")
.event("Send")
.event("Receive")
.event("Error")
.event("Abort")
.event("Timeout")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Service.prototype.command = function(command)
{
  m.global.log.debug(this, arguments);
  
  return this;
};

//------------------------------------------------------------------------------
