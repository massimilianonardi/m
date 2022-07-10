//------------------------------------------------------------------------------
// Imports ---------------------------------------------------------------------
//------------------------------------------------------------------------------

var ajaxAdvanced = m.util.ajaxAdvanced;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Service()
{
  return Service.Class.construct(this, arguments);
}

Class(Service)
.inherit(m.service.iface.Service)
.property("parse", "mime")
.setter("parse", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("type", "")
.setter("type", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("method", "GET")
.setter("method", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("httpError")
.setter("httpError", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})
.properties()
.event("HttpError")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Service.prototype.construct = function(service)
{
//  this.service = service || "";
  this.service = "/m/" + service || "";
};

//------------------------------------------------------------------------------

Service.prototype.command = function(command)
{
  m.global.log.debug(this, arguments);
  
  var _this = this;
  
  var path = this.path();
  var params = this.params();
  var parse = this.parse();
  var type = this.type();
  var method = this.method();
  
  var response = this.response();
  var success = this.success();
  var authentication = this.authentication();
  var unauthorized = this.unauthorized();
  var send = this.send();
  var receive = this.receive();
  var error = this.error();
  var abort = this.abort();
  var timeout = this.timeout();
  var httpError = this.httpError();
  
  var url = path;
  if(path === "")
  {
    url = this.service + "." + command;
  }
  else if("/" !== path.charAt(0) && -1 === path.indexOf("://"))
  {
    url = this.service + "." + command + "/" + encodeURIComponent(encodeURIComponent(path));
  }
  
  var _response = function(event){_this.eventServiceResponse(event);};
  if(typeof response === "function")
  {
    _response = function(event){_this.eventServiceResponse(event); response.call(_this, event);};
  }
  else if(typeof response !== "undefined")
  {
    throw new TypeError();
  }
  
  var _success = function(data){_this.data(data); _this.eventServiceSuccess(data);};
  if(typeof success === "function")
  {
    _success = function(data){_this.data(data); _this.eventServiceSuccess(data); success.call(_this, data);};
  }
  else if(typeof success !== "undefined")
  {
    throw new TypeError();
  }
    
  var _authentication = function(event){_this.eventServiceAuthentication(event);};
  if(typeof authentication === "function")
  {
    _authentication = function(event){_this.eventServiceAuthentication(event); authentication.call(_this, event);};
  }
  else if(typeof authentication !== "undefined")
  {
    throw new TypeError();
  }
  
  var _unauthorized = function(event){_this.eventServiceUnauthorized(event);};
  if(typeof unauthorized === "function")
  {
    _unauthorized = function(event){_this.eventServiceUnauthorized(event); unauthorized.call(_this, event);};
  }
  else if(typeof unauthorized !== "undefined")
  {
    throw new TypeError();
  }

  var _send = function(event){_this.eventServiceSend(event.lengthComputable, event.loaded, event.total, event);};
  if(typeof send === "function")
  {
    _send = function(event){_this.eventServiceSend(event.lengthComputable, event.loaded, event.total, event); send.call(_this, event.lengthComputable, event.loaded, event.total, event);};
  }
  else if(typeof send !== "undefined")
  {
    throw new TypeError();
  }
  
  var _receive = function(event){_this.eventServiceReceive(event.lengthComputable, event.loaded, event.total, event);};
  if(typeof receive === "function")
  {
    _receive = function(event){_this.eventServiceReceive(event.lengthComputable, event.loaded, event.total, event); receive.call(_this, event.lengthComputable, event.loaded, event.total, event);};
  }
  else if(typeof receive !== "undefined")
  {
    throw new TypeError();
  }
  
  var _error = function(event){_this.eventServiceError(event);};
  if(typeof error === "function")
  {
    _error = function(event){_this.eventServiceError(event); error.call(_this, event);};
  }
  else if(typeof error !== "undefined")
  {
    throw new TypeError();
  }
  
  var _abort = function(event){_this.eventServiceAbort(event);};
  if(typeof abort === "function")
  {
    _abort = function(event){_this.eventServiceAbort(event); abort.call(_this, event);};
  }
  else if(typeof abort !== "undefined")
  {
    throw new TypeError();
  }
  
  var _timeout = function(event){_this.eventServiceTimeout(event);};
  if(typeof timeout === "function")
  {
    _timeout = function(event){_this.eventServiceTimeout(event); timeout.call(_this, event);};
  }
  else if(typeof timeout !== "undefined")
  {
    throw new TypeError();
  }
  
  var _httpError = function(event){_this.eventServiceHttpError(event);};
  if(typeof httpError === "function")
  {
    _httpError = function(event){_this.eventServiceHttpError(event); httpError.call(_this, event);};
  }
  else if(typeof httpError !== "undefined")
  {
    throw new TypeError();
  }
  else if(typeof error === "function")
  {
    _httpError = function(event){_this.eventServiceHttpError(event); error.call(_this, event);};
  }
  ajaxAdvanced(
  {
    url: url,
    params: params,
    parse: parse,
    type: type,
    method: method,
    success: _success,
    authentication: _authentication,
    unauthorized: _unauthorized,
    send: _send,
    receive: _receive,
    response: _response,
    error: _error,
    abort: _abort,
    timeout: _timeout,
    httpError: _httpError
  });
  
  return this;
};

//------------------------------------------------------------------------------
