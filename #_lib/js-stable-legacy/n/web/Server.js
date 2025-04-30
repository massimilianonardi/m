//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Server()
{
  return Class(Server).construct(this, arguments);
}

Class(Server)
//.compose("event", sys.Event)
.property("url")
.property("method", "GET")
.property("async", true)
//.property("cache", true)
//.property("timeout")
.property("params")
//.property("data")
.property("parse", true)
//.property("context", undefined)
//.property("success", function(data, mime, xhr){})
//.property("error", function(status, data, xhr){})
.property("retries", 1)
//.property("authenticate", function(data, xhr){})
//.property("complete", function(status, xhr){})
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//Server.prototype.construct = function()
//{
//  console.log(this, this.parse());
//};

//------------------------------------------------------------------------------

Server.prototype.execute = function()
{
  function ajax(url, method, async, params, parse, success, error, authenticate, count, retries, complete)
  {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function()
    {
      switch(xhr.readyState)
      {
        case XMLHttpRequest.UNSENT:
          // request not initialized
          break;

        case XMLHttpRequest.OPENED:
          // connection established
          break;

        case XMLHttpRequest.HEADERS_RECEIVED:
          // request received
          break;

        case XMLHttpRequest.LOADING:
          // processing request
          break;

        case XMLHttpRequest.DONE:
          // response is ready
          var mime = (xhr.getResponseHeader("Content-Type") || "").split(";")[0];

          var data = xhr.responseText;
//          if(parse)
          if(!(parse === false))
          {
            if(xhr.responseXML !== null)
            {
              data = xhr.responseXML;
            }
            else if(xhr.responseText === null || xhr.responseText === "")
            {
            }
            else if(mime === "application/json")
            {
              data = JSON.parse(xhr.responseText);
            }
            else if(mime === "text/html")
            {
              data = new DOMParser().parseFromString(xhr.responseText, mime);
            }
          }

          if((200 <= xhr.status) && (xhr.status <= 299))
          {
            success(data, mime, method, xhr);
          }
          else if(xhr.status === 401)
          {
            if(count < retries)
            {
              var retryCallback = ajax.bind(undefined, url, method, async, params, parse, success, error, authenticate, ++count, retries, complete);
              authenticate(retryCallback, data, method, xhr);
            }
            else
            {
              error(xhr.status, data, method, xhr);
            }
          }
          else
          {
            error(xhr.status, data, method, xhr);
          }
          complete(xhr.status, method, xhr);
          break;

        default:
          break;
      }
    };

    if(typeof params !== "undefined" && params !== null)
    {
//      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      if(typeof params === "object")
      {
        var tmp = "";
        for(var prop in params)
        {
          if(params.hasOwnProperty(prop))
          {
            if(0 < tmp.length)
            {
              tmp += "&";
            }
            if(typeof params[prop] !== "object")
            {
              tmp += encodeURI(prop + "=" + params[prop]);
            }
            else
            {
              tmp += encodeURI(prop + "=" + JSON.stringify(params[prop]));
            }
          }
        }
        params = tmp;
      }
    }
    
    if(method === "GET")
    {
      url = url + "?" + params;
      params = undefined;
    }
    xhr.open(method, url, async);
    if(method !== "GET")
    {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xhr.send(params);
  }
  
  ajax(this.url(), this.method(), this.async(), this.params(), this.parse(), this.success.bind(this), this.error.bind(this), this.authenticate.bind(this), 0, this.retries(), this.complete.bind(this));
};

//------------------------------------------------------------------------------

Server.prototype.success = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------

Server.prototype.error = function(status, data, method, xhr)
{
};

//------------------------------------------------------------------------------

Server.prototype.authenticate = function(retryCallback, data, method, xhr)
{
};

//------------------------------------------------------------------------------

Server.prototype.complete = function(status, method, xhr)
{
};

//------------------------------------------------------------------------------
