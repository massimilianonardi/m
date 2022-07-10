//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function DataSource()
{
  return Class(DataSource).construct(this, arguments);
}

Class(DataSource).singleton();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

DataSource.prototype.register = function(listener, path)
{
  this.listeners = this.listeners || {};
  this.listeners[path] = this.listeners[path] || [];
  this.listeners[path].push(listener);
};

//------------------------------------------------------------------------------

DataSource.prototype.unregister = function(listener, path)
{
  this.listeners = this.listeners || {};
  var listeners = this.listeners[path] || [];
  for(var i = 0; i < listeners.length; i++)
  {
    if(listeners[i] === listener)
    {
      listeners.splice(i, 1);
    }
  }
};

//------------------------------------------------------------------------------

DataSource.prototype.notify = function(path)
{
  this.listeners = this.listeners || {};
  var listeners = this.listeners[path] || [];
  for(var i = 0; i < listeners.length; i++)
  {
    listeners[i].eventDataChanged();
  }
};

//------------------------------------------------------------------------------
