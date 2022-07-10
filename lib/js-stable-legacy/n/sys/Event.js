//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Event()
{
  return Class(Event).construct(this, arguments);
}

Class(Event)
.compose("event", Object)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Event.prototype.construct = function()
{
  this.event.listeners = {};
};

//------------------------------------------------------------------------------

Event.prototype.enable = function(name)
{
  // todo
  // if name is undefined then enable all
};

//------------------------------------------------------------------------------

Event.prototype.disable = function(name)
{
  // todo
  // if name is undefined then disable all
  // move event function specified by name into this.disabled and replace it with an empty function
  // NB un/register functions must be aware of disabled events
};

//------------------------------------------------------------------------------

Event.prototype.register = function(name, listener, unique)
{
  if(typeof name !== "string" || typeof listener !== "function")
  {
    throw new TypeError();
  }
  
  if(unique || typeof this.event[name] === "undefined")
  {
    this.event[name] = listener;
    return this;
  }
  
  if(typeof this.event.listeners[name] === "undefined")
  {
    this.event.listeners[name] = [];
    if(typeof this.event[name] === "function")
    {
      this.event.listeners[name].push(this.event[name]);
    }
    this.event[name] = function()
    {
      var listeners = this.listeners[name] || [];
      for(var i = 0; i < listeners.length; i++)
      {
        listeners[i].apply(undefined, arguments);
      }
    };
  }
  this.event.listeners[name].push(listener);
};

//------------------------------------------------------------------------------

Event.prototype.unregister = function(name, listener)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  if(typeof listener === "undefined")
  {
    delete this.event.listeners[name];
    delete this.event[name];
    return this;
  }
  
  if(typeof listener !== "function")
  {
    throw new TypeError();
  }
  
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

//Class(Event).compose("event", "event01", function(arg1, arg2)
//{
//  console.log("event01", this, arguments);
//});

//------------------------------------------------------------------------------
