//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function EventTarget()
{
  this._event = {};
  this._event.listeners = {};
}

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

EventTarget.prototype.enable = function(name)
{
  // todo
  // if name is undefined then enable all
};

//------------------------------------------------------------------------------

EventTarget.prototype.disable = function(name)
{
  // todo
  // if name is undefined then disable all
  // move event function specified by name into this.disabled and replace it with an empty function
  // NB un/register functions must be aware of disabled events
};

//------------------------------------------------------------------------------

EventTarget.prototype.register = function(name, listener, unique)
{
  if(typeof name !== "string" || typeof listener !== "function")
  {
    throw new TypeError();
  }
  
  if(typeof this[name] !== "function")
  {
    throw new ReferenceError();
  }
  
  if(unique)
  {
    this[name] = listener;
    delete this._event.listeners[name];
    return this;
  }
  
  if(typeof this._event.listeners[name] === "undefined")
  {
    this._event.listeners[name] = [];
    this._event.listeners[name].push(this[name]);
    this[name] = function()
    {
      var listeners = this._event.listeners[name] || [];
      for(var i = 0; i < listeners.length; i++)
      {
        listeners[i].apply(this, arguments);
      }
    };
  }
  this._event.listeners[name].push(listener);
  
  return this;
};

//------------------------------------------------------------------------------

EventTarget.prototype.unregister = function(name, listener)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  if(typeof listener === "undefined")
  {
    delete this._event.listeners[name];
    delete this[name];
    return this;
  }
  
  if(typeof listener !== "function")
  {
    throw new TypeError();
  }
  
  var listeners = this._event.listeners[name] || [];
  for(var i = 0; i < listeners.length; i++)
  {
    if(listeners[i] === listener)
    {
      listeners.splice(i, 1);
    }
  }
  
  return this;
};

//------------------------------------------------------------------------------
