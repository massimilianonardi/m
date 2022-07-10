//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Lang()
{
  return Class(Lang).construct(this, arguments);
}

Class(Lang).singleton();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Lang.prototype.register = function(listener, path)
{
  this.listeners = this.listeners || {};
  this.listeners[path] = this.listeners[path] || [];
  this.listeners[path].push(listener);
};

//------------------------------------------------------------------------------

Lang.prototype.unregister = function(listener, path)
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

Lang.prototype.add = function(lang, path)
{
  var self = this;
  
  function extend(dest, data)
  {
//    dest.data = dest.data || {};
//    $.extend(true, dest.data, data);
    $.extend(true, dest, data);
  }
  
  function merge(data)
  {
    // todo call listeners
    // for each listener beneath the parent call its changed method with part of data for which is subscribed
    var _parent = path;
    var _data = data;
    if(typeof path === "undefined")
    {
      _parent = "";
      self.data = self.data || {};
      extend(self.data, _data);
    }
    else
    {
      extend(self.get(_parent), _data);
    }
    
    for(var k in self.listeners)
    {
//      if((k === "" && _parent === "") || (k !== "" && _parent !== "" && _parent.indexOf(k) === 0) || (k !== "" && _parent !== "" && k.indexOf(_parent) === 0))
      if(_parent.indexOf(k) === 0 || k.indexOf(_parent) === 0)
      {
        var listeners = self.listeners[k];
//        var registeredData = this.get(k);
        for(var i = 0; i < listeners.length; i++)
        {
//          listeners[i].eventLangChanged(registeredData);
          listeners[i].lang(self.data);
          listeners[i].eventLangChanged(self.data);
        }
      }
    }
  }
  
  if(typeof lang === "string")
  {
    var loader = new web.data.Data().url(lang);
    loader.eventDataLoad = merge;
    loader.get();
  }
  else
  {
    merge(lang);
  }
};

//------------------------------------------------------------------------------

Lang.prototype.get = function(path)
{
  this.data = this.data || {};
  var root = this.data;
  
  if(typeof path === "undefined" || path === null)
  {
    return root;
  }
  
  if(typeof path !== "string")
  {
    throw new TypeError();
  }
  
  if(path === "")
  {
    return root;
  }
  
  var iterator = root;
  var pathArray = path.split(".");
  for(var i = 0; i < pathArray.length; i++)
  {
    iterator[pathArray[i]] = iterator[pathArray[i]] || {};
    iterator = iterator[pathArray[i]];
  }
  
  return iterator;
};

//------------------------------------------------------------------------------
