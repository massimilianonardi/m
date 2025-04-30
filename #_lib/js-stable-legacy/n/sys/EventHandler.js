//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function EventHandler()
{
  this.listeners = {};
}

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

EventHandler.prototype.register = function(name, listener)
{
  this.listeners[name] = this.listeners[name] || [];
  this.listeners[name].push(listener);
};

//------------------------------------------------------------------------------

EventHandler.prototype.unregister = function(name, listener)
{
  var listeners = this.listeners[name] || [];
  for(var i = 0; i < listeners.length; i++)
  {
    if(listeners[i] === listener)
    {
      listeners.splice(i, 1);
    }
  }
};

//------------------------------------------------------------------------------

EventHandler.prototype.notify = function(name, args)
{
  var listeners = this.listeners[name] || [];
  for(var i = 0; i < listeners.length; i++)
  {
    listeners[i].apply(undefined, args);
  }
};

//------------------------------------------------------------------------------
