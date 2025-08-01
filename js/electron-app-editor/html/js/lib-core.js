
var m = m  || {};

this.m = m;

m = (function ()
{

for(var $_sub_module_iterator in m){eval("var " + $_sub_module_iterator + " = m[$_sub_module_iterator];");}

var util = util  || {};

this.util = util;

util = (function ()
{

for(var $_sub_module_iterator in util){eval("var " + $_sub_module_iterator + " = util[$_sub_module_iterator];");}

function environment()
{
//  return (new Function(_environment.toString().slice(25, -1)))();
  return (new Function("return (" + _environment.toString() + ")()"))();
}

function _environment()
{
  var e = "undefined";
  
//  if(Object.prototype.toString.call(window) === "[object Window]")
  if(typeof window !== "undefined")
  {
    if(-1 < navigator.userAgent.toLowerCase().indexOf(" electron/"))
    {
      e = "electron";
    }
    else
    {
      e = "browser";
    }
  }
  else if(typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node !== "undefined")
  {
    e = "nodejs";
  }
  
  return e;
}

function deviceMobility()
{
  if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))
  {
    return "mobile";
  }
  else
  {
    return "fixed";
  }
}

function isMobile()
{
  if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))
  {
    return true;
  }
  else
  {
    return false;
  }
}
this.environment = environment;
this.deviceMobility = deviceMobility;
this.isMobile = isMobile;

var timestamp = Date.now;

if(typeof performance !== "undefined" && typeof performance.now === "function")
{
  timestamp = performance.now;
}

//function timestamp()
//{
//  if(typeof performance !== "undefined" && typeof performance.now === "function")
//  {
//    return performance.now();
//  }
//  else
//  {
//    return Date.now();
//  }
//}
this.timestamp = timestamp;

var timestamp = Date.now;
//var timestamp = m.util.timestamp;
//var timestamp = util.timestamp;

function performance(test, context, args, accuracy, accuracyFast)
{
  if(typeof test !== "function")
  {
    throw new TypeError();
  }
  
  var _accuracy = 1000;
  var _accuracyFast = 100;
  
  if(typeof accuracy === "number")
  {
    _accuracy = accuracy;
  }
  
  if(typeof accuracyFast === "number")
  {
    _accuracyFast = accuracyFast;
  }
  
  var t1 = timestamp();
  var t2 = t1;
  
  var count = 0;
  
  while((t2 - t1) < _accuracyFast)
  {
    test.apply(context, args);
    t2 = timestamp();
    count++;
  }
  
  var dt = t2 - t1;
  
  if(dt < _accuracy)
  {
    count = Math.ceil(count * _accuracy / _accuracyFast);
  }
  else
  {
    count = 1;
  }
  
  t1 = timestamp();
  for(var i = 0; i < count; i++)
  {
    test.apply(context, args);
  }
  t2 = timestamp();
  
  dt = t2 - t1;
  var empty = function(){};
  
  t1 = timestamp();
  for(var i = 0; i < count; i++)
  {
    empty.apply(context, args);
  }
  t2 = timestamp();
  
  var dte = (t2 - t1);
  
  t1 = timestamp();
  for(var i = 0; i < count; i++)
  {
  }
  t2 = timestamp();
  
  var dtl = (t2 - t1);
  
  var dtne = dt - dte;
  var dtnl = dt - dtl;
  
  var p = {};
  p.ops_per_sec = count * 1000 / dtnl;
  p.ops_per_sec_body = count * 1000 / dtne;
  p.avg_ms_per_exec = dtnl / count;
  p.avg_ms_per_exec_body = dtne / count;
  p.num_tests = count;
  console.log("performance", p);
  
  return p;
}
this.performance = performance;

var uniqueIDSequence = 0;

function uniqueID()
{
  return Math.floor((uniqueIDSequence++ + Math.random()) * 1000);
//  var id = "" + new Date().getTime() + "_" + Math.random().toString().substring(2);
//  var date = new Date();
//  return date.getSeconds() * 1000 + date.getMilliseconds();
//  return new Date().getTime() + Math.random();
}
this.uniqueID = uniqueID;

// todo check if freeze (for bitmask values) at end of file impacts on performance
// todo faster native detection
// todo implement more native objects clone
// todo if source is an anonymous function use decompile + merge to clone it (and named functions???)
// todo add bitmask to keep references to base types for property leaves (where maximum level reached) with getters/setters (according to level)
function clone(source, level, bitmask)
{
  if(arguments.length < 1)
  {
    throw new SyntaxError();
  }
  
  var _level = level;
  
  if(_level === true)
  {
    _level = Number.MAX_SAFE_INTEGER;
  }
  else if(typeof _level === "undefined" || _level === false)
  {
    _level = 0;
  }
  else if(typeof _level === "number" && 0 <= _level)
  {
    _level = Math.floor(_level);
  }
  else
  {
    throw new TypeError();
  }
  
//  if(typeof reference !== "undefined" && reference !== null && typeof reference !== "boolean")
//  {
//    throw new TypeError();
//  }
//  
//  if(typeof values !== "undefined" && values !== null && typeof values !== "boolean")
//  {
//    throw new TypeError();
//  }
//  
//  if(typeof objects !== "undefined" && objects !== null && typeof objects !== "boolean")
//  {
//    throw new TypeError();
//  }
  
  return _clone(source, _level, !!(bitmask & clone.error), !!(bitmask & clone.value), !!(bitmask & clone.enum), !!(bitmask & clone.instance), !!(bitmask & clone.ideep), !!(bitmask & clone.iall));
}

// native unclonable objects throw error instead of returning a reference
clone.error = 1;

// copy properties by value instead of deep cloning by property descriptors
clone.value = 2;

// clone only enumerable properties
clone.enum = 4;

// instances are not cloned, but copied by reference
clone.instance = 8;

// override eventual clone.value flag for instances forcing deep cloning by property descriptors
clone.ideep = 16;

// override eventual clone.enum flag for instances forcing cloning of not enumerable also
clone.iall = 32;

function _clone(source, level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone)
{
  var _rs = referencesSource || [];
  var _rc = referencesClone || [];
  
  var _index = _rs.indexOf(source);
  
  if(_index !== -1)
  {
    return _rc[_index];
  }
  
  if(level < 0 || typeof source !== "object" || source === null)
  {
    return source;
  }
  
  var _level = level - 1;
  
  var _target = undefined;
  
  if(Object.getPrototypeOf(source) === Object.prototype || Object.getPrototypeOf(source) === null)
  {
    _target = _cloneObject(source, _level, _error, _value, _enum, _instance, _ideep, _iall, _rs, _rc);
  }
  else if(Array.isArray(source))
  {
    _target = _cloneObject(source, _level, _error, _value, _enum, _instance, _ideep, _iall, _rs, _rc);
  }
  else
  {
    var _class = Object.prototype.toString.call(source).slice(8, -1);
    
    if(_class === "Object")
    {
      if(_instance === false)
      {
        _target = source;
      }
      else
      {
        _target = _cloneObject(source, _level, _error, _value, _enum, _instance, _ideep, _iall, _rs, _rc);
      }
    }
    else if(_class === "RegExp")
    {
      _target = new RegExp(source.source, source.flags);
//      _target.lastIndex = source.lastIndex;
    }
    else if(_class === "Date" || _class === "String" || _class === "Number" || _class === "Boolean")
    {
      _target = new source.constructor(source.valueOf());
    }
//    else if(_class === "Map")
//    {
//      _target = new Map();
//      _target = _cloneMap(_target, source, _level, _error, _value, _enum, _instance, _ideep, _iall, _rs, _rc);
//    }
//    else if(_class === "Set")
//    {
//      _target = new Set();
//      _target = _cloneSet(_target, source, _level, _error, _value, _enum, _instance, _ideep, _iall, _rs, _rc);
//    }
//    else if(_class === "WeakMap")
//    {
//      _target = new WeakMap();
//      _target = _cloneMap(_target, source, _level, _error, _value, _enum, _instance, _ideep, _iall, _rs, _rc);
//    }
//    else if(_class === "WeakSet")
//    {
//      _target = new WeakSet();
//      _target = _cloneSet(_target, source, _level, _error, _value, _enum, _instance, _ideep, _iall, _rs, _rc);
//    }
    else if(_class === "Blob")
    {
      _target = source.slice(0, source.size, source.type);
    }
    else
    {
      if(_error === false)
      {
        _target = source;
      }
      else
      {
        throw new ReferenceError();
      }
    }
  }
  
  return _target;
}

function _cloneObject(source, level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone)
{
  var _target = Object.create(Object.getPrototypeOf(source));
  
  referencesSource.push(source);
  referencesClone.push(_target);
  
  var propertyDescriptors = Object.getOwnPropertyDescriptors(source);
  
  if(_value === false && _enum === false)
  {
    for(var k in propertyDescriptors)
    {
      if(propertyDescriptors[k].hasOwnProperty("value"))
      {
        propertyDescriptors[k].value = _clone(propertyDescriptors[k].value, level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone);
        Object.defineProperty(_target, k, propertyDescriptors[k]);
      }
      else
      {
        Object.defineProperty(_target, k, propertyDescriptors[k]);
      }
    }
  }
  else if(_value === true && _enum === false)
  {
    for(var k in propertyDescriptors)
    {
      _target[k] = _clone(source[k], level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone);
    }
  }
  else if(_value === false && _enum === true)
  {
    for(var k in propertyDescriptors)
    {
      if(propertyDescriptors[k].enumerable === true)
      {
        if(propertyDescriptors[k].hasOwnProperty("value"))
        {
          propertyDescriptors[k].value = _clone(propertyDescriptors[k].value, level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone);
          Object.defineProperty(_target, k, propertyDescriptors[k]);
        }
        else
        {
          Object.defineProperty(_target, k, propertyDescriptors[k]);
        }
      }
    }
  }
  else if(_value === true && _enum === true)
  {
    for(var k in propertyDescriptors)
    {
      if(propertyDescriptors[k].enumerable === true)
      {
        _target[k] = _clone(source[k], level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone);
      }
    }
  }
  
  return _target;
}

//function _cloneMap(target, source, level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone)
//{
//  return target;
//}

//function _cloneSet(target, source, level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone)
//{
//  return target;
//}

//function _cloneArray(source, level, _error, _value, _enum, _instance, _ideep, _iall, referencesSource, referencesClone)
//{
//  var _target = [];
//
//  referencesSource.push(source);
//  referencesClone.push(_target);
//
//  for(var i = 0; i < source.length; i++)
//  {
//    _target[i] = _clone(source[i], level, reference, values, objects, referencesSource, referencesClone);
//  }
//  
//  return _target;
//}

Object.freeze(clone);
this.clone = clone;

var clone = util.clone;

// - level merge/replace tells level of algorithm where to stop
// - level copy tells how replace happens (NB -1 means copyreference)
// - append allows special merge for arrays
// - instances allows simple merge of instances
// 
// todo more params + distinct params for clone
// - level merge/replace for simple objects
// - level merge/replace/append for arrays
// - level merge/replace for instances
// - merge/replace by propdescr/value, enum/all distinct for simple objects, arrays and instances
// - instances merge by cloning proto chain into object linearly
// - instances merge own and merge proto chains
// - instances merge own and merge proto chains into a new one
// todo better instances merge (whole prototype chain, not enumerable properties and getters/setters)
// todo faster native detection
function merge(target, source, levelMerge, levelCopy, append, instances)
{
  if(arguments.length < 2)
  {
    throw new SyntaxError();
  }
  
  var _levelMerge = levelMerge;
  if(_levelMerge === true)
  {
    _levelMerge = Number.MAX_SAFE_INTEGER;
  }
  else if(typeof _levelMerge === "undefined" || _levelMerge === false)
  {
    _levelMerge = 0;
  }
  else if(typeof _levelMerge === "number" && 0 <= _levelMerge)
  {
    _levelMerge = Math.floor(_levelMerge);
  }
  else
  {
    throw new TypeError();
  }
  
  var _levelCopy = levelCopy;
  if(_levelCopy === true)
  {
    _levelCopy = Number.MAX_SAFE_INTEGER;
  }
  else if(typeof _levelCopy === "undefined" || _levelCopy === false)
  {
    _levelCopy = 0;
  }
  else if(typeof _levelCopy === "number" && 0 <= _levelCopy)
  {
    _levelCopy = Math.floor(_levelCopy);
  }
  else
  {
    throw new TypeError();
  }
  
  if(typeof append !== "undefined" && append !== null && typeof append !== "boolean")
  {
    throw new TypeError();
  }
  
  if(typeof instances !== "undefined" && instances !== null && typeof instances !== "boolean")
  {
    throw new TypeError();
  }
  
  if(typeof target === "function" && (typeof source === "function" || (typeof source === "object" && source !== null && (Object.getPrototypeOf(source) === Object.prototype || Object.getPrototypeOf(source) === null))))
  {
    var _referencesSource = [];
    var _referencesTarget = [];
    
    _referencesSource.push(source);
    _referencesTarget.push(target);
    
    for(var k in source)
    {
      target[k] = _merge(target[k], source[k], _levelMerge - 1, _levelCopy, append, instances, _referencesSource, _referencesTarget);
    }
  }
  else
  {
    target = _merge(target, source, _levelMerge, _levelCopy, append, instances);
  }
  
  return target;
}

function _merge(target, source, levelMerge, levelCopy, append, instances, referencesSource, referencesTarget)
{
  var _rs = referencesSource || [];
  var _rt = referencesTarget || [];
  
  var _index = _rs.indexOf(source);
  
  if(_index !== -1)
  {
    return _rt[_index];
  }
  
  if(levelMerge < 0 || typeof source !== "object" || source === null)
  {
//    console.log("level", source, levelMerge);
    return source;
  }
  
  var _levelMerge = levelMerge - 1;
  
  _rs.push(source);
  _rt.push(target);
  
  if(typeof append === "boolean" && Array.isArray(target) && Array.isArray(source))
  {
    if(append === true)
    {
      for(var i = 0; i < source.length; i++)
      {
        target.push(clone(source[i], levelCopy));
      }
    }
    else
    {
      for(var i = 0; i < source.length; i++)
      {
        target[i] = _merge(target[i], source[i], _levelMerge, levelCopy, append, instances, _rs, _rt);
      }
    }
  }
  else if(typeof target === "object" && target !== null && (Object.getPrototypeOf(target) === Object.prototype || Object.getPrototypeOf(target) === null) && (Object.getPrototypeOf(source) === Object.prototype || Object.getPrototypeOf(source) === null))
  {
    for(var k in source)
    {
      target[k] = _merge(target[k], source[k], _levelMerge, levelCopy, append, instances, _rs, _rt);
    }
  }
  else if(instances === true && Object.prototype.toString.call(target).slice(8, -1) === "Object" && Object.prototype.toString.call(source).slice(8, -1) === "Object")
  {
    for(var k in source)
    {
      target[k] = _merge(target[k], source[k], _levelMerge, levelCopy, append, instances, _rs, _rt);
    }
  }
  else
  {
    return clone(source, levelCopy);
  }
  
  return target;
};
this.merge = merge;

function link(source, target, property, renamed, deep, arrays)
{
  if(typeof source !== "object" && typeof source !== "function")
  {
    throw new TypeError();
  }
  
  if(typeof target !== "object" && typeof target !== "function")
  {
    throw new TypeError();
  }
  
  var _property = undefined;
  var _renamed = undefined;
  var _deep = false;
  var _arrays = false;
  
  if(typeof property === "string")
  {
    _property = property;
    if(typeof renamed === "string")
    {
      _renamed = renamed;
      if(typeof deep === "boolean")
      {
        _deep = deep;
        if(typeof arrays === "boolean")
        {
          _arrays = arrays;
        }
        else if(5 < arguments.length)
        {
          throw new TypeError();
        }
      }
      else if(4 < arguments.length)
      {
        throw new TypeError();
      }
    }
    else if(typeof renamed === "boolean")
    {
      _renamed = property;
      _deep = renamed;
      if(typeof deep === "boolean")
      {
        _arrays = deep;
      }
      else if(4 < arguments.length)
      {
        throw new TypeError();
      }
    }
    else if(3 < arguments.length)
    {
      throw new TypeError();
    }
  }
  else if(typeof property === "boolean")
  {
    _deep = property;
    if(typeof renamed === "boolean")
    {
      _arrays = renamed;
    }
    else if(3 < arguments.length)
    {
      throw new TypeError();
    }
  }
  else if(2 < arguments.length)
  {
    throw new TypeError();
  }
  
  console.log(source, target, property, renamed, deep, arrays);
  console.log(source, target, _property, _renamed, _deep, _arrays);
  
  if(typeof _property === "undefined")
  {
    if(typeof _renamed === "undefined")
    {
      for(var k in source)
      {
        link(source, target, k, _deep, _arrays);
      }
    }
    else
    {
      throw new TypeError();
    }
  }
  else if(typeof _property === "string")
  {
    link(source, target, _property, _renamed, _deep, _arrays);
  }
  else if(_arrays === false)
  {
    var value = source[k];
    if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || value === null)
    {
      var todo;
    }
    if(typeof source[k] === "object" && typeof source[k] === "function")
    {
      link(source[k], target[k]);
    }
    else
    {
      link(source, target, k);
    }
    
    return target;
  }
  
  
  
  
  
  if(typeof property !== "string")
  {
    throw new TypeError();
  }
  
  var targetProperty = renamed;
  if(arguments.length === 3)
  {
    targetProperty = property;
  }
  else if(typeof renamed !== "string")
  {
    throw new TypeError();
  }
  
  var getter = function(_source, _property)
  {
    return function()
    {
      return _source[_property];
    };
  }(source, property);
  
  var setter = function(_target, _property)
  {
    return function(value)
    {
      if(this === _target)
      {
        delete _target[_property];
      }
      Object.defineProperty(this, _property, {configurable: true, enumerable: true, writable: true, value: value});
    };
  }(target, targetProperty);
  
  Object.defineProperty(target, targetProperty, {configurable: true, enumerable: true, get: getter, set: setter});
  
  return target;
}

//------------------------------------------------------------------------------

function linkProperty(source, target, property, renamed)
{
  if(typeof source !== "object" && typeof source !== "function")
  {
    throw new TypeError();
  }
  
  if(typeof target !== "object" && typeof target !== "function")
  {
    throw new TypeError();
  }
  
  if(typeof property !== "string")
  {
    throw new TypeError();
  }
  
  var propertyTarget = renamed;
  if(arguments.length === 3 || typeof renamed === "undefined")
  {
    propertyTarget = property;
  }
  
  var getter = function(_source, _property)
  {
    return function()
    {
      return _source[_property];
    };
  }(source, property);
  
  var setter = function(_target, _property)
  {
    return function(value)
    {
      if(this === _target)
      {
        delete _target[_property];
      }
      Object.defineProperty(this, _property, {configurable: true, enumerable: true, writable: true, value: value});
    };
  }(target, propertyTarget);
  
  Object.defineProperty(target, propertyTarget, {configurable: true, enumerable: true, get: getter, set: setter});
  
  return target;
};

//------------------------------------------------------------------------------

function linkObject(source, target, own, level, arrays)
{
  if(typeof source !== "object" && typeof source !== "function")
  {
    throw new TypeError();
  }
  
  if(typeof target !== "object" && typeof target !== "function")
  {
    throw new TypeError();
  }
  
  var _own = true;
  var _level = 0;
  var _arrays = false;
  
  if(typeof own === "boolean")
  {
    _own = own;
  }
  else if(2 < arguments.length)
  {
    throw new TypeError();
  }
  
  if(typeof level === "number")
  {
    _level = level;
  }
  else if(3 < arguments.length)
  {
    throw new TypeError();
  }
  
  if(typeof arrays === "boolean")
  {
    _arrays = arrays;
  }
  else if(4 < arguments.length)
  {
    throw new TypeError();
  }
  
  // if 0<=level if correct own
  for(var k in source)
  {
    if(_own === false || (_own === true && source.hasOwnProperty(k)))
    {
      link(source, target, _own, _level, _arrays);
    }
  }
  
  return target;
};

//------------------------------------------------------------------------------
this.link = link;
this.linkProperty = linkProperty;

function ajax(url, params, method, type, async, response, error, abort, timeout, send, receive, username, password)
{
  if(1 === arguments.length)
  {
    var args = arguments[0];
    if(typeof args === "string")
    {
      return _ajax(args);
    }
    else if(typeof args === "object")
    {
      return _ajax(args.url, args.params, args.method, args.type, args.async, args.response, args.error, args.abort, args.timeout, args.send, args.receive, args.username, args.password);
    }
    else
    {
      throw new TypeError();
    }
  }
  else
  {
    return _ajax.apply(this, arguments);
  }
}

function ajaxAdvanced(url, params, method, type, async, response, error, abort, timeout, send, receive, username, password, parse, success, httpError, authentication, unauthorized)
{
  if(1 === arguments.length)
  {
    var args = arguments[0];
    if(typeof args === "string")
    {
      return _ajax(args);
    }
    else if(typeof args === "object")
    {
      return _ajax(args.url, args.params, args.method, args.type, args.async, _response(args.parse, args.success, args.httpError, args.authentication, args.unauthorized, args.response), args.error, args.abort, args.timeout, args.send, args.receive, args.username, args.password);
    }
    else
    {
      throw new TypeError();
    }
  }
  else
  {
    return _ajax.call(this, url, params, method, type, async, _response(parse, success, httpError, authentication, unauthorized, response), error, abort, timeout, send, receive, username, password);
  }
}

function _response(parse, success, error, authentication, unauthorized, response)
{
  if(typeof parse === "undefined" && typeof success === "undefined" && typeof error === "undefined" && typeof authentication === "undefined" && typeof unauthorized === "undefined")
  {
    return response;
  }
  else
  {
    return function(event)
    {
      var xhr = this;
      var _response = xhr.response;
      var _status = xhr.status;
      
      if(typeof response === "function")
      {
        response.apply(this, arguments);
      }
      
      var data = _response;
      if(parse === "" || parse === "string" || typeof data === "undefined" || data === null || data === "")
      {
      }
      else if(parse === "mime")
      {
        var mime = (xhr.getResponseHeader("Content-Type") || "").split(";")[0];
        if(mime === "application/json")
        {
          data = JSON.parse(_response);
        }
        else if(mime === "application/xml")
        {
          data = (new DOMParser()).parseFromString(_response, "application/xml");
        }
      }
      else if(parse === "json")
      {
        data = JSON.parse(_response);
      }
      else if(parse === "xml")
      {
        data = (new DOMParser()).parseFromString(_response, "application/xml");
      }
      else if(parse === "binary")
      {
        var size = _response.length;
        data = new ArrayBuffer(size * 2);
        var abv = new Uint16Array(data);
        for(var i = 0; i < size; i++)
        {
          abv[i] = _response.charCodeAt(i);
        }
      }
      else
      {
        throw new TypeError();
      }
      this.data = data;
      
      if((200 <= _status) && (_status <= 299))
      {
        if(typeof success === "function")
        {
          success.call(this, data);
        }
      }
      else if(_status === 401)
      {
        if(typeof authentication === "function")
        {
          authentication.apply(this, arguments);
        }
      }
      else if(_status === 403)
      {
        if(typeof unauthorized === "function")
        {
          unauthorized.apply(this, arguments);
        }
      }
      else
      {
        if(typeof error === "function")
        {
          error.apply(this, arguments);
        }
      }
    };
  }
}

function _ajax(url, params, method, type, async, response, error, abort, timeout, send, receive, username, password)
{
  if(typeof url !== "string")
  {
    throw new TypeError();
  }
  
  var _method = "GET";
  if(typeof method !== "undefined" && method !== null)
  {
    if(typeof method !== "string")
    {
      throw new TypeError();
    }
    else
    {
      _method = method.toUpperCase();
      if(!(method === "GET" || method === "POST" || method === "PUT" || method === "DELETE" || method === "HEAD" || method === "CONNECT" || method === "TRACE" || method === "OPTIONS" || method === "PATCH"))
      {
        throw new SyntaxError();
      }
    }
  }
  
  var _async = true;
  if(typeof async !== "undefined" && async !== null)
  {
    if(typeof async !== "boolean")
    {
      throw new TypeError();
    }
    else
    {
      _async = async;
    }
  }
  
  var _paramsURL = "";
  var _paramsBody = undefined;
  if(_method === "GET" || _method === "HEAD" || _method === "DELETE" || _method === "CONNECT" || _method === "TRACE")
  {
    if(!(Object.getPrototypeOf(params) === Object.prototype || Object.getPrototypeOf(params) === null))
    {
      throw new TypeError();
    }
    
    for(var k in params)
    {
      var value = params[k];
      
      if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || value === null)
      {
      }
      else if(typeof value === "object")
      {
        value = JSON.stringify(value);
      }
      else
      {
        throw new TypeError();
      }
      
      _paramsURL += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(value);
    }
    
    if(0 < _paramsURL.length)
    {
      _paramsURL = "?" + _paramsURL.substr(1);
    }
  }
  else
  {
    if(Object.getPrototypeOf(params) === Object.prototype || Object.getPrototypeOf(params) === null)
    {
      var fd = new FormData();
      for(var k in params)
      {
        var value = params[k];

        if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || value === null)
        {
          fd.append(k, value);
        }
        else if(Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null || Object.getPrototypeOf(value) === Array.prototype)
        {
          fd.append(k, JSON.stringify(value));
        }
        else if(value instanceof ArrayBuffer)
        {
          fd.append(k, new Blob([value]));
        }
        else if(typeof value === "object")
        {
          fd.append(k, value);
        }
        else
        {
          throw new TypeError();
        }
      }
      
      _paramsBody = fd;
    }
    else
    {
      _paramsBody = params;
    }
  }
  
  var xhr = new XMLHttpRequest();
  
  if(typeof error === "function")
  {
    xhr.onerror = error;
  }
  
  if(typeof abort === "function")
  {
    xhr.onabort = abort;
  }
  
  if(typeof timeout === "function")
  {
    xhr.ontimeout = timeout;
  }
  
  if(typeof send === "function")
  {
    xhr.upload.onprogress = send;
  }
  
  if(typeof receive === "function")
  {
    xhr.onprogress = receive;
  }
  
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
        if(typeof response === "function")
        {
          response.apply(this, arguments);
        }
        break;
      
      default:
        break;
    }
  };
  
  if(typeof username === "undefined" && typeof password === "undefined")
  {
    xhr.open(_method, url + _paramsURL, _async);
  }
  else
  {
    xhr.open(_method, url + _paramsURL, _async, username, password);
  }
  
//  xhr.overrideMimeType('text\/plain; charset=x-user-defined');
  
  if(typeof type === "string" && type !== "")
  {
    xhr.responseType = type;
  }
  else
  {
    xhr.responseType = "text";
  }
  
  xhr.send(_paramsBody);
}
this.ajax = ajax;
this.ajaxAdvanced = ajaxAdvanced;

function translate(source, language, sectionBegin, sectionEnd, directiveBegin, directiveEnd, elementSeparator)
{
  if(typeof source !== "string")
  {
    throw new TypeError();
  }
  
  var lang = language;
  if(!(typeof lang === "object" && typeof lang.get === "function"))
  {
    lang = g.lang || m.global.lang;
    if(!(typeof lang === "object" && typeof lang.get === "function"))
    {
      throw new ReferenceError();
    }
  }
  
  var _sectionBegin = sectionBegin;
  if(typeof _sectionBegin !== "string")
  {
    _sectionBegin = "<!--";
  }
  
  var _sectionEnd = sectionEnd;
  if(typeof _sectionEnd !== "string")
  {
    _sectionEnd = "-->";
  }
  
  var _directiveBegin = directiveBegin;
  if(typeof _directiveBegin !== "string")
  {
    _directiveBegin = "#translate:";
  }
  
  var _directiveEnd = directiveEnd;
  if(typeof _directiveEnd !== "string")
  {
    _directiveEnd = ";";
  }
  
  var separator = elementSeparator;
  if(typeof separator !== "string")
  {
    separator = ",";
  }
  
  var indexStart = source.indexOf(_sectionBegin);
  if(-1 < indexStart)
  {
    var indexEnd = source.indexOf(_sectionEnd, indexStart);
    if(-1 < indexEnd)
    {
      var directives = source.substring(indexStart + _sectionBegin.length, indexEnd);
      var translated = source.substring(0, indexStart) + source.substring(indexEnd + _sectionEnd.length);
      
      var indexStart = directives.indexOf(_directiveBegin);
      if(-1 < indexStart)
      {
        var indexEnd = directives.indexOf(_directiveEnd, indexStart);
        if(-1 < indexEnd)
        {
          var directive = directives.substring(indexStart + _directiveBegin.length, indexEnd);
          var strings = directive.split(separator);
          strings.sort(function(a, b){return (a.length > b.length ? -1 : 1);});
          for(var i = 0; i < strings.length; i++)
          {
            var string = strings[i].trim();
            var translation = lang.get(string);
            translated = translated.replace(new RegExp(string, "g"), translation);
          }

          return translated;
        }
      }
    }
  }
  
  return source;
}
this.translate = translate;

function jsonToObject(json, references)
{
  if(typeof json === "undefined")
  {
    return undefined;
  }
  
  var jsonObject = json;
  
  if(typeof json === "string")
  {
    jsonObject = JSON.parse(json);
  }
  else if(typeof json !== "object")
  {
    throw new TypeError();
  }
  
  var refs = {};
  
  if(typeof references === "object")
  {
    var r = references;
    
    if(!Array.isArray(references))
    {
      r = [references];
    }
    
    for(var i = 0; i < r.length; i++)
    {
      var obj = r[i];
      
      if(typeof obj !== "object")
      {
        throw new TypeError();
      }
      
      for(var k in obj)
      {
        refs[k] = obj[k];
      }
    }
  }
  
  return _jsonToObject(jsonObject, refs);
}

function _jsonToObject(json, refs, path)
{
  var references = refs || {};
  var currentPath = path || "";
  
  if(typeof json !== "undefined" && json !== null && typeof json.MassimilianoNardiObjectReference !== "undefined")
  {
    var ref = references[json.MassimilianoNardiObjectReference];
    if(typeof ref !== "undefined")
    {
      if(json.isConstructor === true)
      {
        if(typeof ref !== "function")
        {
          throw new TypeError();
        }
        
        var args = json.args;
        if(typeof args === "undefined")
        {
          args = [];
        }
        else if(json.recursion === true)
        {
          args = [];
          for(var i = 0; i < json.args.length; i++)
          {
            args.push(_jsonToObject(json.args[i], references, currentPath + "." + i));
          }
        }
        
        if(json.newOperator === true)
        {
//          references[currentPath] = new ref(...args);
          references[currentPath] = Object.create(ref.prototype);
          ref.apply(references[currentPath], args);
          return references[currentPath];
        }
        else
        {
//          references[currentPath] = ref(...args);
          references[currentPath] = ref.apply(undefined, args);
          return references[currentPath];
        }
      }
      else
      {
        references[currentPath] = ref;
        return references[currentPath];
      }
    }
    else
    {
      throw new ReferenceError();
    }
  }
  else
  {
    if(typeof json === "object")
    {
      var obj = {};
      if(Array.isArray(json))
      {
        obj = [];
      }
      
      for(var k in json)
      {
        obj[k] = _jsonToObject(json[k], references, currentPath + "." + k);
      }
      
      references[currentPath] = obj;
      return references[currentPath];
    }
    else
    {
      references[currentPath] = json;
      return references[currentPath];
    }
  }
}
this.jsonToObject = jsonToObject;

function keyBindEnterEsc(callbackOK, callbackCancel)
{
  return function(event)
  {
    if(event.keyCode === 13 || event.key === "Enter")
    {
      if(typeof callbackOK === "function")
      {
        callbackOK();
      }
      return false;
    }
    else if(event.keyCode === 27 || event.key === "Escape")
    {
      if(typeof callbackCancel === "function")
      {
        callbackCancel();
      }
      return false;
    }
    return true;
  };
}
this.keyBindEnterEsc = keyBindEnterEsc;

return this;

}.call(util));

var json = json  || {};

this.json = json;

json = (function ()
{

for(var $_sub_module_iterator in json){eval("var " + $_sub_module_iterator + " = json[$_sub_module_iterator];");}

function path(pathString, object)
{
  if(typeof pathString === "undefined" || pathString === null || pathString === "")
  {
    return object;
  }
  
  eval("var obj = object" + pathString + ";");
  
//  var pathSegments = pathString
//  .replace(new RegExp("\\[", "g"), ".")
//  .replace(new RegExp("\\]", "g"), "")
//  .split(".");
//  
//  var obj = object;
//  
//  if(pathSegments[0] !== "")
//  {
//    throw new ReferenceError();
//  }
//  
//  for(var i = 1; i < pathSegments.length; i++)
//  {
//    if(pathSegments[i] === "" || typeof obj[pathSegments[i]] === "undefined")
//    {
//      throw new ReferenceError();
//    }
//    obj = obj[pathSegments[i]];
//  }
  
  return obj;
}
this.path = path;

function canonicalize(path)
{
  var _path = "";
  var residualPath = path;
  while(0 < residualPath.length)
  {
    if(residualPath[0] === "[")
    {
      if(residualPath[1] !== "\"" && residualPath[1] !== "'")
      {
        var index = residualPath.indexOf("]");
        _path += residualPath.substring(0, index) + "]";
        residualPath = residualPath.substring(index + 1);
      }
      else
      {
        var index = residualPath.length - 2;
        var escape = false;
        for(var i = 2; i < residualPath.length - 2; i++)
        {
          if(escape === false && (residualPath[i] === "\"" || residualPath[i] === "'") && residualPath[i + 1] === "]")
          {
            index = i;
            break;
          }
          else if(escape === false && residualPath[i] === "\\")
          {
            escape = true;
          }
          else if(escape === true)
          {
            escape = false;
          }
        }
        _path += residualPath.substring(0, index) + "\"]";
        residualPath = residualPath.substring(index + 2);
      }
    }
    else if(residualPath[0] === ".")
    {
      residualPath = residualPath.substring(1);
      var index = residualPath.length;
      var index1 = residualPath.indexOf(".");
      var index2 = residualPath.indexOf("[");
      if(index1 === -1 && index2 === -1)
      {
      }
      else if(index1 === -1)
      {
        index = index2;
      }
      else if(index2 === -1)
      {
        index = index1;
      }
      else
      {
        index = Math.min(index1, index2);
      }
      
      _path += "[" + JSON.stringify(residualPath.substring(0, index)) + "]";
      residualPath = residualPath.substring(index);
    }
    else
    {
      throw new SyntaxError();
    }
  }
  
  return _path;
}
this.canonicalize = canonicalize;

function traverse(o, f)
{
  var nodes = [];
  var paths = [];
  var calcs = [];
  
  var _traverse = function(o, f, path, pathArray, parents, parentsPaths)
  {
    if(-1 !== nodes.indexOf(o) && typeof o === "object" && o !== null)
    {
      return;
    }
    
    var c;
    if(typeof f === "function")
    {
      c = f(o, path, pathArray, parents, parentsPaths);
    }
    
    nodes.push(o);
    paths.push(path);
    calcs.push(c);
    
    if(typeof o !== "object" || o === null)
    {
      return;
    }
    
    var _parents = Array.from(parents);
    _parents.unshift(o);
    
    var _parentsPaths = Array.from(parentsPaths);
    _parentsPaths.unshift(path);
    
    for(var k in o)
    {
      var p = !isNaN(k) ? path + "[" + k + "]" : path + "[" + JSON.stringify(k) + "]";
      var pa = Array.from(pathArray);
      pa.push(k);
      
      _traverse(o[k], f, p, pa, _parents, _parentsPaths);
    }
  };
  
  _traverse(o, f, "", [], [], []);
  
  return {nodes: nodes, paths: paths, calcs: calcs};
}

traverse.advanced = function(o, fAnte, fPost, fRecurse)
{
  var nodes = [];
  var paths = [];
  var calcsAnte = [];
  var calcsPost = [];
  
  var _traverse = function(o, fAnte, fPost, fRecurse, path, pathArray, parents, parentsPaths)
  {
    if(-1 !== nodes.indexOf(o) && typeof o === "object" && o !== null)
    {
      return;
    }
    
    var calcAnte;
    if(typeof fAnte === "function")
    {
      calcAnte = fAnte(o, path, pathArray, parents, parentsPaths);
    }
    
    if(typeof o === "object" && o !== null && (typeof fRecurse !== "function" || (typeof fRecurse === "function" && fRecurse(o, path, pathArray, parents))))
    {
      var _parents = Array.from(parents);
      _parents.unshift(o);
      
      var _parentsPaths = Array.from(parentsPaths);
      _parentsPaths.unshift(path);
      
      for(var k in o)
      {
        var p = !isNaN(k) ? path + "[" + k + "]" : path + "[" + JSON.stringify(k) + "]";
        var pa = Array.from(pathArray);
        pa.push(k);

        _traverse(o[k], fAnte, fPost, fRecurse, p, pa, _parents, _parentsPaths);
      }
    }
    
    var calcPost;
    if(typeof fPost === "function")
    {
      calcPost = fPost(o, path, pathArray, parents, parentsPaths);
    }
    
    nodes.push(o);
    paths.push(path);
    calcsAnte.push(calcAnte);
    calcsPost.push(calcPost);
  };
  
  _traverse(o, fAnte, fPost, fRecurse, "", [], [], []);
  
  return {nodes: nodes, paths: paths, calcs: calcsAnte};
};
this.traverse = traverse;

function resolve(object, references)
{
  var PREFIX_REFERENCE = "@ref:";
  var PREFIX_EVAL = "@eval:";
  var KEY_CALL = "@call";
  var KEY_NEW = "@new";
  var PARENT_OPERATOR = "^";
  var LOCAL_OBJECT_REFERENCE = "$";
  
  var isArray = function(o)
  {
    return (typeof o === "object" && o !== null && o.constructor.name === "Array");
  };
  
  var isArrayOrUndefinedOrNull = function(o)
  {
    return (typeof o === "undefined" || o === null || (typeof o === "object" && o !== null && o.constructor.name === "Array"));
  };
  
  var resolveLocalObjectReferencePath = function(o, path, pathArray, parents, parentsPaths)
  {
    var ref = o.substring(PREFIX_REFERENCE.length);
    
    if(0 === ref.indexOf(LOCAL_OBJECT_REFERENCE))
    {
      ref = ref.substring(LOCAL_OBJECT_REFERENCE.length);
      ref = canonicalize(ref);
      
      return ref;
    }
    else if(0 === ref.indexOf(PARENT_OPERATOR))
    {
      ref = ref.substring(PARENT_OPERATOR.length);
      var index = 0;
      while(0 === ref.indexOf(PARENT_OPERATOR))
      {
        ref = ref.substring(PARENT_OPERATOR.length);
        index++;
      }
      
      ref = parentsPaths[index] + canonicalize(ref);
      
      return ref;
    }
    
    throw new Error();
  };
  
  var resolveFunction = function(name, references)
  {
    var f;
    try
    {
      eval("f = references." + name + ";");
      if(typeof f === "undefined") throw new Error();
    }
    catch(error)
    {
      eval("f = " + name + ";");
    }
    
    if(typeof f !== "function")
    {
      throw new TypeError();
    }
    
    return f;
  };
  
  var resolveExternalObjectReference = function(o, references)
  {
    var obj;
    try
    {
      eval("obj = references." + o + ";");
      if(typeof obj === "undefined") throw new Error();
    }
    catch(error)
    {
      try
      {
        eval("obj = " + o + ";");
      }
      catch(error)
      {
      }
    }
    
    return obj;
  };
  
  var traverse_callback_resolve_external_dependencies = function(o, path, pathArray, parents, parentsPaths)
  {
    if(typeof o === "string" && 0 === o.indexOf(PREFIX_REFERENCE) && -1 === o.indexOf(PREFIX_REFERENCE + LOCAL_OBJECT_REFERENCE) && -1 === o.indexOf(PREFIX_REFERENCE + PARENT_OPERATOR))
    {
      var obj = resolveExternalObjectReference(o.substring(PREFIX_REFERENCE.length), references);
      
      eval("object" + path + " = obj;");
      
      return obj;
    }
    
    return null;
  };
  
  var traverse_callback_find_dependencies = function(o, path, pathArray, parents, parentsPaths)
  {
    var depend = null;
    var func = null;
    var context = null;
    
    if(typeof o === "string")
    {
      if(0 === o.indexOf(PREFIX_REFERENCE + LOCAL_OBJECT_REFERENCE) || 0 === o.indexOf(PREFIX_REFERENCE + PARENT_OPERATOR))
      {
        depend = resolveLocalObjectReferencePath(o, path, pathArray, parents, parentsPaths);
      }
      else if(0 === o.indexOf(PREFIX_EVAL))
      {
        func = eval;
      }
    }
    else if(isArray(o) && 1 < o.length && typeof o[0] === "string" && (0 === o[0].indexOf(KEY_CALL) || 0 === o[0].indexOf(KEY_NEW)))
    {
      if(typeof o[1] !== "string")
      {
        throw new ReferenceError();
      }
      
      if(o.length === 2)
      {
      }
      else if(o.length === 3)
      {
        if(!isArray(o[2]))
        {
          throw new ReferenceError();
        }
        
        var arg = o[2];
        if(arg.length === 1)
        {
          depend = path + "[2][0]";
        }
        else if(1 < arg.length)
        {
          depend = [];
          for(var i = 0; i < arg.length; i++)
          {
            depend.push(path + "[2][" + i + "]");
          }
        }
      }
      else
      {
        throw new ReferenceError();
      }
      
      func = resolveFunction(o[1], references);
      if(0 === o[0].indexOf(KEY_NEW))
      {
        context = Object.create(func.prototype);
      }
    }
    
    if(depend !== null || func !== null)
    {
      return {path: path, depend: depend, func: func, context: context};
    }
    
    return null;
  };
  
  var resolveDependenciesOrder = function(dependencies)
  {
    var resolveArray = [];
    
    var pathArray = dependencies.paths;
    var dependenciesArray = Array.from(dependencies.calcs);
    
    var hasDependancySingle = function(dependancy)
    {
      var index = pathArray.indexOf(dependancy);
      
//      return (index === -1 ? false : (dependenciesArray[index] !== null));
      if(index === -1)
      {
        throw new ReferenceError();
//        return false;
      }
      
      var dependent = false;
      while(pathArray[index] && (0 === pathArray[index].indexOf(dependancy)))
      {
        if(dependenciesArray[index] !== null)
        {
          dependent = true;
        }
        index++;
      }
      
      return dependent;
    };
    
    var hasDependancy = function(dependancy)
    {
      if(dependancy === null)
      {
        return false;
      }
      else if(typeof dependancy === "string")
      {
        return hasDependancySingle(dependancy);
      }
      if(isArray(dependancy))
      {
        var dependent = false;
        for(var i = 0; i < dependancy.length; i++)
        {
          if(hasDependancySingle(dependancy[i]))
          {
            dependent = true;
          }
        }
        
        return dependent;
      }
      
      return false;
    };
    
    var complete = false;
    var processEval = false;
    var prevCount = dependenciesArray.length;
    while(complete === false)
    {
      complete = true;
      var count = 0;
      for(var i = 0; i < dependenciesArray.length; i++)
      {
        var obj = dependenciesArray[i];
        if(!obj)
        {
          continue;
        }
        
        complete = false;
        count++;
        
        if(!hasDependancy(obj.depend) && (obj.func !== eval || processEval === true))
        {
          resolveArray.push(obj);
          dependenciesArray[i] = null;
        }
      }
      
      if(!(count < prevCount))
      {
        if(processEval === false)
        {
          processEval = true;
          count = dependenciesArray.length;
        }
        else
        {
          throw new ReferenceError("circular reference");
        }
      }
      
      prevCount = count;
    }
    
    return resolveArray;
  };
  
  var resolveDependencies = function(resolveArray)
  {
    for(var i = 0; i < resolveArray.length; i++)
    {
      var obj = resolveArray[i];
      
      var path = obj.path;
      var depend = obj.depend;
      var func = obj.func;
      var context = obj.context;
      
      if(func === null)
      {
        eval("object" + path + " = object" + depend + ";");
      }
      else
      {
        var arg;
        if(func === eval)
        {
          eval("var " + LOCAL_OBJECT_REFERENCE + " = object; arg = object" + path + ";");
          arg = arg.substring(PREFIX_EVAL.length);
          eval("object" + path + " = " + arg + ";");
        }
        else
        {
          eval("arg = object" + path + ";");
          if(typeof arg === "object" && arg !== null && arg.constructor.name === "Array" && 1 < arg.length)
          {
            if(arg.length === 3 && typeof arg[2] === "object" && arg[2] !== null && arg[2].constructor.name === "Array")
            {
              arg = arg[2];
            }
            else
            {
              arg.splice(0, 2);
            }
          }
          var res;
          try
          {
            res = func.apply(context, arg);
          }
          catch(error)
          {
            try
            {
              res = func.apply(context || "", arg);
            }
            catch(error1)
            {
              try
              {
                res = func.apply(context || {}, arg);
              }
              catch(error2)
              {
                throw error;
              }
            }
          }
          eval("object" + path + " = res;");
        }
      }
    }
  };
  
  traverse(object, traverse_callback_resolve_external_dependencies);
  var dependencies = traverse(object, traverse_callback_find_dependencies);
  var resolveArray = resolveDependenciesOrder(dependencies);
  resolveDependencies(resolveArray);
  
  return object;
}
this.resolve = resolve;

return this;

}.call(json));

var sys = {};
sys.environment = util.environment();

if(sys.environment === "electron" || sys.environment === "nodejs")
{
  sys.nodejs = {};
  sys.nodejs.assert = require("assert");
  sys.nodejs.buffer = require("buffer");
  sys.nodejs.child_process = require("child_process");
  sys.nodejs.cluster = require("cluster");
  sys.nodejs.crypto = require("crypto");
  sys.nodejs.dgram = require("dgram");
  sys.nodejs.dns = require("dns");
  sys.nodejs.events = require("events");
  sys.nodejs.fs = require("fs");
  sys.nodejs.http = require("http");
  sys.nodejs.https = require("https");
  sys.nodejs.net = require("net");
  sys.nodejs.os = require("os");
  sys.nodejs.path = require("path");
  sys.nodejs.querystring = require("querystring");
  sys.nodejs.readline = require("readline");
  sys.nodejs.stream = require("stream");
  sys.nodejs.string_decoder = require("string_decoder");
  sys.nodejs.timers = require("timers");
  sys.nodejs.tls = require("tls");
  sys.nodejs.tty = require("tty");
  sys.nodejs.url = require("url");
  sys.nodejs.util = require("util");
  sys.nodejs.v8 = require("v8");
  sys.nodejs.vm = require("vm");
  sys.nodejs.zlib = require("zlib");
}

if(sys.environment === "electron")
{
  sys.electron = require("electron");
}
this.sys = sys;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

// todo find an elegant way to reset prototypes link after direct override -> not possible easily 
// (class should be recompiled on a specific method or keep a stack of changes on a method)
// (NB stack only for prototypes, for object is not needed because is handled by javascript)
function Class(target)
{
  if(this instanceof Class)
  {
    throw new SyntaxError();
  }
  
  var c = target;
  if(typeof c === "undefined")
  {
    c = function(){return c.Class.construct(this, arguments);};
  }
  
  if(typeof c === "function")
  {
    if(c.Class instanceof Class)
    {
      return c.Class;
    }
    else
    {
      var instance = Object.create(Class.prototype);
      
      instance._target = c;
      instance._inherit = [];
      instance._instance = undefined;
      
      instance._invoke = {_new: true, _call: true, _singleton: false, _static: false, _safe: true};
//      instance.instance(true, true, false, false);
      instance._compose = {};
      
      c.Class = instance;
      c.prototype._class = instance;
      
      return instance;
    }
  }
  
  throw new ReferenceError();
}

//------------------------------------------------------------------------------
// Functions -------------------------------------------------------------------
//------------------------------------------------------------------------------

Class._constructTTFF = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    context._new = true;
    return this._construct(context, args, args_inherit);
  }
  else
  {
    return this._stateless(this._target, args, args_inherit);
  }
};

Class._constructTTFT = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    context._new = true;
    return this._construct(context, args, args_inherit);
  }
  else
  {
    if(this._instance instanceof this._target)
    {
      return this._instance;
    }
    else if(typeof this._instance === "undefined")
    {
      this._instance = Object.create(this._target.prototype);
      this._instance._new = false;
      if(this._invoke._safe === false)
      {
        this.construct = Class._constructTTFT_inst;
      }
      return this._construct(this._instance, args, args_inherit);
    }
    else
    {
      throw new ReferenceError();
    }
  }
};

Class._constructTTFT_inst = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    context._new = true;
    return this._construct(context, args, args_inherit);
  }
  else
  {
    return this._instance;
  }
};

Class._constructTTTF = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    if(this._instance instanceof this._target)
    {
      return this._instance;
    }
    else if(typeof this._instance === "undefined")
    {
      this._instance = Object.create(this._target.prototype);
      this._instance._new = true;
      if(this._invoke._safe === false)
      {
        this.construct = Class._constructTTTF_inst;
      }
      return this._construct(this._instance, args, args_inherit);
    }
    else
    {
      throw new ReferenceError();
    }
  }
  else
  {
    return this._stateless(this._target, args, args_inherit);
  }
};

Class._constructTTTF_inst = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    return this._instance;
  }
  else
  {
    return this._stateless(this._target, args, args_inherit);
  }
};

Class._constructTTTT = function(context, args, args_inherit)
{
  if(this._instance instanceof this._target)
  {
    return this._instance;
  }
  else if(typeof this._instance === "undefined")
  {
    this._instance = Object.create(this._target.prototype);
    this._instance._new = true;
    if(this._invoke._safe === false)
    {
      this.construct = Class._constructTTTT_inst;
    }
    return this._construct(this._instance, args, args_inherit);
  }
  else
  {
    throw new ReferenceError();
  }
};

Class._constructTTTT_inst = function()
{
  return this._instance;
};

Class._constructTFFA = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    context._new = true;
    return this._construct(context, args, args_inherit);
  }
  else
  {
    throw new SyntaxError();
  }
};

Class._constructTFTA = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    if(this._instance instanceof this._target)
    {
      return this._instance;
    }
    else if(typeof this._instance === "undefined")
    {
      this._instance = Object.create(this._target.prototype);
      this._instance._new = true;
      if(this._invoke._safe === false)
      {
        this.construct = Class._constructTFTA_inst;
      }
      return this._construct(this._instance, args, args_inherit);
    }
    else
    {
      throw new ReferenceError();
    }
  }
  else
  {
    throw new SyntaxError();
  }
};

Class._constructTFTA_inst = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    return this._instance;
  }
  else
  {
    throw new SyntaxError();
  }
};

Class._constructFTAF = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    throw new SyntaxError();
  }
  else
  {
    return this._stateless(this._target, args, args_inherit);
  }
};

Class._constructFTAT = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    throw new SyntaxError();
  }
  else
  {
    if(this._instance instanceof this._target)
    {
      return this._instance;
    }
    else if(typeof this._instance === "undefined")
    {
      this._instance = Object.create(this._target.prototype);
      this._instance._new = false;
      if(this._invoke._safe === false)
      {
        this.construct = Class._constructFTAT_inst;
      }
      return this._construct(this._instance, args, args_inherit);
    }
    else
    {
      throw new ReferenceError();
    }
  }
};

Class._constructFTAT_inst = function(context, args, args_inherit)
{
  if(context instanceof this._target || (typeof context !== "undefined" && context._instanceof === this._target))
  {
    throw new SyntaxError();
  }
  else
  {
    return this._instance;
  }
};

Class._constructFFAA = function()
{
  throw new Error();
};

//------------------------------------------------------------------------------

Class._link = function(source, target, property)
{
  var getter = function(prototypeSource, name)
  {
    return function()
    {
      return prototypeSource[name];
    };
  }(source, property);
  
  var setter = function(prototypeTarget, name)
  {
    return function(value)
    {
      if(this === prototypeTarget)
      {
        delete prototypeTarget[name];
      }
      Object.defineProperty(this, name, {configurable: true, enumerable: true, writable: true, value: value});
    };
  }(target, property);
  
  Object.defineProperty(target, property, {configurable: true, enumerable: true, get: getter, set: setter});
};

//------------------------------------------------------------------------------

Class._copyCallback = function(value)
{
  return function()
  {
    // todo replace with: return util.merge(undefined, value);
    var res = Array.isArray(value) ? [] : {};
    if(Array.isArray(value))
    {
      for(var i = 0; i < value.length; i++)
      {
        res.push(value[i]);
      }
    }
    else
    {
      for(var k in value)
      {
        res[k] = value[k];
      }
    }
    
    return res;
  };
};

//------------------------------------------------------------------------------

Class.getter = function(target, name, callback)
{
  Class.property(target, name, {getter: callback});
  
  return Class;
};

Class.setter = function(target, name, callback)
{
  Class.property(target, name, {setter: callback});
  
  return Class;
};

Class.listener = function(target, name, callback)
{
  Class.property(target, name, {listener: callback});
  
  return Class;
};

Class.property = function(target, name, properties)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  var object = target;
  if(typeof target === "function")
  {
    object = target.prototype;
  }
  else if(typeof target !== "object")
  {
    throw new TypeError();
  }
  
  var propertyFunction = object[name];
  if(typeof propertyFunction !== "function")
  {
    propertyFunction = function(){};
  }
  var getter = propertyFunction.getter;
  var setter = propertyFunction.setter;
  var listener = propertyFunction.listener;
  var internalName = "_property_" + name;
  if(typeof properties === "object")
  {
    if(properties.hasOwnProperty("value"))
    {
      object[internalName] = properties.value;
    }
    
    if(properties.hasOwnProperty("getter"))
    {
      getter = properties.getter;
    }
    
    if(properties.hasOwnProperty("setter"))
    {
      setter = properties.setter;
    }
    
    if(properties.hasOwnProperty("listener"))
    {
      listener = properties.listener;
    }
  }
  
  var constructName = "_property" + (typeof getter === "function" ? "T" : "F") + (typeof setter === "function" ? "T" : "F") + (typeof listener === "function" ? "T" : "F");
  propertyFunction = Class[constructName](name, internalName);
  propertyFunction.property = true;
  propertyFunction.getter = getter;
  propertyFunction.setter = setter;
  propertyFunction.listener = listener;
  
  object[name] = propertyFunction;
  
  return Class;
};

Class._propertyFFF = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[internalName];
    }
    else
    {
      this[internalName] = value;

      return this;
    }
  };
};

Class._propertyFFT = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[internalName];
    }
    else
    {
      var prev = this[name]();

      this[internalName] = value;
      this[name].listener.call(this, value, prev, arguments);

      return this;
    }
  };
};

Class._propertyFTF = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[internalName];
    }
    else
    {
      this[internalName] = this[name].setter.apply(this, arguments);

      return this;
    }
  };
};

Class._propertyFTT = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[internalName];
    }
    else
    {
      var prev = this[name]();

      this[internalName] = this[name].setter.apply(this, arguments);
      this[name].listener.call(this, value, prev, arguments);

      return this;
    }
  };
};

Class._propertyTFF = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[name].getter.call(this, this[internalName]);
    }
    else
    {
      this[internalName] = value;

      return this;
    }
  };
};

Class._propertyTFT = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[name].getter.call(this, this[internalName]);
    }
    else
    {
      var prev = this[name]();

      this[internalName] = value;
      this[name].listener.call(this, value, prev, arguments);

      return this;
    }
  };
};

Class._propertyTTF = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[name].getter.call(this, this[internalName]);
    }
    else
    {
      this[internalName] = this[name].setter.apply(this, arguments);

      return this;
    }
  };
};

Class._propertyTTT = function(name, internalName)
{
  return function(value)
  {
    if(arguments.length === 0)
    {
      return this[name].getter.call(this, this[internalName]);
    }
    else
    {
      var prev = this[name]();

      this[internalName] = this[name].setter.apply(this, arguments);
      this[name].listener.call(this, value, prev, arguments);

      return this;
    }
  };
};

Class.properties = function(target)
{
  var object = target;
  if(typeof target === "function")
  {
    object = target.prototype;
  }
  else if(typeof target !== "object")
  {
    throw new TypeError();
  }
  
  object.properties = Class._properties;
  
  return Class;
};

Class._properties = function(properties)
{
  if(arguments.length === 0)
  {
    // todo get a copy of all properties
    return this;
  }
  else
  {
    for(var k in properties)
    {
      if(typeof this[k] === "function" && this[k].property === true)
      {
        this[k](properties[k]);
      }
      else
      {
        this[k] = properties[k];
      }
    }

    return this;
  }
};

Class._properties.property = true;

Class.propertyValidatorBoolean = function(value)
{
  if(typeof value === "boolean")
  {
    return value;
  }
  else
  {
    throw new TypeError();
  }
};

Class.propertyValidatorString = function(value)
{
  if(typeof value === "string")
  {
    return value;
  }
  else
  {
    throw new TypeError();
  }
};

Class.propertyValidatorObject = function(value)
{
  if(typeof value === "undefined")
  {
    return {};
  }
  else if(typeof value === "object")
  {
    return value;
  }
  else
  {
    throw new TypeError();
  }
};

Class.propertyValidatorFunction = function(value)
{
  if(typeof value === "function" || typeof value === "undefined" || value === null)
  {
    return value;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Class.method = function(target, name, method)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  var object = target;
  if(typeof target === "function")
  {
    object = target.prototype;
  }
  else if(typeof target !== "object")
  {
    throw new TypeError();
  }
  
  if(arguments.length === 2)
  {
    delete object[name];
  }
  else
  {
    object[name] = method;
  }
  
  return Class;
};

//------------------------------------------------------------------------------

Class.trigger = function(target, name, callback, before)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  var object = target;
  if(typeof target === "function")
  {
    object = target.prototype;
  }
  else if(typeof target !== "object")
  {
    throw new TypeError();
  }
  
  if(arguments.length === 2)
  {
    // todo define proper action
  }
  else if(typeof callback !== "function")
  {
    throw new TypeError();
  }
  else
  {
//    if(!object.hasOwnProperty(name) || typeof object[name] !== "function")
//    {
//      throw new ReferenceError();
//    }
    
    if(typeof object[name] !== "function")
    {
console.log("!=function", name, object, object[name]);
      throw new ReferenceError();
    }
    
    if(!object.hasOwnProperty(name))
    {
console.log("not own", name, object, object[name]);
      var inherited = object[name];
      object[name] = function(){inherited.apply(this, arguments);};
    }
    
    if(object[name].trigger !== true)
    {
      var original = object[name];
      object[name] = Class._triggerBA(name);
      object[name].trigger = true;
      object[name].original = original;
      object[name].before = [];
      object[name].after = [];
    }
    
    if(before === true)
    {
      object[name].before.push(callback);
    }
    else
    {
      object[name].after.push(callback);
    }
  }
  
  return Class;
};

Class._triggerB = function(name)
{
  return function()
  {
    var triggers = this[name].before;
    for(var i = 0; i < triggers.length; i++)
    {
      triggers[i].apply(this, arguments);
    }
    
    return this[name].original.apply(this, arguments);
  };
};

Class._triggerA = function(name)
{
  return function()
  {
    var res = this[name].original.apply(this, arguments);
    
    var triggers = this[name].after;
    for(var i = 0; i < triggers.length; i++)
    {
      triggers[i].apply(this, arguments);
    }
    
    return res;
  };
};

Class._triggerBA = function(name)
{
  return function()
  {
    var triggers = undefined;
    
    triggers = this[name].before;
    for(var i = 0; i < triggers.length; i++)
    {
      triggers[i].apply(this, arguments);
    }
    
    var res = this[name].original.apply(this, arguments);
    
    triggers = this[name].after;
    for(var i = 0; i < triggers.length; i++)
    {
      triggers[i].apply(this, arguments);
    }
    
    return res;
  };
};

Class.untrigger = function(target, name, callback)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  var object = target;
  if(typeof target === "function")
  {
    object = target.prototype;
  }
  else if(typeof target !== "object")
  {
    throw new TypeError();
  }
  
  if(!object.hasOwnProperty(name) || typeof object[name] !== "function" || object[name].trigger !== true)
  {
    throw new ReferenceError();
  }
  
  if(arguments.length === 2)
  {
    object[name] = object[name].original;
  }
  else if(typeof callback !== "function")
  {
    throw new TypeError();
  }
  else
  {
    var index = -1;
    
    index = object[name].before.indexOf(callback);
    if(index !== -1)
    {
      object[name].before.splice(index, 1);
    }
    
    index = object[name].after.indexOf(callback);
    if(index !== -1)
    {
      object[name].after.splice(index, 1);
    }
    
    if(object[name].before.length === 0 && object[name].after.length === 0)
    {
      object[name] = object[name].original;
    }
  }
  
  return Class;
};

//------------------------------------------------------------------------------

Class.event = function()
{
  event.Event.apply(undefined, arguments);
  
  return Class;
};

//------------------------------------------------------------------------------

Class.functionEmpty = function()
{
};

Class.functionThrowing = function()
{
  throw new Error();
};

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Class.prototype.construct = Class._constructTTFF;

//------------------------------------------------------------------------------

Class.prototype._construct = function(context, args, args_inherit)
{
//console.log(this._target.prototype.constructor.name, args, args_inherit, args_inherit ? args_inherit.length : null, this._inherit, this._inherit.length);
  args_inherit = args_inherit || [];
  for(var i = 0; i < this._inherit.length; i++)
  {
    context._instanceof = this._inherit[i];
//console.log("constructor chain", this._target.name, this._inherit[i].name);
    this._inherit[i].apply(context, args_inherit[i]);
  }
  delete context._instanceof;
  
  for(var k in this._compose)
  {
//    context[k] = this._compose[k](args);
    context[k] = this._compose[k].apply(context);
  }
  
//console.log(this._target.prototype.constructor.name, "_________________________________own constructor", args, args_inherit, args_inherit ? args_inherit.length : null, this._inherit, this._inherit.length);
  if(this._target.prototype.hasOwnProperty("construct") && typeof this._target.prototype.construct === "function")
  {
    var res = this._target.prototype.construct.apply(context, args);
    if(typeof res !== "undefined")
    {
      return res;
    }
  }
  
  return context;
};

//------------------------------------------------------------------------------

Class.prototype._stateless = function(context, args, args_inherit)
{
//  args_inherit = args_inherit || [];
//  for(var i = 0; i < this._inherit.length; i++)
//  {
//    this._inherit[i].apply(context, args_inherit[i]);
//  }
//  
//  for(var k in this._compose)
//  {
////    context[k] = this._compose[k](args);
//    context[k] = this._compose[k].apply(context);
//  }
  
  if(this._target.prototype.hasOwnProperty("stateless") && typeof this._target.prototype.stateless === "function")
  {
    return this._target.prototype.stateless.apply(context, args);
  }
};

//------------------------------------------------------------------------------

Class.prototype.inherit = function(base, dynamic, link)
{
//console.log("inherit", this._target.prototype.constructor.name, base.prototype.constructor.name, this._inherit);
  
  var _target = this._target;
  
  var constructor = _target.prototype.constructor;
  var _class = _target.prototype._class;
  
  var construct = _target.prototype.construct;
  
  if(arguments.length === 0)
  {
    this._inherit = [];
    this._target.prototype = Object.create(Object.prototype);
  }
  else if(typeof base !== "function")
  {
    throw new TypeError();
  }
  else
  {
// better dynamic inheritance also for first
    if(this._inherit.length___ === 0)
    {
      var prototype = _target.prototype;
      _target.prototype = Object.create(base.prototype);
      for(var k in prototype)
      {
        if(!(k in _target.prototype))
        {
          _target.prototype[k] = prototype[k];
        }
      }
    }
    else
    {
      var prototype = base.prototype;
      
      if(dynamic === false)
      {
        for(var k in prototype)
        {
          _target.prototype[k] = prototype[k];
        }
      }
      else
      {
        for(var k in prototype)
        {
//console.log("inherit method by link", this._target.prototype.constructor.name, base.prototype.constructor.name, this._inherit, k);
          Class._link(prototype, _target.prototype, k);
        }
      }
      
      if(Array.isArray(link))
      {
        for(var i = 0; i < link.length; i++)
        {
          if(typeof link[i] !== "string")
          {
            throw new TypeError();
          }

          Class._link(prototype, _target.prototype, link[i]);
        }
      }
    }
    
    if(base.Class instanceof Class)
    {
      var invoke = base.Class._invoke;
      this.instance(invoke._new, invoke._call, invoke._singleton, invoke._static, invoke._safe);
      
      var compose = base.Class._compose;
      var eventTarget = this._compose.event;
      var eventBase = compose.event;
      for(var k in compose)
      {
        this._compose[k] = compose[k];
      }
      
      if(typeof eventTarget === "function")
      {
        this._compose.event = function(){eventBase.apply(this); eventTarget.apply(this); return this.event;};
      }
      else
      {
        delete this._compose.event;
      }
    }
    
    this._inherit.push(base);
  }
  
  _target.prototype.constructor = constructor;
  _target.prototype._class = _class;
  
  _target.prototype.construct = construct;
  
//console.log("inherit", this._target.prototype.constructor.name, base.prototype.constructor.name, JSON.stringify(Object.getOwnPropertyNames(_target.prototype)), JSON.stringify(Object.keys(_target.prototype)));
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.inherited = function(base)
{
  return this._inherit.indexOf(base) !== -1;
//  for(var i = 0; i < this._inherit.length; i++)
//  {
//    if(this._inherit[i] === base)
//    {
//      return true;
//    }
//  }
//  
//  return false;
};

//------------------------------------------------------------------------------

Class.prototype.instance = function(invokeNew, invokeFunction, singletonNew, singletonFunction, singletonSafe)
{
  var n = undefined;
  var f = undefined;
  var ns = undefined;
  var fs = undefined;
  var ss = undefined;
  
  if(typeof invokeNew === "undefined")
  {
    n = true;
  }
  else if(typeof invokeNew === "boolean")
  {
    n = invokeNew;
  }
  else
  {
    throw new TypeError();
  }
  
  if(typeof invokeFunction === "undefined")
  {
    f = true;
  }
  else if(typeof invokeFunction === "boolean")
  {
    f = invokeFunction;
  }
  else
  {
    throw new TypeError();
  }
  
  if(typeof singletonNew === "undefined")
  {
    ns = false;
  }
  else if(typeof singletonNew === "boolean")
  {
    ns = singletonNew;
  }
  else
  {
    throw new TypeError();
  }
  
  if(typeof singletonFunction === "undefined")
  {
    fs = false;
  }
  else if(typeof singletonFunction === "boolean")
  {
    fs = singletonFunction;
  }
  else
  {
    throw new TypeError();
  }
  
  if(typeof singletonSafe === "undefined")
  {
    ss = true;
  }
  else if(typeof singletonSafe === "boolean")
  {
    ss = singletonSafe;
  }
  else
  {
    throw new TypeError();
  }
  
  this._invoke._new = n;
  this._invoke._call = f;
  this._invoke._singleton = ns;
  this._invoke._static = fs;
  this._invoke._safe = ss;
  
  var constructName = "_construct" + (n ? "T" : "F") + (f ? "T" : "F") + (n ? (ns ? "T" : "F") : "A") + (f ? (fs ? "T" : "F") : "A");
  delete this._instance;
  this.construct = Class[constructName];
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.compose = function(name, value)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  if(arguments.length === 1)
  {
    delete this._target.prototype[name];
  }
  else if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || typeof value === "function" || value === null)
  {
    this._target.prototype[name] = value;
  }
  else if(typeof value === "object")
  {
    this._compose[name] = Class._copyCallback(value);
  }
  else
  {
    throw new TypeError();
  }
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.shared = function(name, value)
{
  if(typeof name !== "string")
  {
    throw new TypeError();
  }
  
  this._target.prototype._shared = this._target.prototype._shared || {};
  if(1 < arguments.length)
  {
    this._target.prototype._shared[name] = value;
  }
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.getter = function(property, callback)
{
  Class.property(this._target, property, {getter: callback});
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.setter = function(property, callback)
{
  Class.property(this._target, property, {setter: callback});
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.listener = function(property, callback)
{
  Class.property(this._target, property, {listener: callback});
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.property = function(property, value, getter, setter, listener)
{
  var params = {};
  
  if(typeof getter === "function" || getter === null)
  {
    params.getter = getter;
  }
  else if(typeof getter !== "undefined")
  {
    throw new TypeError();
  }
  
  if(typeof setter === "function" || setter === null)
  {
    params.setter = setter;
  }
  else if(typeof setter !== "undefined")
  {
    throw new TypeError();
  }
  
  if(typeof listener === "function" || listener === null)
  {
    params.listener = listener;
  }
  else if(typeof listener !== "undefined")
  {
    throw new TypeError();
  }
  
  Class.property(this._target, property, params);
  if(arguments.length !== 1)
  {
    this.compose("_property_" + property, value);
  }
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.properties = function()
{
  Class.properties(this._target);
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.method = function(name, method)
{
  Class.method(this._target, name, method);
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.trigger = function(name, callback, before)
{
  Class.trigger(this._target, name, callback, before);
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.untrigger = function(name, callback)
{
  Class.untrigger(this._target, name, callback);
  
  return this;
};

//------------------------------------------------------------------------------

//Class.prototype.event = function(event, classEventCallback)
//{
//  if(typeof event !== "string")
//  {
//    throw new TypeError();
//  }
//  
//  var _class = this;
//  var eventMethodName = "event" + this._target.name + event;
//  
//  if(typeof this._target.prototype[eventMethodName] === "undefined")
//  {
//    this._target.prototype[eventMethodName] = function(){};
//  }
//  
//  if(typeof classEventCallback !== "undefined")
//  {
//    if(typeof classEventCallback !== "function")
//    {
//      throw new TypeError();
//    }
//    
//    this._target.prototype[eventMethodName] = classEventCallback;
//  }
//  this._target.prototype[eventMethodName + "Register"] = function(callback, before){_class.trigger(eventMethodName, callback, before);};
//  this._target.prototype[eventMethodName + "Unregister"] = function(callback){_class.untrigger(eventMethodName, callback);};
//  
//  return this;
//};

//------------------------------------------------------------------------------

Class.prototype.event = function(event, classEventCallback)
{
  if(typeof event !== "string")
  {
    throw new TypeError();
  }
  
  var _class = this;
//  var eventMethodName = "event" + this._target.name + event;
//  var eventMethodName = "_event" + event;
  var eventMethodName = "event" + event;
  
//console.log(eventMethodName, this._target.prototype[eventMethodName]);
  if(typeof this._target.prototype[eventMethodName] === "undefined")
  {
    this._target.prototype[eventMethodName] = function(){};
  }
  
  if(typeof classEventCallback !== "undefined")
  {
    if(typeof classEventCallback !== "function")
    {
      throw new TypeError();
    }
    
    this._target.prototype[eventMethodName] = classEventCallback;
  }
  
  // todo: reg/unreg for any event -> first check for existence, if not create methods eventRegister/eventUnregister(eventName, callback)
  // NB also eventNotify to completely hide implementation that only calls the event function that now will have a "_" prefix as internal
//  this._target.prototype[eventMethodName + "Register"] = function(callback, before){_class.trigger(eventMethodName, callback, before);};
//  this._target.prototype[eventMethodName + "Unregister"] = function(callback){_class.untrigger(eventMethodName, callback);};
  
//  this._target.prototype.eventNotify = function(eventName, args){this["_event" + eventName].apply(this, args);};
//  this._target.prototype.eventRegister = function(eventName, callback, before){_class.trigger("_event" + eventName, callback, before);};
//  this._target.prototype.eventUnregister = function(eventName, callback){_class.untrigger("_event" + eventName, callback);};
  
//  this._target.prototype.eventNotify = function(eventName, args){console.log(this); this["event" + eventName].apply(this, args);};
  this._target.prototype.eventNotify = function(eventName, args){this["event" + eventName].apply(this, args);};
//  this._target.prototype.eventNotify = function(eventName, args){this._class._target.prototype["event" + eventName].apply(this, args);};
//  this._target.prototype.eventRegister = function(eventName, callback, before){_class.trigger("event" + eventName, callback, before);};
//  this._target.prototype.eventUnregister = function(eventName, callback){_class.untrigger("event" + eventName, callback);};
  this._target.prototype.eventRegister = function(eventName, callback, before){Class.trigger(this, "event" + eventName, callback, before);};
  this._target.prototype.eventUnregister = function(eventName, callback){Class.untrigger(this, "event" + eventName, callback);};
  
  return this;
};

//------------------------------------------------------------------------------

//Class.prototype.event = function(event, global)
//{
//  if(arguments.length === 0)
//  {
//    delete this._compose.event;
//    delete this._target.event;
//  }
//  else if(arguments.length === 1 && typeof event === "boolean")
//  {
//    if(event)
//    {
//      delete this._target.event;
//    }
//    else
//    {
//      delete this._compose.event;
//    }
//  }
//  else if(global === true)
//  {
//    Class.event(this._target, event, undefined, undefined, true);
//  }
//  else
//  {
//    var prev = this._compose.event;
////    if(typeof prev === "function")
////    {
////      this._compose.event = function(){prev.apply(this); Class.event(this, event); return this.event;};
////    }
////    else
////    {
////      this._compose.event = function(){Class.event(this, event); return this.event;};
////    }
//    if(typeof prev === "function")
//    {
//      this._compose.event = function(){prev.apply(this); Class.event(this, event, undefined, undefined, true); return this.event;};
//    }
//    else
//    {
//      this._compose.event = function(){Class.event(this, event, undefined, undefined, true); return this.event;};
//    }
//  }
//  
//  return this;
//};

//------------------------------------------------------------------------------

Class.prototype.get = function()
{
  return this._target;
};

//------------------------------------------------------------------------------

Class.prototype.bind = function(registerProperty, valueProperty)
{
  this.shared("_bind_" + registerProperty, {});
  
  this.listener(registerProperty, function(value, prev)
  {
    var registers = this._shared["_bind_" + registerProperty];
    var oldRegister = registers[prev] || [];
    var newRegister = registers[value] || [];
    registers[value] = newRegister;
    
    newRegister.push(this);
    var index = oldRegister.indexOf(this);
    if(-1 < index)
    {
      oldRegister.splice(index, 1);
    }
    
    console.log("bind to new value", newRegister, oldRegister);
  });
  
  this.listener(valueProperty, function(value, prev)
  {
    var internalName = "_property_" + registerProperty;
    
    var listeners = this._shared["_bind_" + registerProperty][this[registerProperty]()];
console.log("bind property", valueProperty, "broadcasting value", value, "key", this[registerProperty](), "listeners", listeners);
    if(typeof listeners !== "undefined")
    {
      for(var i = 0; i < listeners.length; i++)
      {
        var l = listeners[i];
        var f = l[valueProperty];
        if(typeof f === "function")
        {
//          f(value);
          if(typeof f.setter !== "function")
          {
            l[internalName] = value;
          }
          else
          {
            l[internalName] = f.setter.apply(l, arguments);
          }
        }
        else
        {
          console.error("bind: no value property");
        }
      }
    }
  });
  
  return this;
};

//------------------------------------------------------------------------------

//Class.prototype.bindable = function()
//{
//  for(var i = 0; i < arguments.length; i++)
//  {
//    
//  }
//  
//  Class.method(this._target, "bind", function(obj, property)
//  {
//    
//  });
//  
//  return this;
//};

//------------------------------------------------------------------------------

Class.prototype.inheritMethodsAs = function(base, methods, renamedMethods, dynamic)
{
  var _target = this._target;
  
  var constructor = _target.prototype.constructor;
  var _class = _target.prototype._class;
  
  if(typeof base !== "function")
  {
    throw new TypeError();
  }
  
  var prototype = base.prototype;
  
  if(typeof methods === "string" && typeof renamedMethods === "string")
  {
    if(dynamic === false)
    {
      _target.prototype[methods] = prototype[renamedMethods];
    }
    else
    {
      Class._linkAs(prototype, _target.prototype, methods, renamedMethods);
    }
  }
  else if(Array.isArray(methods) && Array.isArray(renamedMethods))
  {
    if(dynamic === false)
    {
      for(var i = 0; i < methods.length; i++)
      {
        if(typeof methods[i] !== "string" || typeof renamedMethods[i] !== "string")
        {
          throw new TypeError();
        }
        
        _target.prototype[methods[i]] = prototype[renamedMethods[i]];
      }
    }
    else
    {
      for(var i = 0; i < methods.length; i++)
      {
        if(typeof methods[i] !== "string" || typeof renamedMethods[i] !== "string")
        {
          throw new TypeError();
        }
        
        Class._linkAs(prototype, _target.prototype, methods[i], renamedMethods[i]);
      }
    }
  }
  else
  {
    throw new TypeError();
  }
  
  if(base.Class instanceof Class)
  {
    var invoke = base.Class._invoke;
    this.instance(invoke._new, invoke._call, invoke._singleton, invoke._static, invoke._safe);
    
    var compose = base.Class._compose;
    var eventTarget = this._compose.event;
    var eventBase = compose.event;
    for(var k in compose)
    {
      this._compose[k] = compose[k];
    }
    
    if(typeof eventTarget === "function")
    {
      this._compose.event = function(){eventBase.apply(this); eventTarget.apply(this); return this.event;};
    }
    else
    {
      delete this._compose.event;
    }
  }

  this._inherit.push(base);
  
  _target.prototype.constructor = constructor;
  _target.prototype._class = _class;
  
  return this;
};

//------------------------------------------------------------------------------

Class._linkAs = function(source, target, property, renamedProperty)
{
  var getter = function(prototypeSource, name)
  {
    return function()
    {
      return prototypeSource[name];
    };
  }(source, property);
  
  var setter = function(prototypeTarget, name)
  {
    return function(value)
    {
      if(this === prototypeTarget)
      {
        delete prototypeTarget[name];
      }
      Object.defineProperty(this, name, {configurable: true, enumerable: true, writable: true, value: value});
    };
  }(target, property);
  
  Object.defineProperty(target, renamedProperty, {configurable: true, enumerable: true, get: getter, set: setter});
};

//------------------------------------------------------------------------------
this.Class = Class;

var log = log  || {};

this.log = log;

log = (function ()
{

for(var $_sub_module_iterator in log){eval("var " + $_sub_module_iterator + " = log[$_sub_module_iterator];");}
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Log()
{
  return Log.Class.construct(this);
}

Class(Log)
.instance(true, true, false, true, true)
.property("level", 3)
.properties()
.compose("_loggers", [])
;

//------------------------------------------------------------------------------
// Enums -----------------------------------------------------------------------
//------------------------------------------------------------------------------

Log.level = Object.freeze(
{
  OFF: 0,
  FATAL: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  DEBUG: 5,
  TRACE: 6,
  ALL: 9
});

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Log.prototype.log = function(level, levelString, data)
{
  if(level <= this.level())
  {
    var now = new Date();
    
    var timestamp = now.getTime();
    var date = now.toISOString().split("T")[0];
    var time = now.toTimeString().split(" ")[0];
    // todo integrate with build time filename and line
    var caller = (new Error()).stack.split('\n')[3].split(' ')[5];
    
    for(var i = 0; i < this._loggers.length; i++)
    {
      this._loggers[i].log(timestamp, date, time, level, levelString, caller, data);
    }
    
    if(data[0] instanceof Error)
    {
      throw data[0];
    }
  }
};

//------------------------------------------------------------------------------

Log.prototype.add = function(logger)
{
  // todo replace onstanceof with similar but for multiple dynamic inheritance
//  if(!(logger instanceof Logger))
//  {
//    throw new TypeError();
//  }
  
  this._loggers.push(logger);
  
  return this;
};

//------------------------------------------------------------------------------

Log.prototype.remove = function(logger)
{
  if(typeof logger === "number")
  {
    this._loggers.splice(logger, 1);
  }
  else if(logger instanceof Logger)
  {
    var index = this._loggers.indexOf(logger);
    if(index === -1)
    {
      throw new ReferenceError();
    }
    this._loggers.splice(index, 1);
  }
  else
  {
    throw new TypeError();
  }
  
  return this;
};

//------------------------------------------------------------------------------

Log.prototype.fatal = function()
{
  this.log(Log.level.FATAL, "FATAL", arguments);
};

//------------------------------------------------------------------------------

Log.prototype.error = function()
{
  this.log(Log.level.ERROR, "ERROR", arguments);
};

//------------------------------------------------------------------------------

Log.prototype.warn = function()
{
  this.log(Log.level.WARN, "WARN", arguments);
};

//------------------------------------------------------------------------------

Log.prototype.info = function()
{
  this.log(Log.level.INFO, "INFO", arguments);
};

//------------------------------------------------------------------------------

Log.prototype.debug = function()
{
  this.log(Log.level.DEBUG, "DEBUG", arguments);
};

//------------------------------------------------------------------------------

Log.prototype.trace = function()
{
  this.log(Log.level.TRACE, "TRACE", arguments);
};

//------------------------------------------------------------------------------
this.Log = Log;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Logger()
{
}

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Logger.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
{
};

//------------------------------------------------------------------------------
this.Logger = Logger;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function LoggerConsoleSimple()
{
}

Class(LoggerConsoleSimple)
.inherit(Logger)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

LoggerConsoleSimple.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
{
  console.log(timestamp, date, time, level, levelString, caller, data);
};

//------------------------------------------------------------------------------
this.LoggerConsoleSimple = LoggerConsoleSimple;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function LoggerConsoleTrace()
{
}

Class(LoggerConsoleTrace)
.inherit(Logger)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

LoggerConsoleTrace.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
{
  console.trace(timestamp, date, time, level, levelString, caller, data);
};

//------------------------------------------------------------------------------
this.LoggerConsoleTrace = LoggerConsoleTrace;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function LoggerStore()
{
  return LoggerStore.Class.construct(this, arguments);
}

Class(LoggerStore)
.inherit(log.Logger)
//.inherit(m.service.Data)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

LoggerStore.prototype.construct = function()
{
  // todo save log to generic data storage, implement save policies eg. each n log object, at time interval, at generic event, after receiving an error log event, etc.
};

//------------------------------------------------------------------------------

LoggerStore.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
{
  console.log(timestamp, date, time, level, levelString, caller, JSON.stringify(data));
};

//------------------------------------------------------------------------------
this.LoggerStore = LoggerStore;

return this;

}.call(log));

var mod = mod  || {};

this.mod = mod;

mod = (function ()
{

for(var $_sub_module_iterator in mod){eval("var " + $_sub_module_iterator + " = mod[$_sub_module_iterator];");}
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Queue()
{
  return Queue.Class.construct(this, arguments);
}

Class(Queue)
.compose("queue", []);
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Queue.prototype.add = function(callback)
{
  var _callback = callback;
  
  if(typeof _callback === "undefined" || _callback === null)
  {
    _callback = function(){};
  }
  
  if(typeof _callback !== "function")
  {
    throw new TypeError();
  }
  
  var _this = this;
  var obj = {callback: _callback};
  this.queue.push(obj);
  return function()
  {
    obj.context = this;
    obj.args = arguments;
    obj.ready = true;
    _this.exec();
  };
};

//------------------------------------------------------------------------------

Queue.prototype.exec = function()
{
  var c = this.queue[0];
  if(typeof c !== "undefined" && c.ready === true)
  {
//    this.queue.splice(0, 1);
    if(this.queue.splice(0, 1)[0] !== c)
    {
      console.log("thread race condition!");
      throw new ReferenceError();
    }
    try
    {
      c.callback.apply(c.context, c.args);
    }
    catch(error)
    {
      console.error(error);
    }
    this.exec();
  }
  
  return this;
};

//------------------------------------------------------------------------------
this.Queue = Queue;

return this;

}.call(mod));

m.global = {};
m.g = m.global;

//global = m.g;
g = m.g;

m.global.log = m.log.Log();
m.global.log.add(new m.log.LoggerConsoleSimple());
//m.global.log.add(new m.log.LoggerConsoleTrace());
//m.global.log.level(m.log.Log.level.ALL);
//m.global.log.level(m.log.Log.level.OFF);
m.global.log.level(m.log.Log.level.WARN);
//m.global.log.level(m.env.log.level);

//m.global.queue = new mod.Queue();
//m.global.conf = new conf.Configuration();
//m.global.lang = new conf.Language();

//m.global.environment = m.util.environment();
//m.sys[m.global.environment].init();

if(typeof this.root === "undefined" || this.root === null)
{
//  if(document.currentScript === null || (document.currentScript !== null && document.currentScript.src === ""))
  if(document.currentScript === null)
  {
    this.root = location.pathname;
  }
  else
  {
    this.root = document.currentScript.src.replace(location.origin, "").replace(new RegExp("\/([^/]+)$"), "");
    this.path = document.currentScript.src.replace(location.origin, "");
  }
}

return this;

}.call(m));


var m = m  || {};

this.m = m;

m = (function ()
{

for(var $_sub_module_iterator in m){eval("var " + $_sub_module_iterator + " = m[$_sub_module_iterator];");}

var srv = srv  || {};

this.srv = srv;

srv = (function ()
{

for(var $_sub_module_iterator in srv){eval("var " + $_sub_module_iterator + " = srv[$_sub_module_iterator];");}

//------------------------------------------------------------------------------

function ajax(url, responseCallback, responseCallbackContext, params, parse, method, async, type, mime, headers, loadstartDownload, progressDownload, abortDownload, errorDownload, timeoutDownload, loadDownload, loadendDownload, loadstartUpload, progressUpload, abortUpload, errorUpload, timeoutUpload, loadUpload, loadendUpload)
{
  if(1 === arguments.length)
  {
    var args = arguments[0];
    if(typeof args === "string")
    {
      return _ajax(args);
    }
    else if(typeof args === "object")
    {
      return _ajax(args.url, args.responseCallback, args.responseCallbackContext, args.params, args.parse, args.method, args.async, args.type, args.mime, args.headers, args.loadstartDownload, args.progressDownload, args.abortDownload, args.errorDownload, args.timeoutDownload, args.loadDownload, args.loadendDownload, args.loadstartUpload, args.progressUpload, args.abortUpload, args.errorUpload, args.timeoutUpload, args.loadUpload, args.loadendUpload);
    }
    else
    {
      throw new TypeError();
    }
  }
  else
  {
    return _ajax.apply(this, arguments);
//    return _ajax.call(this, url, responseCallback, responseCallbackContext, params, parse, method, type, mime, headers, loadstartDownload, progressDownload, abortDownload, errorDownload, timeoutDownload, loadDownload, loadendDownload, loadstartUpload, progressUpload, abortUpload, errorUpload, timeoutUpload, loadUpload, loadendUpload);
  }
}

//------------------------------------------------------------------------------

function _ajax(url, responseCallback, responseCallbackContext, params, parse, method, async, type, mime, headers, loadstartDownload, progressDownload, abortDownload, errorDownload, timeoutDownload, loadDownload, loadendDownload, loadstartUpload, progressUpload, abortUpload, errorUpload, timeoutUpload, loadUpload, loadendUpload)
{
  if(typeof url !== "string")
  {
    throw new TypeError();
  }
  
  var _method = "GET";
  if(typeof method !== "undefined" && method !== null)
  {
    if(typeof method !== "string")
    {
      throw new TypeError();
    }
    else
    {
      _method = method.toUpperCase();
      if(!(method === "GET" || method === "POST" || method === "PUT" || method === "DELETE" || method === "HEAD" || method === "CONNECT" || method === "TRACE" || method === "OPTIONS" || method === "PATCH"))
      {
        throw new SyntaxError();
      }
    }
  }
  
  var _paramsURL = "";
  var _paramsBody = undefined;
  if(_method === "GET" || _method === "HEAD" || _method === "DELETE" || _method === "CONNECT" || _method === "TRACE")
  {
    if(!(Object.getPrototypeOf(params) === Object.prototype || Object.getPrototypeOf(params) === null))
    {
      throw new TypeError();
    }
    
    for(var k in params)
    {
      var value = params[k];
      
      if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || value === null)
      {
      }
      else if(typeof value === "object")
      {
        value = JSON.stringify(value);
      }
      else
      {
        throw new TypeError();
      }
      
      _paramsURL += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(value);
    }
    
    if(0 < _paramsURL.length)
    {
      _paramsURL = "?" + _paramsURL.substr(1);
    }
  }
  else
  {
    if(Object.getPrototypeOf(params) === Object.prototype || Object.getPrototypeOf(params) === null)
    {
      var fd = new FormData();
      for(var k in params)
      {
        var value = params[k];

        if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || value === null)
        {
          fd.append(k, value);
        }
        else if(Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null || Object.getPrototypeOf(value) === Array.prototype)
        {
          fd.append(k, JSON.stringify(value));
        }
        else if(value instanceof ArrayBuffer)
        {
          fd.append(k, new Blob([value]));
        }
        else if(typeof value === "object")
        {
          fd.append(k, value);
        }
        else
        {
          throw new TypeError();
        }
      }
      
      _paramsBody = fd;
    }
    else
    {
      _paramsBody = params;
    }
  }
  
  var xhr = new XMLHttpRequest();
  
  if(typeof loadstartDownload === "function")
  {
    xhr.onloadstart = loadstartDownload;
  }
  
  if(typeof progressDownload === "function")
  {
    xhr.onprogress = progressDownload;
  }
  
  if(typeof abortDownload === "function")
  {
    xhr.onabort = abortDownload;
  }
  
  if(typeof errorDownload === "function")
  {
    xhr.onerror = errorDownload;
  }
  
  if(typeof timeoutDownload === "function")
  {
    xhr.ontimeout = timeoutDownload;
  }
  
  if(typeof loadDownload === "function")
  {
    xhr.onload = loadDownload;
  }
  
  if(typeof loadendDownload === "function")
  {
    xhr.onloadend = loadendDownload;
  }
  
  if(typeof loadstartUpload === "function")
  {
    xhr.upload.onloadstart = loadstartUpload;
  }
  
  if(typeof progressUpload === "function")
  {
    xhr.upload.onprogress = progressUpload;
  }
  
  if(typeof abortUpload === "function")
  {
    xhr.upload.onabort = abortUpload;
  }
  
  if(typeof errorUpload === "function")
  {
    xhr.upload.onerror = errorUpload;
  }
  
  if(typeof timeoutUpload === "function")
  {
    xhr.upload.ontimeout = timeoutUpload;
  }
  
  if(typeof loadUpload === "function")
  {
    xhr.upload.onload = loadUpload;
  }
  
  if(typeof loadendUpload === "function")
  {
    xhr.upload.onloadend = loadendUpload;
  }
  
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
        if(typeof responseCallback === "function")
        {
          var request = 
          {
            url: url,
            responseCallback: responseCallback,
            responseCallbackContext: responseCallbackContext,
            method: method,
            _method: _method,
            headers: headers,
            params: params,
            _paramsURL: _paramsURL,
            _paramsBody: _paramsBody,
            parse: parse,
            type: type,
            mime: mime,
            loadstartDownload: loadstartDownload,
            progressDownload: progressDownload,
            loadDownload: loadDownload,
            loadendDownload: loadendDownload,
            loadstartUpload: loadstartUpload,
            progressUpload: progressUpload,
            loadUpload: loadUpload,
            loadendUpload: loadendUpload,
            abortDownload: abortDownload,
            errorDownload: errorDownload,
            timeoutDownload: timeoutDownload,
            abortUpload: abortUpload,
            errorUpload: errorUpload,
            timeoutUpload: timeoutUpload
          };
          var response = xhr.response;
          var responseError = null;
          var _mime = (xhr.getResponseHeader("Content-Type") || "").split(";")[0];
          if(!(typeof parse === "undefined" || parse === null || parse === "" || typeof response === "undefined" || response === null || response === ""))
          {
            var data = response;
            try
            {
              if(parse === "json" || (parse === "mime" && _mime === "application/json"))
              {
                data = JSON.parse(response);
              }
              else if(parse === "xml" || (parse === "mime" && _mime === "application/xml"))
              {
                data = (new DOMParser()).parseFromString(response, "application/xml");
              }
              else if(parse === "binary")
              {
                var size = response.length;
                data = new ArrayBuffer(size * 2);
                var abv = new Uint16Array(data);
                for(var i = 0; i < size; i++)
                {
                  abv[i] = response.charCodeAt(i);
                }
              }
              else
              {
                throw new TypeError();
              }
            }
            catch(e)
            {
              data = null;
              responseError = e;
            }
            response = data;
          }
          responseCallback.call(responseCallbackContext || this, response, _mime, responseError, request, xhr.status, xhr.statusText, xhr.getAllResponseHeaders(), xhr);
        }
        break;
      
      default:
        break;
    }
  };
  
  if(typeof async === "boolean")
  {
    xhr.open(_method, url + _paramsURL, async);
  }
  else
  {
    xhr.open(_method, url + _paramsURL);
  }
  
  if(typeof type === "string" && type !== "")
  {
    xhr.responseType = type;
  }
  
  if(typeof mime === "string")
  {
    xhr.overrideMimeType(mime);
  }
  
  if(typeof headers === "object")
  {
    for(k in headers)
    {
      xhr.setRequestHeader(k, headers[k]);
    }
  }
  
  if(typeof _paramsBody !== "undefined" && _paramsBody !== null)
  {
    xhr.send(_paramsBody);
  }
  else
  {
    xhr.send();
  }
}

//------------------------------------------------------------------------------

function responseCallback(_success, _error, _completed, _response, _unauthorized, _forbidden)
{
  return function(response, responseMime, responseError, request, status, statusText, responseHeaders, xhr)
  {
//  console.log("response", this, arguments);
    
    if(typeof _response === "function") _response.call(this, new Event("response"), response, responseMime, responseError, request, status, statusText, responseHeaders, xhr);
//    if(responseError instanceof Error)
    if(typeof responseError !== "undefined" && responseError !== null)
    {
//console.log("response-parse-error", response, xhr.response, xhr);
//      if(typeof _error === "function") _error.apply(this, arguments);
      if(typeof _error === "function") _error.call(this, new ErrorEvent("ResponseParseError"), response, responseMime, responseError, request, status, statusText, responseHeaders, xhr);
    }
    else if((200 <= status) && (status <= 299))
    {
//      if(typeof _success === "function") _success.call(this, data);
      if(typeof _success === "function") _success.apply(this, arguments);
    }
    else if(status === 401)
    {
      if(typeof _unauthorized === "function") _unauthorized.apply(this, arguments);
    }
    else if(status === 403)
    {
      if(typeof _forbidden === "function") _forbidden.apply(this, arguments);
    }
    else
    {
//      if(typeof _error === "function") _error.apply(this, arguments);
      if(typeof _error === "function") _error.call(this, new ErrorEvent("HttpError"), response, responseMime, responseError, request, status, statusText, responseHeaders, xhr);
    }
    
    if(typeof _completed === "function") _completed.apply(this, arguments);
  };
}

//------------------------------------------------------------------------------
this.ajax = ajax;
this.responseCallback = responseCallback;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Service()
{
  return Service.Class.construct(this, arguments);
}

Class(Service)
.property("server", "")
.setter("server", Class.propertyValidatorString)
.property("service", "")
.setter("service", Class.propertyValidatorString)
.property("command", "")
.setter("command", Class.propertyValidatorString)
.property("path", "")
.setter("path", Class.propertyValidatorString)

.property("url", "")
//.property("encode", true)
//.property("method", "GET")
.property("method", "POST")
.setter("method", Class.propertyValidatorString)
.property("async")
.setter("async", Class.propertyValidatorBoolean)
.property("headers", {})
.setter("headers", Class.propertyValidatorObject)
.property("params", {})
.setter("params", Class.propertyValidatorObject)
.property("type")
.setter("type", Class.propertyValidatorString)
.property("parse", "")
//.property("parse", "mime")
//.property("parse", "json")
.setter("parse", Class.propertyValidatorString)
.property("mime", "")
.setter("mime", Class.propertyValidatorString)

.property("response")
.setter("response", Class.propertyValidatorFunction)
.property("success")
.setter("success", Class.propertyValidatorFunction)
.property("error")
.setter("error", Class.propertyValidatorFunction)
.property("completed")
.setter("completed", Class.propertyValidatorFunction)
.property("unauthorized")
.setter("unauthorized", Class.propertyValidatorFunction)
.property("forbidden")
.setter("forbidden", Class.propertyValidatorFunction)
.property("send")
.setter("send", Class.propertyValidatorFunction)
.property("receive")
.setter("receive", Class.propertyValidatorFunction)

//.property("data")
//.listener("data", function(value, prev){this.eventServiceData(value, prev);})

.properties()

.event("ServiceResponse")
.event("ServiceSuccess")
.event("ServiceError")
.event("ServiceCompleted")
.event("ServiceUnauthorized")
.event("ServiceForbidden")
.event("ServiceSend")
.event("ServiceReceive")

//.event("ServiceData")

;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Service.prototype.construct = function(service)
{
  if(typeof service === "string")
  {
    this.service(service);
  }
};

//------------------------------------------------------------------------------

Service.prototype.exec = function()
{
  var _this = this;
  
  var server = this.server();
  var service = this.service();
  var command = this.command();
  var path = this.path();
  var url = this.url();
  
  var method = this.method();
  var async = this.async();
  var headers = this.headers();
  var params = this.params();
  var parse = this.parse();
  var type = this.type();
  var mime = this.mime();
  
  var response = this.response();
  var success = this.success();
  var error = this.error();
  var completed = this.completed();
  var unauthorized = this.unauthorized();
  var forbidden = this.forbidden();
  var send = this.send();
  var receive = this.receive();
  
  if(typeof url === "undefined" || url === null || url === "")
  {
    if(typeof server === "string" && server !== "")
    {
      url = server;
    }
    else if(location.origin !== "null")
    {
      url = location.origin;
    }
    else
    {
      url = "";
    }
    
    if(typeof service === "string" && service !== "")
    {
      service = service[0] === "/" ? service.substring(1) : service;
      url += "/" + service;
//      url += "/" + encodeURIComponent(service);
//      url += "/" + encodeURIComponent(encodeURIComponent(service));
    }
    
    if(typeof command === "string" && command !== "")
    {
      command = command[0] === "/" ? command.substring(1) : command;
      url += "/" + command;
//      url += "/" + encodeURIComponent(command);
//      url += "/" + encodeURIComponent(encodeURIComponent(command));
    }
    
    if(typeof path === "string" && path !== "")
    {
      path = path[0] === "/" ? path.substring(1) : path;
      url += "/" + encodeURIComponent(path);
//      url += "/" + encodeURIComponent(encodeURIComponent(path));
    }
  }
  else if(typeof url === "string")
  {
    url = encodeURI(url);
  }
  else
  {
    throw new TypeError();
  }
  
  var _response = function(){_this.eventServiceResponse.apply(_this, arguments);};
  if(typeof response === "function")
  {
    _response = function(){_this.eventServiceResponse.apply(_this, arguments); response.apply(_this, arguments);};
  }
  else if(typeof response !== "undefined")
  {
    throw new TypeError();
  }
  
  var _success = function(data){_this.eventServiceSuccess(data);};
  if(typeof success === "function")
  {
    _success = function(data){_this.eventServiceSuccess(data); success.call(_this, data);};
  }
  else if(typeof success !== "undefined")
  {
    throw new TypeError();
  }
  
//  var _success = function(data){_this.data(data); _this.eventServiceSuccess(data);};
//  if(typeof success === "function")
//  {
//    _success = function(data){_this.data(data); _this.eventServiceSuccess(data); success.call(_this, data);};
//  }
//  else if(typeof success !== "undefined")
//  {
//    throw new TypeError();
//  }
  
  var _error = function(){_this.eventServiceError.apply(_this, arguments);};
  if(typeof error === "function")
  {
    _error = function(){_this.eventServiceError.apply(_this, arguments); error.apply(_this, arguments);};
  }
  else if(typeof error !== "undefined")
  {
    throw new TypeError();
  }
  
  var _completed = function(){_this.eventServiceCompleted.apply(_this, arguments);};
  if(typeof completed === "function")
  {
    _completed = function(){_this.eventServiceCompleted.apply(_this, arguments); completed.apply(_this, arguments);};
  }
  else if(typeof completed !== "undefined")
  {
    throw new TypeError();
  }
  
  var _unauthorized = function(){_this.eventServiceUnauthorized.apply(_this, arguments);};
  if(typeof unauthorized === "function")
  {
    _unauthorized = function(){_this.eventServiceUnauthorized.apply(_this, arguments); unauthorized.apply(_this, arguments);};
  }
  else if(typeof unauthorized !== "undefined")
  {
    throw new TypeError();
  }
  
  var _forbidden = function(){_this.eventServiceForbidden.apply(_this, arguments);};
  if(typeof forbidden === "function")
  {
    _forbidden = function(){_this.eventServiceForbidden.apply(_this, arguments); forbidden.apply(_this, arguments);};
  }
  else if(typeof forbidden !== "undefined")
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
  
  ajax(
  {
    url: url,
    responseCallback: responseCallback(_success, _error, _completed, _response, _unauthorized, _forbidden),
    responseCallbackContext: this,
    method: method,
    async: async,
    headers: headers,
    params: params,
    parse: parse,
    type: type,
    mime: mime,
    loadstartDownload: _response,
    progressDownload: _receive,
    loadDownload: _response,
    loadendDownload: _response,
    loadstartUpload: _response,
    progressUpload: _send,
    loadUpload: _response,
    loadendUpload: _response,
    abortDownload: _error,
    errorDownload: _error,
    timeoutDownload: _error,
    abortUpload: _error,
    errorUpload: _error,
    timeoutUpload: _error
  });
  
  return this;
};

//------------------------------------------------------------------------------
this.Service = Service;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Authentication()
{
  return Authentication.Class.construct(this, arguments, [["m/authentication"]]);
}

Class(Authentication)
.inherit(Service)
.property("parse", "json")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Authentication.prototype.challenge = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("challenge").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.authenticate = function(id, credential)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({id: id, credential: credential}).command("authenticate").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.unauthenticate = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("unauthenticate").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.credential = function(id, credential, credentialNew)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({id: id, credential: credential, credentialNew: credentialNew}).command("credential").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.session = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("session").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.profile = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("profile").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.profiles = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("profiles").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.id = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("id").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.add = function(id, credential, expiration)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({id: id, credential: credential, expiration: expiration}).command("add").exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authentication.prototype.remove = function(id)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({id: id}).command("remove").exec();
  
  return this;
};

//------------------------------------------------------------------------------
this.Authentication = Authentication;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Authorization()
{
  return Authorization.Class.construct(this, arguments, [["m/authorization"]]);
}

Class(Authorization)
.inherit(Service)
.property("parse", "json")
.property("authentication", "id")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Authorization.prototype.roles = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("roles").path(this.authentication()).exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authorization.prototype.ids = function()
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("ids").path(this.authentication()).exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authorization.prototype.idsWithRole = function(role)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("idsWithRole").path(this.authentication() + "/" + role).exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authorization.prototype.getIDRoles = function(id)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("getIDRoles").path(this.authentication() + "/" + id).exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authorization.prototype.setIDRoles = function(id, roles)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({roles: roles}).command("setIDRoles").path(this.authentication() + "/" + id).exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authorization.prototype.getRules = function(role)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").command("getRules").path(this.authentication() + "/" + role).exec();
  
  return this;
};

//------------------------------------------------------------------------------

Authorization.prototype.setRules = function(role, rules)
{
  m.global.log.debug(this, arguments);
  
  this.method("POST").params({rules: rules}).command("setRules").path(this.authentication() + "/" + role).exec();
  
  return this;
};

//------------------------------------------------------------------------------
this.Authorization = Authorization;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function App()
{
  return App.Class.construct(this, arguments, [["m/app"]]);
}

Class(App)
.inherit(Service)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

App.prototype.app = function(path)
{
  this.method("POST").mime("text/html").path(path).exec();
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.file = function(path)
{
  this.method("POST").path(path).exec();
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.list = function(path)
{
  this.method("POST").parse("json").path(path + "@list").exec();
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.info = function(path)
{
  this.method("POST").parse("json").path(path + "@info").exec();
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.dir = function(path)
{
  this.method("POST").parse("json").path(path + "@dir").exec();
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.find = function(path)
{
  this.method("POST").parse("json").path(path + "@find").exec();
  
  return this;
};

//------------------------------------------------------------------------------
this.App = App;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Store()
{
  return Store.Class.construct(this, arguments, [["m/data"]]);
}

// builds generic store services on crwd model on objects, eg: 
// /m/store/[dbschema|dbtable|dbrow|file|dir|symlink|store-file|store-node-file|store-node-link]/[create|read|write|destroy]/<resource-path>
// under store namespace there are classes derived from this and customized commands
// store.FileSystem has additional feature to switch from srv to local nodejs/electron filesystem module
Class(Store)
//.implements(m.ifaces.Data)
//.inherit(m.service.Data)
.inherit(Service)
.property("source", "web.app.file")
.setter("source", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})

.property("data")
.listener("data", function(value, prev){this.eventDataChanged(value, prev);})
.event("DataChanged")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Store.prototype.eventServiceSuccess = function(data)
{
//  m.global.log.debug(this, arguments);
  
  this.data(data);
  
  return this;
};

//------------------------------------------------------------------------------

Store.prototype.cmd = function(command)
{
//  m.global.log.debug(this, arguments);
  
  this.command(command + "/" + this.source());
  m.srv.Service.prototype.exec.call(this);
  
  return this;
};

//------------------------------------------------------------------------------

Store.prototype.read = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("read");
  
  return this;
};

//------------------------------------------------------------------------------

Store.prototype.write = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("write");
  
  return this;
};

//------------------------------------------------------------------------------

Store.prototype.create = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("create");
  
  return this;
};

//------------------------------------------------------------------------------

Store.prototype.destroy = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("destroy");
  
  return this;
};

//------------------------------------------------------------------------------
this.Store = Store;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Data()
{
  return Data.Class.construct(this, arguments, [["m/data"]]);
}

Class(Data)
.inherit(Service)
.property("source", "web.app.file")
.setter("source", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})

.property("data")
.listener("data", function(value, prev){this.eventDataChanged(value, prev);})
.event("DataChanged")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Data.prototype.eventServiceSuccess = function(data)
{
  this.data(data);
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.cmd = function(command)
{
  this.command(command + "/" + this.source());
  Service.prototype.exec.call(this);
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.read = function()
{
  this.method("POST").cmd("read");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.write = function()
{
  this.method("POST").cmd("write");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.create = function()
{
  this.method("POST").cmd("create");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.destroy = function()
{
  this.method("POST").cmd("destroy");
  
  return this;
};

//------------------------------------------------------------------------------
this.Data = Data;

return this;

}.call(srv));

var store = store  || {};

this.store = store;

store = (function ()
{

for(var $_sub_module_iterator in store){eval("var " + $_sub_module_iterator + " = store[$_sub_module_iterator];");}
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Data()
{
  return Data.Class.construct(this, arguments, [["m/data"]]);
}

Class(Data)
//.implements(m.ifaces.Data)
.inherit(srv.Service)
.property("source", "web.app.file")
.setter("source", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})

.property("data")
.listener("data", function(value, prev){this.eventDataChanged(value, prev);})
.event("DataChanged")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Data.prototype.eventServiceSuccess = function(data)
{
//  m.global.log.debug(this, arguments);
  
  this.data(data);
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.cmd = function(command)
{
//  m.global.log.debug(this, arguments);
  
  this.command(command + "/" + this.source());
  m.srv.Service.prototype.exec.call(this);
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.read = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("read");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.write = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("write");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.create = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("create");
  
  return this;
};

//------------------------------------------------------------------------------

Data.prototype.destroy = function()
{
//  m.global.log.debug(this, arguments);
  
  this.method("POST").cmd("destroy");
  
  return this;
};

//------------------------------------------------------------------------------
this.Data = Data;
//------------------------------------------------------------------------------
// Globals ---------------------------------------------------------------------
//------------------------------------------------------------------------------

var fs = m.sys.nodejs ? m.sys.nodejs.fs : null;

var ajaxAdvanced = m.util.ajaxAdvanced;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

// on construction returns an instance of Service or File depending on:
// environment, environment override, constructor param
// or...
// internally has an instance of service and one of file and choose wich one to call based on path prefix (https://, /, @, $, file://, etc)
// /m/net/ is service, other /m/ is file, /m/net/web/https://..., /m/net/store/...
// file is only local, service defaults to current origin but can be other
// must define a general interface better than shell command line and web url -> object/json-schema that can be mapped to shell and url
// <origin>/<service>/<command>[/<path>[|...]]
// origin === "" -> local filesystem, origin === "<ip>[:<port>]" -> mnode web service access, path === "http[s]://<...>" -> internet
// cmd: out = origin-path/srv.cmd(in) or origin-path/srv.cmd(in, &out)
// origin-path is a universal address
//

function Store()
{
  return Store.Class.construct(this, arguments);
}

Class(Store)
.property("separator", "/")
.setter("separator", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})

.property("origin", window.origin || "")
.setter("origin", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("service", "/m/store")
.setter("service", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("source", "")
.setter("source", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("command", "")
.setter("command", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("path", "")
.setter("path", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})

.property("params", {})
.setter("params", function(value){if(typeof value === "undefined"){return {};} else if(typeof value === "object"){return value;} else {throw new TypeError();}})
.property("data")
//.listener("data", function(value, prev){this.eventServiceData(value, prev);})
.listener("data", function(value, prev){console.log("service.data", {"service.data": value});})

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

.property("parse", "mime")
.setter("parse", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("type", "")
.setter("type", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
//.property("method", "GET")
.property("method", "POST")
.setter("method", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("httpError")
.setter("httpError", function(value){if(typeof value === "function" || typeof value === "undefined" || value === null){return value;} else {throw new TypeError();}})

.properties()
.event("ServiceData")
.event("ServiceResponse")
.event("ServiceSuccess")
.event("ServiceAuthentication")
.event("ServicePassword")
.event("ServiceUnauthorized")
.event("ServiceSend")
.event("ServiceReceive")
.event("ServiceError")
.event("ServiceAbort")
.event("ServiceTimeout")

.event("ServiceHttpError")
;



//  public Attributes attributes(String path) throws Exception;
//  public void attributes(String path, Attributes attributes) throws Exception;
//  
//  public boolean exists(String path) throws Exception;
//  
//  public boolean isFile(String path) throws Exception;
//  public boolean isNode(String path) throws Exception;
//  public boolean isLink(String path) throws Exception;
//  
//  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception;
//  default public void copy(String path, String dest) throws Exception {copy(path, dest, false, false);}
//  public void move(String path, String dest, boolean replace) throws Exception;
//  default public void move(String path, String dest) throws Exception {move(path, dest, false);}
//  public void rename(String path, String name) throws Exception;
//  public void delete(String path, boolean deep) throws Exception;
//  default public void delete(String path) throws Exception {delete(path, false);}
//  
//  public void file(String path) throws Exception;
//  public StreamSeekable stream(String path) throws Exception;
//  default public StreamSeekableInput read(String path) throws Exception {return stream(path);}
//  public void node(String path) throws Exception;
//  public void nodes(String path) throws Exception;
//  default public void hardLink(String path, String dest) throws Exception {link(path, dest);}
//  public void link(String path, String dest) throws Exception;
//  public String link(String path) throws Exception;
//  
//  public StreamInput list(String path) throws Exception;
//  public StreamInput find(String path, Map options) throws Exception;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//Store.prototype.construct = function()
//{
//  m.global.log.debug(this, arguments);
//};

//------------------------------------------------------------------------------

Store.prototype.restructData = function(data, reformatOptions)
{
  // restruct data and calls this.data(restruturedData);
  // think well about the flow: like this above or restruct is a property (eventually a callback) and data has a global setter to restruct
};

//------------------------------------------------------------------------------

Store.prototype.exec = function()
{
  var command = this.command();
  var origin = this.origin();
  if(origin === "" || origin === "file://")
  {
    this.execFile(command);
  }
  else
  {
    this.execService(command);
  }
  
  return this;
};

//------------------------------------------------------------------------------

Store.prototype.execFile = function(command)
{
  console.log(m, fs, command, fs[command]);
  fs[command].apply(this, args);
  
  return this;
};

//------------------------------------------------------------------------------

Store.prototype.url = function(command)
{
  var path = this.path();
  
  if("/" === path.charAt(0) || -1 !== path.indexOf("://"))
  {
    return path;
  }
  
  var separator = this.separator();
  var service = this.service();
  var source = this.source();
  var url = "";
  
  if(service !== "")
  {
    url += service;
  }
  
  if(command !== "")
  {
    url += separator + command;
  }
  
  if(source !== "")
  {
    url += separator + source;
  }
  
  if(path !== "")
  {
    url += separator + encodeURIComponent(encodeURIComponent(path));
  }
  
  return url;
};

//------------------------------------------------------------------------------

Store.prototype.execService = function(command)
{
  var _this = this;
  
  var url = this.url(command);
  
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
this.Store = Store;
//------------------------------------------------------------------------------
// Globals ---------------------------------------------------------------------
//------------------------------------------------------------------------------

var fs = m.sys.nodejs ? m.sys.nodejs.fs : null;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function File()
{
  return File.Class.construct(this, arguments);
}

Class(File)
.inherit(Store)
.property("data")
//.listener("data", function(value, prev){this.eventServiceData(value, prev);})
.listener("data", function(value, prev){console.log("service.data", {"service.data": value});})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

File.prototype.construct = function(service)
{
  this.service = service || "";
//  this.service = "/m/" + service || "";
};

//------------------------------------------------------------------------------

File.prototype.command = function(command, args)
{
  m.global.log.debug(this, arguments);
  
//  const fs = require("fs");
//
//fs.readdir(".", (err, dir) => {
//for(let filePath of dir)
//console.log(filePath);
//});
  
  console.log(m, fs, command, fs[command]);
  fs[command].apply(this, args);
  
  return this;
};

//------------------------------------------------------------------------------
this.File = File;

return this;

}.call(store));

var mod = mod  || {};

this.mod = mod;

mod = (function ()
{

for(var $_sub_module_iterator in mod){eval("var " + $_sub_module_iterator + " = mod[$_sub_module_iterator];");}
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Module()
{
  return Module.Class.construct(this, arguments);
}

Class(Module)
//.inherit(m.store.Store)
.inherit(m.srv.Data)
.property("context")
.property("global")
.property("args", {})
.setter("args", function(value){if(typeof value === "object"){return value;} else {throw new TypeError();}})
.property("strict", false)
.setter("strict", function(value){if(typeof value === "boolean"){return value;} else {throw new TypeError();}})
.property("prefix", "")
.setter("prefix", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.property("suffix", "")
.setter("suffix", function(value){if(typeof value === "string"){return value;} else {throw new TypeError();}})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Module.prototype.construct = function()
{
//  m.global.log.debug(this, arguments);
  
  this.queue = new m.mod.Queue();
};

//------------------------------------------------------------------------------

Module.prototype.exec = function()
{
//  m.global.log.debug(this, arguments);
  
  var code = this.data();
  this.add()(code);
  
  return this;
};

//------------------------------------------------------------------------------

Module.prototype.read = function()
{
//  m.global.log.debug(this, arguments);
  
  var success = this.success();
//  this.success(this.add());
  var callback = this.add();
  this.success(callback);
  this.error(callback);
  if(typeof success === "function")
  {
    this.queue.add(success)();
  }
  m.srv.Data.prototype.read.call(this);
  
  return this;
};

//------------------------------------------------------------------------------

Module.prototype.add = function()
{
//  m.global.log.debug(this, arguments);
  
  var _this = this;
  
  var context = this.context();
  var global = this.global();
  var args = this.args();
  var strict = this.strict();
  var prefix = this.prefix();
  var suffix = this.suffix();
  
  var f = function(code){_this.execute(code, context, global, args, strict, prefix, suffix);};
  
  return this.queue.add(f);
};

//------------------------------------------------------------------------------

Module.prototype.execute = function(code, context, global, args, strict, prefix, suffix)
{
//  m.global.log.debug(this, arguments);
  
  if(typeof code === "function")
  {
    code.apply(context, args);
    
    return this;
  }
  
  var _code = code;
  if(typeof _code !== "string")
  {
    throw new TypeError();
  }
  
  if(typeof prefix === "string")
  {
    _code = prefix + _code;
  }
  if(typeof suffix === "string")
  {
    _code = _code + suffix;
  }
  
  if(strict === true)
  {
    _code = "\"use strict\";\n" + _code;
  }
  
  if(typeof context === "undefined" || context === null)
  {
    context = {};
  }
  
  var signature = [];
  var parameters = [];
  if(typeof args === "object")
  {
    for(var p in args)
    {
      signature.push(p);
      parameters.push(args[p]);
    }
  }
  signature.push(_code);
  
  var func = Function;
  if(typeof global === "object")
  {
    func = global.Function;
  }
  
  try
  {
    func.apply(global, signature).apply(context, parameters);
  }
  catch(e)
  {
    console.error(e);
  }
  
  return this;
};

//------------------------------------------------------------------------------
this.Module = Module;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Queue()
{
  this.queue = [];
}

//------------------------------------------------------------------------------

Queue.prototype.add = function(callback)
{
  var _callback = callback;
  
  if(typeof _callback === "undefined" || _callback === null)
  {
    _callback = function(){};
  }
  
  if(typeof _callback !== "function")
  {
    throw new TypeError();
  }
  
  var _this = this;
  var obj = {callback: _callback};
  this.queue.push(obj);
  return function()
  {
    obj.context = this;
    obj.args = arguments;
    obj.ready = true;
    _this.exec();
  };
};

//------------------------------------------------------------------------------

Queue.prototype.exec = function()
{
  var c = this.queue[0];
  if(typeof c !== "undefined" && c.ready === true)
  {
//    this.queue.splice(0, 1);
    if(this.queue.splice(0, 1)[0] !== c)
    {
      console.log("thread race condition!");
      throw new ReferenceError();
    }
    try
    {
      c.callback.apply(c.context, c.args);
    }
    catch(error)
    {
      console.error(error);
    }
    this.exec();
  }
  
  return this;
};

//------------------------------------------------------------------------------
// Functions -------------------------------------------------------------------
//------------------------------------------------------------------------------

function ajax(url, responseCallback, responseCallbackContext, params, parse, method, async, type, mime, headers, loadstartDownload, progressDownload, abortDownload, errorDownload, timeoutDownload, loadDownload, loadendDownload, loadstartUpload, progressUpload, abortUpload, errorUpload, timeoutUpload, loadUpload, loadendUpload)
{
  if(typeof url !== "string")
  {
    throw new TypeError();
  }
  
  var _method = "GET";
  if(typeof method !== "undefined" && method !== null)
  {
    if(typeof method !== "string")
    {
      throw new TypeError();
    }
    else
    {
      _method = method.toUpperCase();
      if(!(method === "GET" || method === "POST" || method === "PUT" || method === "DELETE" || method === "HEAD" || method === "CONNECT" || method === "TRACE" || method === "OPTIONS" || method === "PATCH"))
      {
        throw new SyntaxError();
      }
    }
  }
  
  var _paramsURL = "";
  var _paramsBody = undefined;
  if(_method === "GET" || _method === "HEAD" || _method === "DELETE" || _method === "CONNECT" || _method === "TRACE")
  {
    if(!(Object.getPrototypeOf(params) === Object.prototype || Object.getPrototypeOf(params) === null))
    {
      throw new TypeError();
    }
    
    for(var k in params)
    {
      var value = params[k];
      
      if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || value === null)
      {
      }
      else if(typeof value === "object")
      {
        value = JSON.stringify(value);
      }
      else
      {
        throw new TypeError();
      }
      
      _paramsURL += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(value);
    }
    
    if(0 < _paramsURL.length)
    {
      _paramsURL = "?" + _paramsURL.substr(1);
    }
  }
  else
  {
    if(typeof params !== "undefined" && params !== null && (Object.getPrototypeOf(params) === Object.prototype || Object.getPrototypeOf(params) === null))
    {
      var fd = new FormData();
      for(var k in params)
      {
        var value = params[k];

        if(typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || value === null)
        {
          fd.append(k, value);
        }
        else if(Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null || Object.getPrototypeOf(value) === Array.prototype)
        {
          fd.append(k, JSON.stringify(value));
        }
        else if(value instanceof ArrayBuffer)
        {
          fd.append(k, new Blob([value]));
        }
        else if(typeof value === "object")
        {
          fd.append(k, value);
        }
        else
        {
          throw new TypeError();
        }
      }
      
      _paramsBody = fd;
    }
    else
    {
      _paramsBody = params;
    }
  }
  
  var xhr = new XMLHttpRequest();
  
  if(typeof loadstartDownload === "function")
  {
    xhr.onloadstart = loadstartDownload;
  }
  
  if(typeof progressDownload === "function")
  {
    xhr.onprogress = progressDownload;
  }
  
  if(typeof abortDownload === "function")
  {
    xhr.onabort = abortDownload;
  }
  
  if(typeof errorDownload === "function")
  {
    xhr.onerror = errorDownload;
  }
  
  if(typeof timeoutDownload === "function")
  {
    xhr.ontimeout = timeoutDownload;
  }
  
  if(typeof loadDownload === "function")
  {
    xhr.onload = loadDownload;
  }
  
  if(typeof loadendDownload === "function")
  {
    xhr.onloadend = loadendDownload;
  }
  
  if(typeof loadstartUpload === "function")
  {
    xhr.upload.onloadstart = loadstartUpload;
  }
  
  if(typeof progressUpload === "function")
  {
    xhr.upload.onprogress = progressUpload;
  }
  
  if(typeof abortUpload === "function")
  {
    xhr.upload.onabort = abortUpload;
  }
  
  if(typeof errorUpload === "function")
  {
    xhr.upload.onerror = errorUpload;
  }
  
  if(typeof timeoutUpload === "function")
  {
    xhr.upload.ontimeout = timeoutUpload;
  }
  
  if(typeof loadUpload === "function")
  {
    xhr.upload.onload = loadUpload;
  }
  
  if(typeof loadendUpload === "function")
  {
    xhr.upload.onloadend = loadendUpload;
  }
  
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
        if(typeof responseCallback === "function")
        {
          var request = 
          {
            url: url,
            responseCallback: responseCallback,
            responseCallbackContext: responseCallbackContext,
            method: method,
            _method: _method,
            headers: headers,
            params: params,
            _paramsURL: _paramsURL,
            _paramsBody: _paramsBody,
            parse: parse,
            type: type,
            mime: mime,
            loadstartDownload: loadstartDownload,
            progressDownload: progressDownload,
            loadDownload: loadDownload,
            loadendDownload: loadendDownload,
            loadstartUpload: loadstartUpload,
            progressUpload: progressUpload,
            loadUpload: loadUpload,
            loadendUpload: loadendUpload,
            abortDownload: abortDownload,
            errorDownload: errorDownload,
            timeoutDownload: timeoutDownload,
            abortUpload: abortUpload,
            errorUpload: errorUpload,
            timeoutUpload: timeoutUpload
          };
          var response = xhr.response;
          var responseError = null;
          var _mime = (xhr.getResponseHeader("Content-Type") || "").split(";")[0];
          if(!(typeof parse === "undefined" || parse === null || parse === "" || typeof response === "undefined" || response === null || response === ""))
          {
            var data = response;
            try
            {
              if(parse === "json" || (parse === "mime" && _mime === "application/json"))
              {
                data = JSON.parse(response);
              }
              else if(parse === "xml" || (parse === "mime" && _mime === "application/xml"))
              {
                data = (new DOMParser()).parseFromString(response, "application/xml");
              }
              else if(parse === "binary")
              {
                var size = response.length;
                data = new ArrayBuffer(size * 2);
                var abv = new Uint16Array(data);
                for(var i = 0; i < size; i++)
                {
                  abv[i] = response.charCodeAt(i);
                }
              }
              else
              {
                throw new TypeError();
              }
            }
            catch(e)
            {
              data = null;
              responseError = e;
            }
            response = data;
          }
          responseCallback.call(responseCallbackContext || this, response, _mime, responseError, request, xhr.status, xhr.statusText, xhr.getAllResponseHeaders(), xhr);
        }
        break;
      
      default:
        break;
    }
  };
  
  if(typeof async === "boolean")
  {
    xhr.open(_method, url + _paramsURL, async);
  }
  else
  {
    xhr.open(_method, url + _paramsURL);
  }
  
  if(typeof type === "string" && type !== "")
  {
    xhr.responseType = type;
  }
  
  if(typeof mime === "string")
  {
    xhr.overrideMimeType(mime);
  }
  
  if(typeof headers === "object")
  {
    for(k in headers)
    {
      xhr.setRequestHeader(k, headers[k]);
    }
  }
  
  if(typeof _paramsBody !== "undefined" && _paramsBody !== null)
  {
    xhr.send(_paramsBody);
  }
  else
  {
    xhr.send();
  }
}

//------------------------------------------------------------------------------

function responseCallback(_success, _error, _completed, _response, _unauthorized, _forbidden)
{
  return function(response, responseMime, responseError, request, status, statusText, responseHeaders, xhr)
  {
//  console.log("response", this, arguments);
    
    if(typeof _response === "function") _response.call(this, new Event("response"), response, responseMime, responseError, request, status, statusText, responseHeaders, xhr);
//    if(responseError instanceof Error)
    if(typeof responseError !== "undefined" && responseError !== null)
    {
//console.log("response-parse-error", response, xhr.response, xhr);
//      if(typeof _error === "function") _error.apply(this, arguments);
      if(typeof _error === "function") _error.call(this, new ErrorEvent("ResponseParseError"), response, responseMime, responseError, request, status, statusText, responseHeaders, xhr);
    }
    else if((200 <= status) && (status <= 299))
    {
//      if(typeof _success === "function") _success.call(this, data);
      if(typeof _success === "function") _success.apply(this, arguments);
    }
    else if(status === 401)
    {
      if(typeof _unauthorized === "function") _unauthorized.apply(this, arguments);
    }
    else if(status === 403)
    {
      if(typeof _forbidden === "function") _forbidden.apply(this, arguments);
    }
    else
    {
//      if(typeof _error === "function") _error.apply(this, arguments);
      if(typeof _error === "function") _error.call(this, new ErrorEvent("HttpError"), response, responseMime, responseError, request, status, statusText, responseHeaders, xhr);
    }
    
    if(typeof _completed === "function") _completed.apply(this, arguments);
  };
}

//------------------------------------------------------------------------------

Queue.prototype.load = function(url, callback, parse)
{
  var error = function()
  {
    console.error("ERROR");
  };
  
  ajax(url, responseCallback(this.add(callback), error, null, null, error, error), {}, null, parse, "POST", false, null, null, null, null, null, error, error, error, null, null, null, null, error, error, error, null, null);
};

//------------------------------------------------------------------------------

function loadModulesDynamically(path, modulesFile, callback)
{
  var source_dir = path + "/";
  
  var queue = new Queue();
  
  var modules;
  queue.load(source_dir + modulesFile, function(data){modules = data;}, "json");
  
  var code = "";
  var getModulesCode = function(modules)
  {
    if(modules.modules)
    {
      if(modules.name && typeof modules.name === "string" && modules.name !== "")
      {
        queue.add(function()
        {
          var code_ns_start = "";
          code_ns_start += "\nvar " + modules.name + " = " + modules.name + " || this." + modules.name + " || {};\n";
          code_ns_start += "\nthis." + modules.name + " = " + modules.name + ";\n";
          code_ns_start += "\n" + modules.name + " = (function ()\n{\n";
          code_ns_start += "\nfor(var $_sub_module_iterator in " + modules.name + "){eval(\"var \" + $_sub_module_iterator + \" = " + modules.name + "[$_sub_module_iterator];\");}\n";
          code += code_ns_start;
        })();
      }
      
      var ma = modules.modules;
      for(var i = 0; i < ma.length; i++)
      {
        getModulesCode(ma[i]);
      }
      
      if(modules.name && typeof modules.name === "string" && modules.name !== "")
      {
        queue.add(function()
        {
          var code_ns_end = "";
          code_ns_end += "\nreturn this;\n";
          code_ns_end += "\n}.call(" + modules.name + "));\n";
          code += code_ns_end;
        })();
      }
      
      if(!modules.name)
      {
        queue.add(function()
        {
//          console.log("code", code);
          
          if(typeof callback === "function")
          {
            callback(code);
          }
          else
          {
            eval(code);
          }
        })();
      }
    }
    else if(modules.file)
    {
      queue.load(source_dir + modules.file, function(data)
      {
        code += data;
        if(modules.symbols && typeof modules.symbols === "string" && modules.symbols !== "")
        {
          var symbolsArray = modules.symbols.split(",");
          for(var i = 0; i < symbolsArray.length; i++)
          {
            code += "this." + symbolsArray[i] + " = " + symbolsArray[i] + ";\n";
          }
        }
      });
    }
  };
  
  queue.add(function(){getModulesCode(modules);})();
}

//------------------------------------------------------------------------------

function replaceModulesDynamically(path, modulesFile, libraryElement, defaultModulesFile, tag)
{
  var source_dir = "";
  
  if(typeof path === "string")
  {
    source_dir = path;
  }
  else if(document.currentScript === null)
  {
    source_dir = location.pathname;
  }
  else
  {
    source_dir = document.currentScript.src.replace(location.origin, "").replace(new RegExp("\/([^/]+)$"), "");
  }
  
  var file = defaultModulesFile;
  if(typeof modulesFile === "string")
  {
    file = modulesFile;
  }
  
  if(typeof libraryElement === "string")
  {
    var element = document.getElementById(libraryElement);
    
    if(element === null)
    {
      var elements = document.getElementsByTagName(tag === "style" ? "link" : tag);
      for(var i = 0; i < elements.length; i++)
      {
        if(elements[i].href === libraryElement || elements[i].href === location.origin + libraryElement)
        {
          element = elements[i];
        }
      }
    }
    
    element.parentNode.removeChild(element);
  }
  else if(typeof libraryElement !== "undefined" && libraryElement !== null)
  {
    libraryElement.parentNode.removeChild(libraryElement);
  }
  
  loadModulesDynamically(source_dir, file, function(code)
  {
    var element = document.createElement(tag);
    document.head.appendChild(element);
    element.innerHTML = code;
  });
}

//------------------------------------------------------------------------------

function loadJSLibraryDynamically(path, jsModulesFile, jsElement)
{
  replaceModulesDynamically(path, jsModulesFile, jsElement, "modules_js.json", "script");
}

//------------------------------------------------------------------------------

function loadCSSLibraryDynamically(path, cssModulesFile, cssElement)
{
  replaceModulesDynamically(path, cssModulesFile, cssElement, "modules_css.json", "style");
}

//------------------------------------------------------------------------------

function loadLibraryDynamically(path, jsModulesFile, cssModulesFile, jsElement, cssElement)
{
  loadJSLibraryDynamically(path, jsModulesFile, jsElement);
  loadCSSLibraryDynamically(path, cssModulesFile, cssElement);
}

//------------------------------------------------------------------------------
this.loadLibraryDynamically = loadLibraryDynamically;
this.loadJSLibraryDynamically = loadJSLibraryDynamically;
this.loadCSSLibraryDynamically = loadCSSLibraryDynamically;
this.loadModulesDynamically = loadModulesDynamically;

return this;

}.call(mod));

var conf = conf  || {};

this.conf = conf;

conf = (function ()
{

for(var $_sub_module_iterator in conf){eval("var " + $_sub_module_iterator + " = conf[$_sub_module_iterator];");}
/*

implement changes notification to listeners
event fired only for specific registered paths
event fired once for many sub-changes
implement diff function for objects firing create/delete/change events on a node providing its path
for svg only root elements are needed, then propagation depends on action

if merge is true then conseguently all notifications (to every listener) provide diff object
still need registration for notifications only on particular branch and not for every change

*/

var merge = m.util.merge;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Conf()
{
  return Conf.Class.construct(this, arguments);
}

Class(Conf)
//.inherit(m.store.Store)
.property("merge", true)
.property("conf")
.setter("conf", function(value)
{
  if(this.merge() === false)
  {
    return value;
  }
  else
  {
    return merge(this.conf(), value, true, true);
  }
})
//.listener("conf", function(value, prev){this._eventConfChanged(value, prev);})
.listener("conf", function(value, prev){this.eventNotify("ConfChanged", [value, prev]);})
//.event("Changed")
.event("ConfChanged")
//this.eventConfChangedRegister(callback, before);
//this.eventConfChangedUnregister(callback);
.compose("confStore", function()
{
  var _this = this;
  var store = new store.Store();
  Class.listener(store, "data", function(value, prev){_this.conf(value);});
  
  return store;
})
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//Conf.prototype.construct = function()
//{
//};

//------------------------------------------------------------------------------

Conf.prototype.get = function(value, def, object)
{
  var conf = object;
  
  if(typeof conf === "undefined")
  {
    conf = this.conf();
  }
  
  if(typeof conf === "undefined")
  {
    return def;
  }
  
  if(typeof value === "string")
  {
    var path = value.split(".");
    for(var i = 0; i < path.length; i++)
    {
      if(typeof conf[path[i]] === "undefined")
      {
        return def;
      }
      conf = conf[path[i]];
    }
  }
  else if(Array.isArray(value))
  {
    for(var i = value.length - 1; -1 < i; i--)
    {
      conf = this.get(value[i], undefined, conf);
      if(typeof conf !== "undefined")
      {
        break;
      }
    }
  }
  else
  {
    throw new TypeError();
  }
  
  if(typeof conf === "undefined")
  {
    return def;
  }
  
  return conf;
};

//------------------------------------------------------------------------------
this.Conf = Conf;
/*

implement changes notification to listeners
event fired only for specific registered paths
event fired once for many sub-changes
implement diff function for objects firing create/delete/change events on a node providing its path
for svg only root elements are needed, then propagation depends on action

*/

var merge = m.util.merge;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Configuration()
{
  return Configuration.Class.construct(this, arguments);
}

Class(Configuration)
.instance(true, true, false, true, true)
//.inherit(m.store.Store)
.inherit(m.srv.Data)
.event("ConfigurationChanged")
.property("parse", "json")
.setter("data", function(value, replace)
{
//  if(typeof value === "string")
//  {
//    value = JSON.parse(value);
//  }
  
  if(replace === true)
  {
    return value;
  }
  else if(1 < arguments.length)
  {
    throw new TypeError();
  }
  
  var data = merge(this.data(), value, true, true);
  
  return data;
})
.listener("data", function(value, prev){this.notify(value);})
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Configuration.prototype.construct = function()
{
//  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Configuration.prototype.get = function(value, def, object)
{
//  m.global.log.debug(this, arguments);
  
  var data = object;
  
  if(typeof data === "undefined")
  {
    data = this.data();
  }
  if(typeof data === "undefined")
  {
    return def;
  }
  
  if(typeof value === "string")
  {
    var path = value.split(".");
    for(var i = 0; i < path.length; i++)
    {
      if(typeof data[path[i]] === "undefined")
      {
        return def;
      }
      data = data[path[i]];
    }
  }
  else if(Array.isArray(value))
  {
    for(var i = value.length - 1; -1 < i; i--)
    {
      data = this.get(value[i], undefined, data);
      if(typeof data !== "undefined")
      {
        break;
      }
    }
  }
  else
  {
    throw new TypeError();
  }
  
  if(typeof data === "undefined")
  {
    return def;
  }
  
  return data;
};

//------------------------------------------------------------------------------

Configuration.prototype.register = function(callback, path)
{
//  Event.prototype.register.call(this, callback);
//  this.event.ConfChanged.register(callback, path);
//  this.event.ConfChanged.register(callback);
  Configuration.Class.trigger("eventConfigurationChanged", callback);
  
  return this;
};

//------------------------------------------------------------------------------

Configuration.prototype.unregister = function(callback, path)
{
//  Event.prototype.unregister.call(this, callback);
//  this.event.ConfChanged.unregister(callback, path);
//  this.event.ConfChanged.unregister(callback);
  Configuration.Class.untrigger("eventConfigurationChanged", callback);
  
  return this;
};

//------------------------------------------------------------------------------

//Configuration.prototype.notify = function(path, args)
Configuration.prototype.notify = function(args)
{
//  Event.prototype.notify.call(path, args);
//  this.event.ConfChanged.notify(path, args);
//  this.event.ConfChanged.notify(args);
  this.eventConfigurationChanged(args);
  
  return this;
};

//------------------------------------------------------------------------------
this.Configuration = Configuration;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Language()
{
  return Language.Class.construct(this, arguments);
}

Class(Language)
.inherit(Configuration)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Language.prototype.get = function(value)
{
//  m.global.log.debug(this, arguments);
  
  if(typeof value !== "string")
  {
    throw new TypeError();
  }
  
  return Configuration.prototype.get.call(this, value, value);
};

//------------------------------------------------------------------------------
this.Language = Language;

return this;

}.call(conf));

var ui = ui  || {};

this.ui = ui;

ui = (function ()
{

for(var $_sub_module_iterator in ui){eval("var " + $_sub_module_iterator + " = ui[$_sub_module_iterator];");}
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

// when remake of js-lib will be complete, Element must be renamed to a non conflicting name with dom (UIElement, UIE, etc.)
// UIE basic element rendered at specific user interface output (graphical, textual, audio, etc.)
// ElementStore element that links data for rendering only to/from store (eg stored configuration, list, etc.)
// ElementInput ui element that receives user input (eg control to other ui elements or volatile text notes)
// ElementInputStore io: user <-> store (eg text input that is stored as it is)
// ElementStoreInput ui element that receives user input (eg button whose icon is loaded from store by path)
// ElementStoreInputStore io: user <-> store (eg text input bound to one store with icon background bound to second store)
// 
// ElementStoreInputStoreMap uses part of its conf to map/translate store data to/from user output/input (eg yes/no mapped to true/false)
// ElementStoreInputStoreMapStore uses a map-store to map/translate store data to/from user output/input (eg text mapped to id via table)
//
function Element()
{
  return Element.Class.construct(this, arguments);
}

Class(Element)
// todo save id as it is as property, but prefix parent-id + "." to the internal node id to keep dom ids unique and hierarchical
// add method to get the full path of node hierarchy
// in constructor autegenerate unique id, but do not set to internal node, but provide a global search by id path (not dom id)
//.compose("_id", function()
//{
//  return uniqueID();
//})
//.property("id")
//.getter("id", function(value){})
//.setter("id", function(value){})
//.listener("id", function(value, prev){})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Element.prototype.construct = function(tag)
{
  var _tag = "div";
  if(typeof tag === "string")
  {
    _tag = tag;
  }
  this.node = document.createElement(_tag);
  this.node.Element = this;
  this.classes = this.node.classList;
  this.style = this.node.style;
  
//  var cname = this.constructor.name;
//  if(cname !== "Element")
//  {
//    this.classes.add(cname);
//  }
//  this.classes.add(cname);
};

//------------------------------------------------------------------------------

Element.prototype.render = function()
{
  // rebuilds ui
};

//------------------------------------------------------------------------------

Element.prototype.id = function(identifier)
{
  if(arguments.length === 0)
  {
    return this.node.id;
  }
  else
  {
    this.node.id = identifier;
    
    return this;
  }
};

//------------------------------------------------------------------------------

Element.prototype.parent = function(element)
{
  if(arguments.length === 0)
  {
    return this.node.parentNode;
  }
  else if(typeof element === "undefined" || element === null)
  {
    if(!(typeof this.node.parentNode === "undefined" || this.node.parentNode === null))
    {
      this.node.parentNode.removeChild(this.node);
    }
    
    return this;
  }
  else if(element === 0)
  {
    document.getElementsByTagName("body")[0].appendChild(this.node);
    
    return this;
  }
  else if(element instanceof window.Element || element instanceof window.Node)
  {
    element.appendChild(this.node);
    
    return this;
  }
  else if(element.node && (element.node instanceof window.Element || element.node instanceof window.Node))
  {
    element.node.appendChild(this.node);
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Element.prototype.visible = function(visible)
{
  if(typeof visible !== "boolean" && typeof visible !== "undefined")
  {
    throw new TypeError();
  }
  
//  if(typeof visible === "undefined")
  if(arguments.length === 0)
  {
    return (this.node.style.display !== "none");
  }
  else if(visible === true)
  {
//    $(this.node).show();
    this.node.style.display = this.node.style._display || "";
  }
  else
  {
//    $(this.node).hide();
    if(this.node.style.display !== "none")
    {
      this.node.style._display = this.node.style.display;
    }
    this.node.style.display = "none";
  }
  
  return this;
};

//------------------------------------------------------------------------------

//Element.prototype.type = function(value)
//{
//  if(arguments.length === 0)
//  {
//    return this.node.type;
//  }
//  else if(typeof value === "string")
//  {
//    this.node.type = value;
//    
//    return this;
//  }
//  else
//  {
//    throw new TypeError();
//  }
//};

//------------------------------------------------------------------------------

//Element.prototype.value = function(value)
//{
//  if(arguments.length === 0)
//  {
//    return this.node.value;
//  }
//  else if(typeof value === "string" || typeof value === "number")
//  {
//    this.node.value = value;
//    
//    return this;
//  }
//  else
//  {
//    throw new TypeError();
//  }
//};

//------------------------------------------------------------------------------

//Element.prototype.enabled = function(value)
//{
//  if(arguments.length === 0)
//  {
//    return !this.node.disabled;
//  }
//  else if(typeof value === "boolean")
//  {
//    this.node.disabled = !value;
//    
//    return this;
//  }
//  else
//  {
//    throw new TypeError();
//  }
//};

//------------------------------------------------------------------------------

//Element.prototype.readonly = function(value)
//{
//  if(arguments.length === 0)
//  {
//    return this.node.readOnly;
//  }
//  else if(typeof value === "boolean")
//  {
//    this.node.readOnly = value;
//    
//    return this;
//  }
//  else
//  {
//    throw new TypeError();
//  }
//};

//------------------------------------------------------------------------------

Element.prototype.html = function(code)
{
  if(arguments.length === 0)
  {
    return this.node.innerHTML;
  }
  else
  {
    this.node.innerHTML = code;
    
    return this;
  }
};

//------------------------------------------------------------------------------

Element.prototype.text = function(text)
{
  if(arguments.length === 0)
  {
    return this.node.textContent;
  }
  else
  {
    this.node.textContent = text;
    
    return this;
  }
};

//------------------------------------------------------------------------------

Element.prototype.import = function(path, callback)
{
  var _this = this;
//  var d = new m.data.Data().path(path).parse("html");
//  d.eventDataChanged = function(value, prev)
//  {
//    var c = value.children;
//    for(var i = 0; c.length; i++)
//    {
//      _this.node.appendChild(c[i]);
//    }
//  };
//  d.read();
  var d = new m.srv.Data().path(path).success(function(value, prev)
  {
    _this.node.innerHTML = value;
    if(typeof callback === "function")
    {
      callback.apply(_this);
    }
  }).read();
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.add = function(element)
{
//  if(element instanceof window.Element)
  if(element instanceof window.Node)
  {
    this.node.appendChild(element);
    
    return this;
  }
  else if(element.node && element.node instanceof window.Node)
  {
    this.node.appendChild(element.node);
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Element.prototype.remove = function(element)
{
//  if(element instanceof window.Element)
  if(element instanceof window.Node)
  {
    this.node.removeChild(element);
    
    return this;
  }
  else if(element.node && element.node instanceof window.Node)
  {
    this.node.removeChild(element.node);
    
    return this;
  }
  else
  {
    throw new TypeError();
  }
};

//------------------------------------------------------------------------------

Element.prototype.select = function(selector)
{
  return this.node.querySelectorAll(selector);
};

//------------------------------------------------------------------------------

Element.prototype.escape = function(html)
{
  return document.createElement("div").appendChild(document.createTextNode(html)).parentNode.innerHTML;
};

//------------------------------------------------------------------------------

Element.prototype.has = function(element)
{
  var node;
  if(element instanceof Element)
  {
    node = element.node;
  }
//  else if(element instanceof window.Element)
  else if(element instanceof window.Node)
  {
    node = element;
  }
  else
  {
    throw new TypeError();
  }
  
  while(typeof node !== "undefined" && node !== null)
  {
    if(node === this.node)
    {
      return true;
    }
    
    node = node.parentNode;
  }
  
  return false;
};

//------------------------------------------------------------------------------

Element.prototype.register = function(name, listener)
{
  this.node.addEventListener(name, listener);
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.unregister = function(name, listener)
{
  this.node.removeEventListener(name, listener);
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.notify = function(event)
{
  this.node.dispatchEvent(event);
  
  return this;
};

//------------------------------------------------------------------------------
this.Element = Element;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ModuleScript()
{
  return ModuleScript.Class.construct(this, arguments);
}

Class(ModuleScript)
.inherit(mod.Module)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ModuleScript.prototype.execute = function(code, context, global, args, strict, prefix, suffix)
{
  m.global.log.debug(this, arguments);
  
  if(typeof code === "function")
  {
    code.apply(context, args);
    
    return this;
  }
  
  var _code = code;
  if(typeof _code !== "string")
  {
    throw new TypeError();
  }
  
  if(typeof prefix === "string")
  {
    _code = prefix + _code;
  }
  if(typeof suffix === "string")
  {
    _code = _code + suffix;
  }
  
  if(strict === true)
  {
    _code = "\"use strict\";\n" + _code;
  }
  
  if(typeof context === "undefined" || context === null)
  {
    context = {};
  }
  
  var signature = "";
  var parameters = "";
  if(typeof args === "object")
  {
    for(var p in args)
    {
      signature += ", " + p;
      parameters += ", document.currentScript.m.args[\"" + p + "\"]";
    }
    if(signature.indexOf(", ") === 0)
    {
      signature = signature.substring(2);
    }
  }
  _code = "((function(" + signature + ")\n{\n" + _code + "\n}).call(document.currentScript.m.context" + parameters + "));\n";
  
  var win = window;
  if(typeof global === "object")
  {
    win = global;
  }
  
  var script = win.document.createElement("script");
  script.type = "text/javascript";
  script.charset = "UTF-8";
  script.innerHTML = _code;
  
  script.m = {};
  script.m.context = context;
  script.m.args = args;
  
  win.document.head.appendChild(script);
  
  return this;
};

//------------------------------------------------------------------------------

ModuleScript.prototype.cssAdd = function(path, id)
{
  if(typeof path !== "undefined" && typeof path !== "string")
  {
    throw new TypeError();
  }
  
  var node = document.createElement("link");
  node.type = "text/css";
  node.rel = "stylesheet";
  
  if(typeof path === "string")
  {
    node.href = path;
  }
  
  if(typeof id === "string")
  {
    node.id = id;
  }
  
  var win = this.global() || window;
  if(typeof win !== "undefined" && win !== null)
  {
    win.document.head.appendChild(node);
  }
  else
  {
    win.addEventListener("load", function(event){win.document.head.appendChild(node);});
  }
  
  this.css = this.css || [];
  this.css.push(node);
  
  return this;
};

//------------------------------------------------------------------------------
this.ModuleScript = ModuleScript;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Module()
{
  return Module.Class.construct(this, arguments, [["iframe"]]);
}

Class(Module)
.inherit(Element)
.inherit(ui.ModuleScript)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Module.prototype.construct = function()
{
  var node = this.node;
  node.srcdoc = "<!DOCTYPE html><html><head><title> </title><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head><body></body></html>";
  
//  node.classList.add("Module");
  
  node.style.width = "100%";
  node.style.height = "100%";
  node.style.border = "0";
  node.style.margin = "0";
  node.style.padding = "0";
//  node.style.overflow = "hidden";
  
  var _this = this;
  node.addEventListener("load", this.queue.add(function(event)
  {
    var win = this.contentWindow;
    var doc = win.document;
    var body = doc.body;
    
    win._this = _this;
    win.node = node;
    
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.border = "0";
    body.style.margin = "0";
    body.style.padding = "0";
//    body.style.overflow = "hidden";
    
    _this.global(win).context(win);
  }));
//  _this.data(function()
//  {
//    var win = _this.node.contentWindow;
//    win.m = win.m || {};
//    win.m.env = win.m.env || {};
//    if(typeof win.m.env.path === "undefined")
//    {
//      win.m.env.path = m.env.path;
//    }
//  }).exec();
//  _this.path(m.env.path).read();
};

//------------------------------------------------------------------------------

Module.prototype.read = function()
{
  m.global.log.debug(this, arguments);
  
  var success = this.success();
  var callback = this.add();
  this.success(callback);
  this.error(callback);
  if(typeof success === "function")
  {
    this.queue.add(success)();
  }
//  m.srv.Data.prototype.read.call(this);
  m.srv.Data.prototype.cmd.call(this, "read");
  
  return this;
};

//------------------------------------------------------------------------------

Module.prototype.execute = function(code, context, global, args, strict, prefix, suffix)
{
  m.global.log.debug(this, arguments);
  
  m.ui.ModuleScript.prototype.execute.call(this, code, context || this.node.contentWindow, global || this.node.contentWindow, args, strict, prefix, suffix);
};

//------------------------------------------------------------------------------

Module.prototype.cssAdd = function(path, id)
{
  if(typeof path !== "undefined" && typeof path !== "string")
  {
    throw new TypeError();
  }
  
  var node = document.createElement("link");
  node.type = "text/css";
  node.rel = "stylesheet";
  
  if(typeof path === "string")
  {
    node.href = path;
  }
  
  if(typeof id === "string")
  {
    node.id = id;
  }
  
  if(typeof this.node.contentWindow !== "undefined" && this.node.contentWindow !== null)
  {
    this.node.contentWindow.document.head.appendChild(node);
  }
  else
  {
    this.node.addEventListener("load", function(event){this.contentWindow.document.head.appendChild(node);});
  }
  
  this.css = this.css || [];
  this.css.push(node);
  
  return this;
};

//------------------------------------------------------------------------------
this.Module = Module;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementConf()
{
  return ElementConf.Class.construct(this, arguments);
}

Class(ElementConf)
.inherit(Element)
.inherit(conf.Conf)
//.inherit(conf.Configuration)
.event("ConfChanged", function(value, prev)
{
  // each subclass registers class event callback where it updates the ui
  // then code that instantiates such subclass can call eventConfChangedRegister to register on that instance to receive event only for that obj
//  console.log("ElementConf - event conf changed", value, prev);
})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//ElementConf.prototype.construct = function()
//{
//};

//------------------------------------------------------------------------------

//ElementConf.prototype.update = function()
//{
//};

//------------------------------------------------------------------------------

//ElementConf.prototype.parent = function(element)
//{
//  if(arguments.length === 0)
//  {
//    return this.node.parentNode;
//  }
//  else if(typeof element === "undefined" || element === null)
//  {
//    if(!(typeof this.node.parentNode === "undefined" || this.node.parentNode === null))
//    {
//      this.node.parentNode.removeChild(this.node);
//    }
//    
//    return this;
//  }
//  else if(element === 0)
//  {
//    document.getElementsByTagName("body")[0].appendChild(this.node);
//    this.update();
//    
//    return this;
//  }
//  else if(element instanceof window.ElementStore || element instanceof window.Node)
//  {
//    element.appendChild(this.node);
//    this.update();
//    
//    return this;
//  }
//  else if(element.node && (element.node instanceof window.ElementStore || element.node instanceof window.Node))
//  {
//    element.node.appendChild(this.node);
//    this.update();
//    
//    return this;
//  }
//  else
//  {
//    throw new TypeError();
//  }
//};

//------------------------------------------------------------------------------
this.ElementConf = ElementConf;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementInput()
{
  return ElementInput.Class.construct(this, arguments);
}

Class(ElementInput)
.inherit(Element)
.property("value")
//.getter("value", function(value){return this._input.value || null;})
.setter("value", function(value)
{
  if(!this.validate(value))
  {
    throw new Error();
  }
  
  return value;
})
//.listener("value", function(value, prev){this.update();})
// real-time validator (eg while typing) is provided by the specific control eventually using the property "validator"
.property("validator")
// if not lang then use global else use specified -> used for label and anything else within the control
.property("lang", new conf.Language())
// label should be translated, or translated by default except if second argument is false, or if null by transaltion of "id"
.property("label")
.setter("label", function(value)
{
  if(typeof value === "string")
  {
    this._label.textContent = this.lang().get(value);
//    this._label.style.display = "inline";
    this._label.style.display = "inline-block";
    
    return value;
  }
  else if(typeof value === "undefined" || value === null)
  {
    this._label.textContent = "";
    this._label.style.display = "none";
    
    return value;
  }
  else
  {
    throw new TypeError();
  }
})
.property("placeholder")
//.setter("placeholder", function(value){this._input.placeholder = value; return value;})
.property("readonly")
//.getter("readonly", function(value){return this._input.readOnly;})
//.setter("readonly", function(value){this._input.readOnly = value; return value;})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ElementInput.prototype.construct = function()
{
//  var cname = this.constructor.name;
//  this.classes.add(cname);
  this.node.classList.add("icon");
  
  this._label = document.createElement("label");
  this._label.classList.add("icon");
  this._label.style.display = "none";
  this.node.appendChild(this._label);
  
//  this._icon = document.createElement("i");
//  this._icon.classList.add("icon");
//  this.node.appendChild(this._icon);
  
  var cname = this.constructor.name;
  if(cname !== ElementInput.name)
  {
    this.classes.add(ElementInput.name);
  }
  this.classes.add(cname);
  
//  if(cname === "ElementInput" || cname === "ElementInputStore")
//  {
//    this._input = document.createElement("input");
//    this.node.appendChild(this._input);
////    Class.getter(this, "value", function(value){return this._input.value || null;})
//  }
  
  this.lang(m.global.lang);
};

//------------------------------------------------------------------------------

ElementInput.prototype.validate = function(value)
{
  var validator = this.validator();
  
  if (typeof validator === "function")
  {
    return validator.call(this, value);
  }
  
  return true;
};

//------------------------------------------------------------------------------
this.ElementInput = ElementInput;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementConfInput()
{
  return ElementConfInput.Class.construct(this, arguments);
}

Class(ElementConfInput)
.inherit(ElementConf)
.inherit(ElementInput)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ElementConfInput.prototype.construct = function()
{
};

//------------------------------------------------------------------------------
this.ElementConfInput = ElementConfInput;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementInputStore()
{
  return ElementInputStore.Class.construct(this, arguments);
}

Class(ElementInputStore)
.inherit(ElementInput)
.inherit(store.Store)
.property("autoLoad", true)
.property("autoSave", true)
.property("value")
.listener("value", function(value, prev)
{
  // if autosave then put value into data and call store save
  this.update();
})
.property("data")
.listener("data", function(value, prev)
{
  // if autoload then put data into value
  this.update();
})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ElementInputStore.prototype.construct = function()
{
};

//------------------------------------------------------------------------------

ElementInputStore.prototype.update = function()
{
};

//------------------------------------------------------------------------------

ElementInputStore.prototype.load = function()
{
};

//------------------------------------------------------------------------------

ElementInputStore.prototype.save = function()
{
};

//------------------------------------------------------------------------------
this.ElementInputStore = ElementInputStore;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementConfInputStore()
{
  return ElementConfInputStore.Class.construct(this, arguments);
}

Class(ElementConfInputStore)
.inherit(ElementConf)
.inherit(ElementInputStore)
.properties()
;
//console.log("class inherit", "ElementConfInputStore", ElementConfInputStore.prototype, ElementConf.prototype, ElementInputStore.prototype);

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ElementConfInputStore.prototype.construct = function()
{
};

//------------------------------------------------------------------------------
this.ElementConfInputStore = ElementConfInputStore;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementConfInputStoreMap()
{
  return ElementConfInputStoreMap.Class.construct(this, arguments);
}

Class(ElementConfInputStoreMap)
.inherit(ElementConfInputStore)
//.property("value")
//.getter("value", function(value){return this.map(value);})
//.setter("value", function(value){return this.revmap(value);})
//.property("text")
////.getter("text", function(value){return this.map(value);})
////.setter("text", function(value){return this.revmap(value);})
.property("map")
//.listener("map", function(value, prev){this.update();})
//.property("revmap")
//.listener("revmap", function(value, prev){this.update();})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//ElementConfInputStoreMap.prototype.construct = function()
//{
//};

//------------------------------------------------------------------------------
this.ElementConfInputStoreMap = ElementConfInputStoreMap;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function ElementConfInputStoreMapStore()
{
  return ElementConfInputStoreMapStore.Class.construct(this, arguments);
}

Class(ElementConfInputStoreMapStore)
.inherit(ElementConfInputStoreMap)
.compose("mapStore", function()
{
  var _this = this;
  var store = new store.Store();
  Class.listener(store, "data", function(value, prev){_this.map(value);});
  
  return store;
})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//ElementConfInputStoreMapStore.prototype.construct = function()
//{
//};

//------------------------------------------------------------------------------
this.ElementConfInputStoreMapStore = ElementConfInputStoreMapStore;

var merge = m.util.merge;

// todo dynamic replicate the form with rules how many replicas at start, how to index id the array elements
// subforms as array and not only as subobject
// most advanced is a mix array/object where items can have name OR index (eg. address["home"], address["work"], address[0], address[1], ...)
// implement as pre-form + dynamic-form + post-form -> NB value is an object with a special key (id of the sub-dynamic-form (autogen if null)) that has an array
// easy with plain object with "$m" subobject with functions to access length push etc.
// on first build only one/none sub-form into a sub-div with add/remove buttons, on set regenerate each sub-form for each array element
// an add button for whole form-dynamic, one remove button for each sub-form
// 
// conditional input is logically typical for map-input but could be extended
// change in conf/data/store somewhere must trigger conf/data/store somewhere else
// 
// progressive/wizard forms with arrows/tabs/bradcrumb navigation
// 
// form element label, full icons, hint, required/optional, validation icons/colors, validation messages, all translated, css classes for dom struct (list count, nest count, etc.)
// input is something that enters a value and generally does not interfere with ui/workflow
// control is something that controls ui/workflow
// 
// think about conditional input (conditional select-lists, radio buttons for alternative sub-sections, etc.)
// select translations??? value as id + translatable text OR enum with fixed text (the latter is hash/signature friendly, the former not so much)???
// struct/schema references even cyclic vs hash/signature
// schema ref in every object
// objects refs
// files as base64 text OR hash refs??? -> same as object refs since objects are saved as files and hashed
// 
// 
// 
// workflow:
// acts on info=doc=json+files through states
// one/many docs enter a state from one/many arrow-flows and one/many docs exits from each arrow-flow corresponding to a state trigger
// workflow-graph: states connected with directional arrows that represents the state change (on every arrow flows (is associated) one/many docs)
// out arrows are all and only possible states that can change from present one
// ui to list all states allowed to user with list of current docs
// ui to specific state and ui to specific doc
// state has associated enabled user-roles and enabled-in-schema-docs and enabled-schema-out-docs
// 
// wf-app: menu + form. menu is all his group for such app, alerts, messages and or list of other users for supeusers, etc.
// standard menu is generated automatically, but custom one can be provided
// 
// bpmn service: is the interface against all the logic
// conf service returns the list of confs for all current profiles, but confs should not be used for app logic
// bpmn-srv commands: applist, app, execute-task, etc.
// applist gives complete list of apps allowed for current profiles
// app gives the app.js (also other js, css, mod, lib, conf, etc.) requested only if allowed by current profiles
//

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Form()
{
  return Form.Class.construct(this, arguments);
}

Class(Form)
//.inherit(Element)
.inherit(ElementConfInputStore)
.compose("elems", {})
.compose("list", [])
//.property("struct")
//.setter("struct", function(value){this.build(value); return value;})
.property("conf")
.event("ConfChanged", function(value, prev)
{
  this.build(value);
})
.property("value")
.getter("value", function(value){return this.get(this.elems);})
.setter("value", function(value){return this.set(value);})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Form.prototype.construct = function()
{
};

//------------------------------------------------------------------------------

Form.prototype.build = function(struct)
{
  if(!(struct && struct.constructor && struct.constructor.name === "Array"))
//  if(!Array.isArray(struct))
  {
    throw new TypeError();
  }
  
  var count = 0;
  
  for(var i = 0; i < struct.length; i++)
  {
    var elemStruct = struct[i];
    if(typeof elemStruct !== "object")
    {
      throw new TypeError();
    }
    
    var elem;
    if(Array.isArray(elemStruct))
    {
      elem = new FormDynamic().conf(elemStruct);
      merge(this.elems, elem.elems, true, true);
    }
    else if(typeof elemStruct._class === "string")
    {
      elem = new ui[elemStruct._class]();
      
      for(var k in elemStruct)
      {
        if(typeof elem[k] === "function")
        {
          elem[k](elemStruct[k]);
        }
        else
        {
          elem[k] = elemStruct[k];
        }
      }
    }
    else
    {
      throw new TypeError();
    }
    
    elem.parent(this);
    this.list.push(elem);
    this.elems[elemStruct.id || count++] = elem;
//    this.elems[elemStruct.id || (this.list.length - 1)] = elem;
//    if(typeof elemStruct.id !== "undefined")
//    {
//      this.elems[elemStruct.id] = elem;
//    }
  }
};

//------------------------------------------------------------------------------

Form.prototype.get = function(elements)
{
  var elems = elements;
  if(arguments.length === 0)
  {
    elems = this.elems;
  }
  
  var res = {};
  
  for(var k in elems)
  {
    res[k] = elems[k].value();
  }
  
  return res;
};

//------------------------------------------------------------------------------

Form.prototype.set = function(elems)
{
  if(typeof elems !== "object" || Array.isArray(elems))
  {
    throw new TypeError();
  }
  
  for(var k in elems)
  {
    this.elems[k].value(elems[k]);
  }
};

//------------------------------------------------------------------------------

//Form.prototype.reset = function(values)
//{
//  var struct = this.struct();
//  for(var i = 0; i < struct.length; i++)
//  {
//    var elemStruct = struct[i];
//    if(typeof elemStruct !== "object" || typeof elemStruct.name !== "string")
//    {
//      throw new TypeError();
//    }
//    
//    var elem = this.list[i];
//    if(elemStruct.type === "form" && Array.isArray(elemStruct.struct))
//    {
//      elem.reset();
//    }
//    
//    if(typeof elemStruct.value !== "undefined")
//    {
//      elem.value(elemStruct.value);
//    }
//    else
//    {
//      elem.value("");
//    }
//  }
//};

//------------------------------------------------------------------------------
this.Form = Form;

var merge = m.util.merge;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function FormDynamic()
{
  return FormDynamic.Class.construct(this, arguments);
}

Class(FormDynamic)
//.inherit(Element)
.inherit(ElementConfInputStore)
//.inherit(Form)
.compose("elems", {})
.compose("list", [])
//.property("struct")
//.setter("struct", function(value){this.build(value); return value;})
.property("conf")
.event("ConfChanged", function(value, prev)
{
  this.build(value);
})
.property("value")
.getter("value", function(value){return this.get(this.elems);})
.setter("value", function(value){return this.set(value);})
.property("sublabel")
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

FormDynamic.prototype.construct = function()
{
  this.classes.add("Form");
};

//------------------------------------------------------------------------------

FormDynamic.prototype.rebuild = function()
{
  this.list = [];
  this.elems = {};
  this.html("");
};

//------------------------------------------------------------------------------

FormDynamic.prototype.build = function(struct)
{
  var _this = this;
  var index = this.list.length;
  
  var container = new ui.Element().parent(this);
  container.classes.add("container");
  
  this._label = document.createElement("label");
//  this._label.style.display = "none";
  container.node.appendChild(this._label);
//  this.label("[" + index + "]" + this.label());
  this._label.textContent = index;
  
  var form = new ui.Form().conf(struct).parent(container);
  if(this.sublabel()) form.label(this.sublabel());
  this.list.push(form);
  this.elems[index] = form;
  
  var buttons = new ui.Element().parent(container);
  buttons.classes.add("buttons");
  
//  var add = new ui.Button().icon("icon-add").label("ADD BELOW").callback(function(){_this.add(index, container);}).parent(buttons);
//  var remove = new ui.Button().icon("icon-remove").label("REMOVE").callback(function(){_this.remove(index, container);}).parent(buttons);
//  var up = new ui.Button().icon("icon-up").label("UP").callback(function(){_this.up(index, container);}).parent(buttons);
//  var down = new ui.Button().icon("icon-down").label("DOWN").callback(function(){_this.down(index, container);}).parent(buttons);
  var add = new ui.Button().label("ADD BELOW").callback(function(){_this.add(index, container);}).parent(buttons);
  var remove = new ui.Button().label("REMOVE").callback(function(){_this.remove(index, container);}).parent(buttons);
  var up = new ui.Button().label("UP").callback(function(){_this.up(index, container);}).parent(buttons);
  var down = new ui.Button().label("DOWN").callback(function(){_this.down(index, container);}).parent(buttons);
  
  add.classes.add("add");
  remove.classes.add("remove");
  up.classes.add("up");
  down.classes.add("down");
};

//------------------------------------------------------------------------------

FormDynamic.prototype.swap = function(node1, node2)
{
  var afterNode2 = node2.nextElementSibling;
  var parent = node2.parentNode;
  node1.replaceWith(node2);
  parent.insertBefore(node1, afterNode2);
};

//------------------------------------------------------------------------------

FormDynamic.prototype.rebuildElements = function()
{
  this.elems = {};
  
  for(var i = 0; i < this.list.length; i++)
  {
    this.elems[i] = this.list[i];
  }
};

//------------------------------------------------------------------------------

FormDynamic.prototype.add = function(index, container)
{
//  console.log("add", this, this.conf(), index, container);
  this.build(this.conf());
  for(var i = index + 1; i < this.list.length; i++)
  {
    this.swap(this.list[i].node, this.list[this.list.length - 1].node);
  }
  var form = this.list.pop();
  this.list.splice(index + 1, -1, form);
  this.rebuildElements();
//  console.log(this.list, this.elems);
};

//------------------------------------------------------------------------------

FormDynamic.prototype.remove = function(index, container)
{
//  console.log("remove", this, this.conf(), index, container);
//  this.node.removeChild(container.node);
  container.node.remove();
  this.list.splice(index, 1);
  this.rebuildElements();
//  console.log(this.list, this.elems);
};

//------------------------------------------------------------------------------

FormDynamic.prototype.up = function(index, container)
{
//  console.log("up", this, this.conf(), index, container);
  if(index === 0)
  {
    return;
  }
  this.swap(this.list[index].node, this.list[index - 1].node);
  var form = this.list[index];
  this.list[index] = this.list[index - 1];
  this.list[index - 1] = form;
  this.rebuildElements();
//  console.log(this.list, this.elems);
};

//------------------------------------------------------------------------------

FormDynamic.prototype.down = function(index, container)
{
//  console.log("down", this, this.conf(), index, container);
  if(index === this.list.length - 1)
  {
    return;
  }
  this.swap(this.list[index].node, this.list[index + 1].node);
  var form = this.list[index];
  this.list[index] = this.list[index + 1];
  this.list[index + 1] = form;
  this.rebuildElements();
//  console.log(this.list, this.elems);
};

//------------------------------------------------------------------------------

FormDynamic.prototype.get = function(elements)
{
  var elems = elements;
  if(arguments.length === 0)
  {
    elems = this.elems;
  }
  
//  var res = {};
//  
//  for(var k in elems)
//  {
//    res[k] = elems[k].value();
//  }
  var res = [];
  
  for(var i = 0; i < this.list.length; i++)
  {
    res[i] = this.list[i].value();
  }
  
  return res;
};

//------------------------------------------------------------------------------

FormDynamic.prototype.set = function(values)
{
//  if(typeof values !== "object" || Array.isArray(values))
  if(!Array.isArray(values))
  {
    throw new TypeError();
  }
  
  this.rebuild();
//  var keys = Object.getOwnPropertyNames(values);
//  for(var i = 0; i < keys.length; i++)
//  {
//    this.build(this.conf());
//  }
  for(var i = 0; i < values.length; i++)
  {
    this.build(this.conf());
    this.list[i].value(values[i]);
  }
  this.rebuildElements();
  
//  for(var k in values)
//  {
//    this.elems[k].value(values[k]);
//  }
};

//------------------------------------------------------------------------------

//Form.prototype.reset = function(values)
//{
//  var struct = this.struct();
//  for(var i = 0; i < struct.length; i++)
//  {
//    var elemStruct = struct[i];
//    if(typeof elemStruct !== "object" || typeof elemStruct.name !== "string")
//    {
//      throw new TypeError();
//    }
//    
//    var elem = this.list[i];
//    if(elemStruct.type === "form" && Array.isArray(elemStruct.struct))
//    {
//      elem.reset();
//    }
//    
//    if(typeof elemStruct.value !== "undefined")
//    {
//      elem.value(elemStruct.value);
//    }
//    else
//    {
//      elem.value("");
//    }
//  }
//};

//------------------------------------------------------------------------------
this.FormDynamic = FormDynamic;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

// button is an icon then a label and a callback on click (-> the input-label is moved inside the button as part of it: icon + button label)
// icon can be a font+before-content or an svg/png background + min width and min height
// specific icon can be set inside the code by simply adding a css class specified in a companion specific style
// icon by code (through a css class) is set when need to specify a role of that button
// icon by overriding those css classes (eventually by restrcting ths css selector) is set for style
// overriding font-icons mean set new ::before content with proper unicode character (could be used css vars, but huge work to do)
//

function Button()
{
  return Button.Class.construct(this, arguments);
}

Class(Button)
//.inherit(ElementConfInputStore)
.inherit(ElementConfInput)
.property("conf", {locale: "en"})
.event("ConfChanged", function(value, prev)
{
  this.rebuild();
})
//.property("text")
.property("callback")
.setter("callback", function(value)
{
  if(typeof value === "function")
  {
    this.node.onclick = value;
    
    return value;
  }
  else if(typeof value === "undefined" || value === null)
  {
    this.node.onclick = null;
    delete this.node.onclick;
    
    return value;
  }
  else
  {
    throw new TypeError();
  }
})
.property("icon")
.setter("icon", function(value)
{
  if(typeof value === "string")
  {
    this.node.style.setProperty("--icon", "var(--" + value + ")");
    
    return value;
  }
  else if(typeof value === "undefined" || value === null)
  {
//    this.node.style.removeProperty("--icon");
    this.node.style.setProperty("--icon", "initial");
    
    return value;
  }
  else
  {
    throw new TypeError();
  }
})
//.property("icon")
//.setter("icon", function(value)
//{
//  if(typeof value === "string")
//  {
//    this._icon.classList.add(value);
////    this._icon.style.display = "inline";
////    this._icon.style.display = "block";
//    this._icon.style.display = "inline-block";
//    
//    return value;
//  }
//  else if(typeof value === "undefined" || value === null)
//  {
//    this._icon.classList.remove(this.icon());
//    this._icon.style.display = "none";
//    
//    return value;
//  }
//  else
//  {
//    throw new TypeError();
//  }
//})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Button.prototype.construct = function()
{
  this.classes.add("input");
  
  this.rebuild();
};

//------------------------------------------------------------------------------

Button.prototype.update = function()
{
//  this.rebuild();
};

//------------------------------------------------------------------------------

Button.prototype.rebuild = function()
{
//  this.html("");
//  
//  this._icon = document.createElement("i");
//  this._icon.classList.add("icon");
//  this._icon.style.display = "none";
//  this.node.appendChild(this._icon);
//  this.icon(this.icon());
//  
//  this._label = document.createElement("label");
//  this._label.style.display = "none";
//  this.node.appendChild(this._label);
  this.label(this.label());
};

//------------------------------------------------------------------------------
this.Button = Button;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

// todo percentage in the middle
// percentage easily removable from css
// alt css with "circle" class that makes the same structure circular progress
//

function ProgressBar()
{
  return ProgressBar.Class.construct(this, arguments);
}

Class(ProgressBar)
.inherit(ElementConfInputStore)
.property("conf", {locale: "en"})
.event("ConfChanged", function(value, prev)
{
  this.rebuild();
})
.setter("value", function(value)
{
  if(typeof value !== "number")
  {
    throw new TypeError();
  }
  
  if(value < 0 || 1 < value)
  {
    throw new RangeError();
  }
  
  var perc = "" + Math.floor(value * 100) + "%";
  this._text.innerText = perc;
  this._progress.style.width = perc;
  
  return value;
})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

ProgressBar.prototype.construct = function()
{
  this.rebuild();
};

//------------------------------------------------------------------------------

ProgressBar.prototype.update = function()
{
//  this.rebuild();
};

//------------------------------------------------------------------------------

ProgressBar.prototype.rebuild = function()
{
  this.html("");
  
  this._label = document.createElement("label");
  this._label.style.display = "none";
  this.node.appendChild(this._label);
  this.label(this.label());
  
  this._container = document.createElement("div");
  this._container.classList.add("progress_container");
  this._container.classList.add("input");
  this.node.appendChild(this._container);
  
  this._progress = document.createElement("div");
  this._progress.classList.add("progress");
  this._progress.classList.add("input");
  this._container.appendChild(this._progress);
  
  this._text = document.createElement("div");
  this._text.classList.add("text");
  this._text.classList.add("input");
  this._container.appendChild(this._text);
};

//------------------------------------------------------------------------------
this.ProgressBar = ProgressBar;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Input()
{
  return Input.Class.construct(this, arguments);
}

Class(Input)
.inherit(ElementConfInputStore)
.getter("value", function(value){return this._input.value || null;})
.setter("value", function(value)
{
  if(!this.validate(value))
  {
    throw new Error();
  }
  
  this._input.value = value;
  
  return value;
})
.setter("placeholder", function(value){this._input.placeholder = value; return value;})
.getter("readonly", function(value){return this._input.readOnly;})
.setter("readonly", function(value){this._input.readOnly = value; return value;})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Input.prototype.construct = function()
{
//  var cname = this.constructor.name;
//  if(cname !== Input.name)
//  {
//    this.classes.add(Input.name);
//  }
//  this.classes.add(cname);
  
  this._input = document.createElement("input");
  
  this._field = document.createElement("div");
  this._field.classList.add("icon");
  this._field.appendChild(this._input);
  
  this.node.appendChild(this._field);
};

//------------------------------------------------------------------------------
this.Input = Input;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Text()
{
  return Text.Class.construct(this, arguments);
}

Class(Text)
.inherit(ElementConfInputStore)
.getter("value", function(value){return this._input.value || null;})
.setter("value", function(value)
{
  if(!this.validate(value))
  {
    throw new Error();
  }
  
  this._input.value = value;
  
  return value;
})
.setter("placeholder", function(value){this._input.placeholder = value; return value;})
.getter("readonly", function(value){return this._input.readOnly;})
.setter("readonly", function(value){this._input.readOnly = value; return value;})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Text.prototype.construct = function()
{
  var cname = this.constructor.name;
  if(cname !== Text.name)
  {
    this.classes.add(Text.name);
  }
  this.classes.add(cname);
  
  this._input = document.createElement("textarea");
  this._input.classList.add("input");
  this.node.appendChild(this._input);
  
  this._input.rows = 1;
  this._input.onchange = function()
  {
    this.nextElementSibling.value = this.value; this._value = this.value;
    this.rows = 1;
    this.style.height = "0";
    this.style.height = (this.scrollHeight + 2) + "px";
  };
  this._input.onkeydown = function()
  {
    if(0 < this.scrollHeight)
    {
      this.rows = 1;
      this.style.height = "0";
      this.style.height = (Math.max(30, this.scrollHeight + 2)) + "px";
    }
  };
};

//------------------------------------------------------------------------------
this.Text = Text;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function CSS()
{
  return CSS.Class.construct(this, arguments);
}

Class(CSS)
.inherit(srv.Data)
.compose("node", undefined)
.property("id")
.setter("id", function(value){if(typeof value === "string"){this.node.id = value; return value;} else {throw new TypeError();}})
.property("path")
//.setter("path", function(value){if(typeof value === "string"){this.node.href = "data.read/" + this.source() + "/" + value; return value;} else {throw new TypeError();}})
.setter("path", function(value)
{
  if(typeof value === "string")
  {
    if("/" !== value.charAt(0) && -1 === value.indexOf("://"))
    {
      this.node.href = "/m/data.read/" + this.source() + "/" + value;
//      this.node.href = value;
    }
    else
    {
      this.node.href = value;
    }
    return value;
  }
  else
  {
    throw new TypeError();
  }
})
//.setter("path", function(value){if(typeof value === "string"){this.node.href = "data.read/web.file/" + value; return value;} else {throw new TypeError();}})
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

CSS.prototype.construct = function()
{
  this.node = document.createElement("link");
  
  var node = this.node;
  node.type = "text/css";
  node.rel = "stylesheet";
//  node.href = path;
//  if(typeof id === "string")
//  {
//    node.id = id;
//  }
  document.getElementsByTagName("head")[0].appendChild(node);

};

//------------------------------------------------------------------------------
this.CSS = CSS;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Notifier()
{
  return Notifier.Class.construct(this, arguments);
}

Class(Notifier)
.inherit(log.Log)
//.inherit(log.Logger)
//.instance(true, true, false, true, true)
.property("level", 9)
.properties()
;

//------------------------------------------------------------------------------
// Enums -----------------------------------------------------------------------
//------------------------------------------------------------------------------

Notifier.level = Object.freeze(
{
  OFF: "",
  FATAL: "error",
  ERROR: "error",
  WARN: "warning",
  INFO: "information",
  DEBUG: "information",
  TRACE: "information",
  ALL: "information"
});

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Notifier.prototype.construct = function(module)
{
  Noty.overrideDefaults(
  {
    layout: 'bottomRight', // 'top', 'topLeft', 'topCenter', 'topRight', 'centerLeft', 'center', 'centerRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'bottom'
    theme: 'relax', // 'defaultTheme', 'bootstrapTheme', 'relax'
    type: 'alert', // 'alert', 'success', 'error', 'warning', 'information', 'confirm'
    text: '', // can be html or string
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: 
    {
      open: 'animated bounceInRight', // or Animate.css class names like: 'animated bounceInLeft'
      close: 'animated bounceOutRight', // or Animate.css class names like: 'animated bounceOutLeft'
      easing: 'swing', // not used with Animate.css
      speed: 500 // opening & closing animation speed. Not used with Animate.css
    },
    timeout: 5000, // false, milliseconds -> delay for closing event. Set false for sticky notifications
    progressBar: true, 
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 8, // you can set max visible notification for dismissQueue true option,
    killer: false, // for close all notifications before show
    closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
    callbacks: 
    {
      onShow: function() {},
      afterShow: function() {},
      onClose: function() {},
      afterClose: function() {},
      onCloseClick: function() {}
    },
    buttons: false // an array of buttons
  });
};

//------------------------------------------------------------------------------

//Notifier.prototype.log = function(timestamp, date, time, level, levelString, caller, data)
//{
//  new Noty({type: Notifier.level[levelString], text: data[0].toString()}).show();
//};

//------------------------------------------------------------------------------

Notifier.prototype.log = function(level, levelString, data)
{
  if(level <= this.level())
  {
    Noty.overrideDefaults(
    {
      layout: 'bottomRight', // 'top', 'topLeft', 'topCenter', 'topRight', 'centerLeft', 'center', 'centerRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'bottom'
      theme: 'relax', // 'defaultTheme', 'bootstrapTheme', 'relax'
      type: 'alert', // 'alert', 'success', 'error', 'warning', 'information', 'confirm'
      text: '', // can be html or string
      dismissQueue: true, // If you want to use queue feature set this true
      template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
      animation: 
      {
        open: 'animated bounceInRight', // or Animate.css class names like: 'animated bounceInLeft'
        close: 'animated bounceOutRight', // or Animate.css class names like: 'animated bounceOutLeft'
        easing: 'swing', // not used with Animate.css
        speed: 500 // opening & closing animation speed. Not used with Animate.css
      },
      timeout: 5000, // false, milliseconds -> delay for closing event. Set false for sticky notifications
      progressBar: true, 
      force: false, // adds notification to the beginning of queue when set to true
      modal: false,
      maxVisible: 8, // you can set max visible notification for dismissQueue true option,
      killer: false, // for close all notifications before show
      closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
      callbacks: 
      {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {},
        onCloseClick: function() {}
      },
      buttons: false // an array of buttons
    });
//    var now = new Date();
//    
//    var timestamp = now.getTime();
//    var date = now.toISOString().split("T")[0];
//    var time = now.toTimeString().split(" ")[0];
//    // todo integrate with build time filename and line
//    var caller = (new Error()).stack.split('\n')[3].split(' ')[5];
    
    new Noty({type: Notifier.level[levelString], text: data[0].toString()}).show();
    
    if(data[0] instanceof Error)
    {
      throw data[0];
    }
  }
};

//------------------------------------------------------------------------------

//new mod.Module().path("/m/proxy/https://noty.min.js").context(window).read();

function mNoty()
{

var Element = window.Element;

/* 
  @package NOTY - Dependency-free notification library 
  @version version: 3.2.0-beta 
  @contributors https://github.com/needim/noty/graphs/contributors 
  @documentation Examples and Documentation - https://ned.im/noty 
  @license Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php 
*/

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("Noty",[],e):"object"==typeof exports?exports.Noty=e():t.Noty=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=6)}([function(t,e,n){"use strict";function o(t,e,n){var o=void 0;if(!n){for(o in e)if(e.hasOwnProperty(o)&&e[o]===t)return!0}else for(o in e)if(e.hasOwnProperty(o)&&e[o]===t)return!0;return!1}function i(t){t=t||window.event,void 0!==t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e="noty_"+t+"_";return e+="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0;return("x"===t?e:3&e|8).toString(16)})}function s(t){var e=t.offsetHeight,n=window.getComputedStyle(t);return e+=parseInt(n.marginTop)+parseInt(n.marginBottom)}function u(t,e,n){var o=arguments.length>3&&void 0!==arguments[3]&&arguments[3];e=e.split(" ");for(var i=0;i<e.length;i++)document.addEventListener?t.addEventListener(e[i],n,o):document.attachEvent&&t.attachEvent("on"+e[i],n)}function a(t,e){return("string"==typeof t?t:f(t)).indexOf(" "+e+" ")>=0}function c(t,e){var n=f(t),o=n+e;a(n,e)||(t.className=o.substring(1))}function l(t,e){var n=f(t),o=void 0;a(t,e)&&(o=n.replace(" "+e+" "," "),t.className=o.substring(1,o.length-1))}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function f(t){return(" "+(t&&t.className||"")+" ").replace(/\s+/gi," ")}function h(){function t(){b.PageHidden=document[s],o()}function e(){b.PageHidden=!0,o()}function n(){b.PageHidden=!1,o()}function o(){b.PageHidden?i():r()}function i(){setTimeout(function(){Object.keys(b.Store).forEach(function(t){b.Store.hasOwnProperty(t)&&b.Store[t].options.visibilityControl&&b.Store[t].stop()})},100)}function r(){setTimeout(function(){Object.keys(b.Store).forEach(function(t){b.Store.hasOwnProperty(t)&&b.Store[t].options.visibilityControl&&b.Store[t].resume()}),b.queueRenderAll()},100)}var s=void 0,a=void 0;void 0!==document.hidden?(s="hidden",a="visibilitychange"):void 0!==document.msHidden?(s="msHidden",a="msvisibilitychange"):void 0!==document.webkitHidden&&(s="webkitHidden",a="webkitvisibilitychange"),a&&u(document,a,t),u(window,"blur",e),u(window,"focus",n)}function p(t){if(t.hasSound){var e=document.createElement("audio");t.options.sounds.sources.forEach(function(t){var n=document.createElement("source");n.src=t,n.type="audio/"+m(t),e.appendChild(n)}),t.barDom?t.barDom.appendChild(e):document.querySelector("body").appendChild(e),e.volume=t.options.sounds.volume,t.soundPlayed||(e.play(),t.soundPlayed=!0),e.onended=function(){d(e)}}}function m(t){return t.match(/\.([^.]+)$/)[1]}Object.defineProperty(e,"__esModule",{value:!0}),e.css=e.deepExtend=e.animationEndEvents=void 0;var v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.inArray=o,e.stopPropagation=i,e.generateID=r,e.outerHeight=s,e.addListener=u,e.hasClass=a,e.addClass=c,e.removeClass=l,e.remove=d,e.classList=f,e.visibilityChangeFlow=h,e.createAudioElements=p;var y=n(1),b=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(y);e.animationEndEvents="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",e.deepExtend=function t(e){e=e||{};for(var n=1;n<arguments.length;n++){var o=arguments[n];if(o)for(var i in o)o.hasOwnProperty(i)&&(Array.isArray(o[i])?e[i]=o[i]:"object"===v(o[i])&&null!==o[i]?e[i]=t(e[i],o[i]):e[i]=o[i])}return e},e.css=function(){function t(t){return t.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(t,e){return e.toUpperCase()})}function e(t){var e=document.body.style;if(t in e)return t;for(var n=i.length,o=t.charAt(0).toUpperCase()+t.slice(1),r=void 0;n--;)if((r=i[n]+o)in e)return r;return t}function n(n){return n=t(n),r[n]||(r[n]=e(n))}function o(t,e,o){e=n(e),t.style[e]=o}var i=["Webkit","O","Moz","ms"],r={};return function(t,e){var n=arguments,i=void 0,r=void 0;if(2===n.length)for(i in e)e.hasOwnProperty(i)&&void 0!==(r=e[i])&&e.hasOwnProperty(i)&&o(t,i,r);else o(t,n[1],n[2])}}()},function(t,e,n){"use strict";function o(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"global",e=0,n=x;return E.hasOwnProperty(t)&&(n=E[t].maxVisible,Object.keys(P).forEach(function(n){P[n].options.queue!==t||P[n].closed||e++})),{current:e,maxVisible:n}}function i(t){E.hasOwnProperty(t.options.queue)||(E[t.options.queue]={maxVisible:x,queue:[]}),E[t.options.queue].queue.push(t)}function r(t){if(E.hasOwnProperty(t.options.queue)){var e=[];Object.keys(E[t.options.queue].queue).forEach(function(n){E[t.options.queue].queue[n].id!==t.id&&e.push(E[t.options.queue].queue[n])}),E[t.options.queue].queue=e}}function s(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"global";if(E.hasOwnProperty(t)){var e=E[t].queue.shift();e&&e.show()}}function u(){Object.keys(E).forEach(function(t){s(t)})}function a(t){var e=k.generateID("ghost"),n=document.createElement("div");n.setAttribute("id",e),k.css(n,{height:k.outerHeight(t.barDom)+"px"}),t.barDom.insertAdjacentHTML("afterend",n.outerHTML),k.remove(t.barDom),n=document.getElementById(e),k.addClass(n,"noty_fix_effects_height"),k.addListener(n,k.animationEndEvents,function(){k.remove(n)})}function c(t){m(t);var e='<div class="noty_body">'+t.options.text+"</div>"+d(t)+'<div class="noty_progressbar"></div>';t.barDom=document.createElement("div"),t.barDom.setAttribute("id",t.id),k.addClass(t.barDom,"noty_bar noty_type__"+t.options.type+" noty_theme__"+t.options.theme),t.barDom.innerHTML=e,b(t,"onTemplate")}function l(t){return!(!t.options.buttons||!Object.keys(t.options.buttons).length)}function d(t){if(l(t)){var e=document.createElement("div");return k.addClass(e,"noty_buttons"),Object.keys(t.options.buttons).forEach(function(n){e.appendChild(t.options.buttons[n].dom)}),t.options.buttons.forEach(function(t){e.appendChild(t.dom)}),e.outerHTML}return""}function f(t){t.options.modal&&(0===C&&p(),e.DocModalCount=C+=1)}function h(t){if(t.options.modal&&C>0&&(e.DocModalCount=C-=1,C<=0)){var n=document.querySelector(".noty_modal");n&&(k.removeClass(n,"noty_modal_open"),k.addClass(n,"noty_modal_close"),k.addListener(n,k.animationEndEvents,function(){k.remove(n)}))}}function p(){var t=document.querySelector("body"),e=document.createElement("div");k.addClass(e,"noty_modal"),t.insertBefore(e,t.firstChild),k.addClass(e,"noty_modal_open"),k.addListener(e,k.animationEndEvents,function(){k.removeClass(e,"noty_modal_open")})}function m(t){if(t.options.container)return void(t.layoutDom=document.querySelector(t.options.container));var e="noty_layout__"+t.options.layout;t.layoutDom=document.querySelector("div#"+e),t.layoutDom||(t.layoutDom=document.createElement("div"),t.layoutDom.setAttribute("id",e),t.layoutDom.setAttribute("role","alert"),t.layoutDom.setAttribute("aria-live","polite"),k.addClass(t.layoutDom,"noty_layout"),document.querySelector("body").appendChild(t.layoutDom))}function v(t){t.options.timeout&&(t.options.progressBar&&t.progressDom&&k.css(t.progressDom,{transition:"width "+t.options.timeout+"ms linear",width:"0%"}),clearTimeout(t.closeTimer),t.closeTimer=setTimeout(function(){t.close()},t.options.timeout))}function y(t){t.options.timeout&&t.closeTimer&&(clearTimeout(t.closeTimer),t.closeTimer=-1,t.options.progressBar&&t.progressDom&&k.css(t.progressDom,{transition:"width 0ms linear",width:"100%"}))}function b(t,e){t.listeners.hasOwnProperty(e)&&t.listeners[e].forEach(function(e){"function"==typeof e&&e.apply(t)})}function w(t){b(t,"afterShow"),v(t),k.addListener(t.barDom,"mouseenter",function(){y(t)}),k.addListener(t.barDom,"mouseleave",function(){v(t)})}function g(t){delete P[t.id],t.closing=!1,b(t,"afterClose"),k.remove(t.barDom),0!==t.layoutDom.querySelectorAll(".noty_bar").length||t.options.container||k.remove(t.layoutDom),(k.inArray("docVisible",t.options.titleCount.conditions)||k.inArray("docHidden",t.options.titleCount.conditions))&&D.decrement(),s(t.options.queue)}Object.defineProperty(e,"__esModule",{value:!0}),e.Defaults=e.Store=e.Queues=e.DefaultMaxVisible=e.docTitle=e.DocModalCount=e.PageHidden=void 0,e.getQueueCounts=o,e.addToQueue=i,e.removeFromQueue=r,e.queueRender=s,e.queueRenderAll=u,e.ghostFix=a,e.build=c,e.hasButtons=l,e.handleModal=f,e.handleModalClose=h,e.queueClose=v,e.dequeueClose=y,e.fire=b,e.openFlow=w,e.closeFlow=g;var _=n(0),k=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(_),C=(e.PageHidden=!1,e.DocModalCount=0),S={originalTitle:null,count:0,changed:!1,timer:-1},D=e.docTitle={increment:function(){S.count++,D._update()},decrement:function(){if(--S.count<=0)return void D._clear();D._update()},_update:function(){var t=document.title;S.changed?document.title="("+S.count+") "+S.originalTitle:(S.originalTitle=t,document.title="("+S.count+") "+t,S.changed=!0)},_clear:function(){S.changed&&(S.count=0,document.title=S.originalTitle,S.changed=!1)}},x=e.DefaultMaxVisible=5,E=e.Queues={global:{maxVisible:x,queue:[]}},P=e.Store={};e.Defaults={type:"alert",layout:"topRight",theme:"mint",text:"",timeout:!1,progressBar:!0,closeWith:["click"],animation:{open:"noty_effects_open",close:"noty_effects_close"},id:!1,force:!1,killer:!1,queue:"global",container:!1,buttons:[],callbacks:{beforeShow:null,onShow:null,afterShow:null,onClose:null,afterClose:null,onClick:null,onHover:null,onTemplate:null},sounds:{sources:[],volume:1,conditions:[]},titleCount:{conditions:[]},modal:!1,visibilityControl:!1}},function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0}),e.NotyButton=void 0;var i=n(0),r=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(i);e.NotyButton=function t(e,n,i){var s=this,u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};return o(this,t),this.dom=document.createElement("button"),this.dom.innerHTML=e,this.id=u.id=u.id||r.generateID("button"),this.cb=i,Object.keys(u).forEach(function(t){s.dom.setAttribute(t,u[t])}),r.addClass(this.dom,n||"noty_btn"),this}},function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}();e.Push=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/service-worker.js";return o(this,t),this.subData={},this.workerPath=e,this.listeners={onPermissionGranted:[],onPermissionDenied:[],onSubscriptionSuccess:[],onSubscriptionCancel:[],onWorkerError:[],onWorkerSuccess:[],onWorkerNotSupported:[]},this}return i(t,[{key:"on",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};return"function"==typeof e&&this.listeners.hasOwnProperty(t)&&this.listeners[t].push(e),this}},{key:"fire",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];this.listeners.hasOwnProperty(t)&&this.listeners[t].forEach(function(t){"function"==typeof t&&t.apply(e,n)})}},{key:"create",value:function(){console.log("NOT IMPLEMENTED YET")}},{key:"isSupported",value:function(){var t=!1;try{t=window.Notification||window.webkitNotifications||navigator.mozNotification||window.external&&void 0!==window.external.msIsSiteMode()}catch(t){}return t}},{key:"getPermissionStatus",value:function(){var t="default";if(window.Notification&&window.Notification.permissionLevel)t=window.Notification.permissionLevel;else if(window.webkitNotifications&&window.webkitNotifications.checkPermission)switch(window.webkitNotifications.checkPermission()){case 1:t="default";break;case 0:t="granted";break;default:t="denied"}else window.Notification&&window.Notification.permission?t=window.Notification.permission:navigator.mozNotification?t="granted":window.external&&void 0!==window.external.msIsSiteMode()&&(t=window.external.msIsSiteMode()?"granted":"default");return t.toString().toLowerCase()}},{key:"getEndpoint",value:function(t){var e=t.endpoint,n=t.subscriptionId;return n&&-1===e.indexOf(n)&&(e+="/"+n),e}},{key:"isSWRegistered",value:function(){try{return"activated"===navigator.serviceWorker.controller.state}catch(t){return!1}}},{key:"unregisterWorker",value:function(){var t=this;"serviceWorker"in navigator&&navigator.serviceWorker.getRegistrations().then(function(e){var n=!0,o=!1,i=void 0;try{for(var r,s=e[Symbol.iterator]();!(n=(r=s.next()).done);n=!0){r.value.unregister(),t.fire("onSubscriptionCancel")}}catch(t){o=!0,i=t}finally{try{!n&&s.return&&s.return()}finally{if(o)throw i}}})}},{key:"requestSubscription",value:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],n=this,o=this.getPermissionStatus(),i=function(o){"granted"===o?(t.fire("onPermissionGranted"),"serviceWorker"in navigator?navigator.serviceWorker.register(t.workerPath).then(function(){navigator.serviceWorker.ready.then(function(t){n.fire("onWorkerSuccess"),t.pushManager.subscribe({userVisibleOnly:e}).then(function(t){var e=t.getKey("p256dh"),o=t.getKey("auth");n.subData={endpoint:n.getEndpoint(t),p256dh:e?window.btoa(String.fromCharCode.apply(null,new Uint8Array(e))):null,auth:o?window.btoa(String.fromCharCode.apply(null,new Uint8Array(o))):null},n.fire("onSubscriptionSuccess",[n.subData])}).catch(function(t){n.fire("onWorkerError",[t])})})}):n.fire("onWorkerNotSupported")):"denied"===o&&(t.fire("onPermissionDenied"),t.unregisterWorker())};"default"===o?window.Notification&&window.Notification.requestPermission?window.Notification.requestPermission(i):window.webkitNotifications&&window.webkitNotifications.checkPermission&&window.webkitNotifications.requestPermission(i):i(o)}}]),t}()},function(t,e,n){(function(e,o){/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */
!function(e,n){t.exports=n()}(0,function(){"use strict";function t(t){var e=typeof t;return null!==t&&("object"===e||"function"===e)}function i(t){return"function"==typeof t}function r(t){z=t}function s(t){U=t}function u(){return void 0!==R?function(){R(c)}:a()}function a(){var t=setTimeout;return function(){return t(c,1)}}function c(){for(var t=0;t<I;t+=2){(0,X[t])(X[t+1]),X[t]=void 0,X[t+1]=void 0}I=0}function l(t,e){var n=arguments,o=this,i=new this.constructor(f);void 0===i[tt]&&A(i);var r=o._state;return r?function(){var t=n[r-1];U(function(){return P(r,i,t,o._result)})}():S(o,i,t,e),i}function d(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(f);return g(n,t),n}function f(){}function h(){return new TypeError("You cannot resolve a promise with itself")}function p(){return new TypeError("A promises callback cannot return that same promise.")}function m(t){try{return t.then}catch(t){return it.error=t,it}}function v(t,e,n,o){try{t.call(e,n,o)}catch(t){return t}}function y(t,e,n){U(function(t){var o=!1,i=v(n,e,function(n){o||(o=!0,e!==n?g(t,n):k(t,n))},function(e){o||(o=!0,C(t,e))},"Settle: "+(t._label||" unknown promise"));!o&&i&&(o=!0,C(t,i))},t)}function b(t,e){e._state===nt?k(t,e._result):e._state===ot?C(t,e._result):S(e,void 0,function(e){return g(t,e)},function(e){return C(t,e)})}function w(t,e,n){e.constructor===t.constructor&&n===l&&e.constructor.resolve===d?b(t,e):n===it?(C(t,it.error),it.error=null):void 0===n?k(t,e):i(n)?y(t,e,n):k(t,e)}function g(e,n){e===n?C(e,h()):t(n)?w(e,n,m(n)):k(e,n)}function _(t){t._onerror&&t._onerror(t._result),D(t)}function k(t,e){t._state===et&&(t._result=e,t._state=nt,0!==t._subscribers.length&&U(D,t))}function C(t,e){t._state===et&&(t._state=ot,t._result=e,U(_,t))}function S(t,e,n,o){var i=t._subscribers,r=i.length;t._onerror=null,i[r]=e,i[r+nt]=n,i[r+ot]=o,0===r&&t._state&&U(D,t)}function D(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var o=void 0,i=void 0,r=t._result,s=0;s<e.length;s+=3)o=e[s],i=e[s+n],o?P(n,o,i,r):i(r);t._subscribers.length=0}}function x(){this.error=null}function E(t,e){try{return t(e)}catch(t){return rt.error=t,rt}}function P(t,e,n,o){var r=i(n),s=void 0,u=void 0,a=void 0,c=void 0;if(r){if(s=E(n,o),s===rt?(c=!0,u=s.error,s.error=null):a=!0,e===s)return void C(e,p())}else s=o,a=!0;e._state!==et||(r&&a?g(e,s):c?C(e,u):t===nt?k(e,s):t===ot&&C(e,s))}function T(t,e){try{e(function(e){g(t,e)},function(e){C(t,e)})}catch(e){C(t,e)}}function O(){return st++}function A(t){t[tt]=st++,t._state=void 0,t._result=void 0,t._subscribers=[]}function M(t,e){this._instanceConstructor=t,this.promise=new t(f),this.promise[tt]||A(this.promise),F(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?k(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&k(this.promise,this._result))):C(this.promise,q())}function q(){return new Error("Array Methods must be provided an Array")}function j(t){return new M(this,t).promise}function N(t){var e=this;return new e(F(t)?function(n,o){for(var i=t.length,r=0;r<i;r++)e.resolve(t[r]).then(n,o)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function L(t){var e=this,n=new e(f);return C(n,t),n}function H(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function W(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function Q(t){this[tt]=O(),this._result=this._state=void 0,this._subscribers=[],f!==t&&("function"!=typeof t&&H(),this instanceof Q?T(this,t):W())}function V(){var t=void 0;if(void 0!==o)t=o;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var n=null;try{n=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===n&&!e.cast)return}t.Promise=Q}var B=void 0;B=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var F=B,I=0,R=void 0,z=void 0,U=function(t,e){X[I]=t,X[I+1]=e,2===(I+=2)&&(z?z(c):Z())},Y="undefined"!=typeof window?window:void 0,K=Y||{},G=K.MutationObserver||K.WebKitMutationObserver,$="undefined"==typeof self&&void 0!==e&&"[object process]"==={}.toString.call(e),J="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,X=new Array(1e3),Z=void 0;Z=$?function(){return function(){return e.nextTick(c)}}():G?function(){var t=0,e=new G(c),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}():J?function(){var t=new MessageChannel;return t.port1.onmessage=c,function(){return t.port2.postMessage(0)}}():void 0===Y?function(){try{var t=n(9);return R=t.runOnLoop||t.runOnContext,u()}catch(t){return a()}}():a();var tt=Math.random().toString(36).substring(16),et=void 0,nt=1,ot=2,it=new x,rt=new x,st=0;return M.prototype._enumerate=function(t){for(var e=0;this._state===et&&e<t.length;e++)this._eachEntry(t[e],e)},M.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,o=n.resolve;if(o===d){var i=m(t);if(i===l&&t._state!==et)this._settledAt(t._state,e,t._result);else if("function"!=typeof i)this._remaining--,this._result[e]=t;else if(n===Q){var r=new n(f);w(r,t,i),this._willSettleAt(r,e)}else this._willSettleAt(new n(function(e){return e(t)}),e)}else this._willSettleAt(o(t),e)},M.prototype._settledAt=function(t,e,n){var o=this.promise;o._state===et&&(this._remaining--,t===ot?C(o,n):this._result[e]=n),0===this._remaining&&k(o,this._result)},M.prototype._willSettleAt=function(t,e){var n=this;S(t,void 0,function(t){return n._settledAt(nt,e,t)},function(t){return n._settledAt(ot,e,t)})},Q.all=j,Q.race=N,Q.resolve=d,Q.reject=L,Q._setScheduler=r,Q._setAsap=s,Q._asap=U,Q.prototype={constructor:Q,then:l,catch:function(t){return this.then(null,t)}},Q.polyfill=V,Q.Promise=Q,Q})}).call(e,n(7),n(8))},function(t,e){},function(t,e,n){"use strict";function o(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}();n(5);var s=n(4),u=function(t){return t&&t.__esModule?t:{default:t}}(s),a=n(0),c=o(a),l=n(1),d=o(l),f=n(2),h=n(3),p=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return i(this,t),this.options=c.deepExtend({},d.Defaults,e),d.Store[this.options.id]?d.Store[this.options.id]:(this.id=this.options.id||c.generateID("bar"),this.closeTimer=-1,this.barDom=null,this.layoutDom=null,this.progressDom=null,this.showing=!1,this.shown=!1,this.closed=!1,this.closing=!1,this.killable=this.options.timeout||this.options.closeWith.length>0,this.hasSound=this.options.sounds.sources.length>0,this.soundPlayed=!1,this.listeners={beforeShow:[],onShow:[],afterShow:[],onClose:[],afterClose:[],onClick:[],onHover:[],onTemplate:[]},this.promises={show:null,close:null},this.on("beforeShow",this.options.callbacks.beforeShow),this.on("onShow",this.options.callbacks.onShow),this.on("afterShow",this.options.callbacks.afterShow),this.on("onClose",this.options.callbacks.onClose),this.on("afterClose",this.options.callbacks.afterClose),this.on("onClick",this.options.callbacks.onClick),this.on("onHover",this.options.callbacks.onHover),this.on("onTemplate",this.options.callbacks.onTemplate),this)}return r(t,[{key:"on",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};return"function"==typeof e&&this.listeners.hasOwnProperty(t)&&this.listeners[t].push(e),this}},{key:"show",value:function(){var e=this;if(this.showing||this.shown)return this;!0===this.options.killer?t.closeAll():"string"==typeof this.options.killer&&t.closeAll(this.options.killer);var n=d.getQueueCounts(this.options.queue);if(n.current>=n.maxVisible||d.PageHidden&&this.options.visibilityControl)return d.addToQueue(this),d.PageHidden&&this.hasSound&&c.inArray("docHidden",this.options.sounds.conditions)&&c.createAudioElements(this),d.PageHidden&&c.inArray("docHidden",this.options.titleCount.conditions)&&d.docTitle.increment(),this;if(d.Store[this.id]=this,d.fire(this,"beforeShow"),this.showing=!0,this.closing)return this.showing=!1,this;if(d.build(this),d.handleModal(this),this.options.force?this.layoutDom.insertBefore(this.barDom,this.layoutDom.firstChild):this.layoutDom.appendChild(this.barDom),this.hasSound&&!this.soundPlayed&&c.inArray("docVisible",this.options.sounds.conditions)&&c.createAudioElements(this),c.inArray("docVisible",this.options.titleCount.conditions)&&d.docTitle.increment(),this.shown=!0,this.closed=!1,d.hasButtons(this)&&Object.keys(this.options.buttons).forEach(function(t){var n=e.barDom.querySelector("#"+e.options.buttons[t].id);c.addListener(n,"click",function(n){c.stopPropagation(n),e.options.buttons[t].cb(e)})}),this.progressDom=this.barDom.querySelector(".noty_progressbar"),c.inArray("click",this.options.closeWith)&&(c.addClass(this.barDom,"noty_close_with_click"),c.addListener(this.barDom,"click",function(t){c.stopPropagation(t),d.fire(e,"onClick"),e.close()},!1)),c.addListener(this.barDom,"mouseenter",function(){d.fire(e,"onHover")},!1),this.options.timeout&&c.addClass(this.barDom,"noty_has_timeout"),this.options.progressBar&&c.addClass(this.barDom,"noty_has_progressbar"),c.inArray("button",this.options.closeWith)){c.addClass(this.barDom,"noty_close_with_button");var o=document.createElement("div");c.addClass(o,"noty_close_button"),o.innerHTML="×",this.barDom.appendChild(o),c.addListener(o,"click",function(t){c.stopPropagation(t),e.close()},!1)}return d.fire(this,"onShow"),null===this.options.animation.open?this.promises.show=new u.default(function(t){t()}):"function"==typeof this.options.animation.open?this.promises.show=new u.default(this.options.animation.open.bind(this)):(c.addClass(this.barDom,this.options.animation.open),this.promises.show=new u.default(function(t){c.addListener(e.barDom,c.animationEndEvents,function(){c.removeClass(e.barDom,e.options.animation.open),t()})})),this.promises.show.then(function(){var t=e;setTimeout(function(){d.openFlow(t)},100)}),this}},{key:"stop",value:function(){return d.dequeueClose(this),this}},{key:"resume",value:function(){return d.queueClose(this),this}},{key:"setTimeout",value:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){if(this.stop(),this.options.timeout=t,this.barDom){this.options.timeout?c.addClass(this.barDom,"noty_has_timeout"):c.removeClass(this.barDom,"noty_has_timeout");var e=this;setTimeout(function(){e.resume()},100)}return this})},{key:"setText",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this.barDom&&(this.barDom.querySelector(".noty_body").innerHTML=t),e&&(this.options.text=t),this}},{key:"setType",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this.barDom){c.classList(this.barDom).split(" ").forEach(function(t){"noty_type__"===t.substring(0,11)&&c.removeClass(e.barDom,t)}),c.addClass(this.barDom,"noty_type__"+t)}return n&&(this.options.type=t),this}},{key:"setTheme",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this.barDom){c.classList(this.barDom).split(" ").forEach(function(t){"noty_theme__"===t.substring(0,12)&&c.removeClass(e.barDom,t)}),c.addClass(this.barDom,"noty_theme__"+t)}return n&&(this.options.theme=t),this}},{key:"close",value:function(){var t=this;return this.closed?this:this.shown?(d.fire(this,"onClose"),this.closing=!0,null===this.options.animation.close||!1===this.options.animation.close?this.promises.close=new u.default(function(t){t()}):"function"==typeof this.options.animation.close?this.promises.close=new u.default(this.options.animation.close.bind(this)):(c.addClass(this.barDom,this.options.animation.close),this.promises.close=new u.default(function(e){c.addListener(t.barDom,c.animationEndEvents,function(){t.options.force?c.remove(t.barDom):d.ghostFix(t),e()})})),this.promises.close.then(function(){d.closeFlow(t),d.handleModalClose(t)}),this.closed=!0,this):(d.removeFromQueue(this),this)}}],[{key:"closeAll",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return Object.keys(d.Store).forEach(function(e){t?d.Store[e].options.queue===t&&d.Store[e].killable&&d.Store[e].close():d.Store[e].killable&&d.Store[e].close()}),this}},{key:"clearQueue",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"global";return d.Queues.hasOwnProperty(t)&&(d.Queues[t].queue=[]),this}},{key:"overrideDefaults",value:function(t){return d.Defaults=c.deepExtend({},d.Defaults,t),this}},{key:"setMaxVisible",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d.DefaultMaxVisible,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"global";return d.Queues.hasOwnProperty(e)||(d.Queues[e]={maxVisible:t,queue:[]}),d.Queues[e].maxVisible=t,this}},{key:"button",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments[2],o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};return new f.NotyButton(t,e,n,o)}},{key:"version",value:function(){return"3.2.0-beta"}},{key:"Push",value:function(t){return new h.Push(t)}},{key:"Queues",get:function(){return d.Queues}},{key:"PageHidden",get:function(){return d.PageHidden}}]),t}();e.default=p,"undefined"!=typeof window&&c.visibilityChangeFlow(),t.exports=e.default},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(t){if(l===setTimeout)return setTimeout(t,0);if((l===n||!l)&&setTimeout)return l=setTimeout,setTimeout(t,0);try{return l(t,0)}catch(e){try{return l.call(null,t,0)}catch(e){return l.call(this,t,0)}}}function r(t){if(d===clearTimeout)return clearTimeout(t);if((d===o||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(t);try{return d(t)}catch(e){try{return d.call(null,t)}catch(e){return d.call(this,t)}}}function s(){m&&h&&(m=!1,h.length?p=h.concat(p):v=-1,p.length&&u())}function u(){if(!m){var t=i(s);m=!0;for(var e=p.length;e;){for(h=p,p=[];++v<e;)h&&h[v].run();v=-1,e=p.length}h=null,m=!1,r(t)}}function a(t,e){this.fun=t,this.array=e}function c(){}var l,d,f=t.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:n}catch(t){l=n}try{d="function"==typeof clearTimeout?clearTimeout:o}catch(t){d=o}}();var h,p=[],m=!1,v=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];p.push(new a(t,e)),1!==p.length||m||i(u)},a.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=c,f.addListener=c,f.once=c,f.off=c,f.removeListener=c,f.removeAllListeners=c,f.emit=c,f.prependListener=c,f.prependOnceListener=c,f.listeners=function(t){return[]},f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e){}])});

window.Noty = Noty;

}

mNoty.call(window);

//------------------------------------------------------------------------------
this.Notifier = Notifier;
//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function File()
{
  return File.Class.construct(this, arguments);
}

Class(File)
.inherit(ElementConfInputStore)
.property("path", "")
.property("conf", {locale: "en"})
.event("ConfChanged", function(value, prev)
{
  this.rebuild();
})
.property("text", "Upload")
.property("accept")
.setter("accept", function(value)
{
  this._input.accept = value;
  
  return value;
})
.property("multiple")
.setter("multiple", function(value)
{
  if(value === true)
  {
    this._input.setAttribute("multiple", "");
  }
  else
  {
    this._input.removeAttribute("multiple");
  }
  
  return value;
})
.property("auto")
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

File.prototype.construct = function()
{
  this.rebuild();
};

//------------------------------------------------------------------------------

File.prototype.update = function()
{
//  this.rebuild();
};

//------------------------------------------------------------------------------

File.prototype.rebuild = function()
{
  console.log("rebuild");
  
  this.html("");
  
  this._label = document.createElement("label");
  this._label.style.display = "none";
  this.node.appendChild(this._label);
  this.label(this.label());
  
  this._file = document.createElement("label");
  this._file.classList.add("button");
  this._file.classList.add("upload");
  this._file.innerText = this.text();
  this.node.appendChild(this._file);
  
  this._icon = document.createElement("i");
  this._file.appendChild(this._icon);
  
  this._hidden = document.createElement("div");
  this._file.appendChild(this._hidden);
  
  this._input = document.createElement("input");
  this._input.type = "file";
  this._hidden.appendChild(this._input);
  
  this._break = document.createElement("div");
  this._break.classList.add("flex-break-row");
  this.node.appendChild(this._break);
  
  this._empty = document.createElement("div");
  this._empty.classList.add("empty");
  this.node.appendChild(this._empty);
  
  this._list = document.createElement("div");
//  this._list.classList.add("upload");
  this._list.classList.add("list");
  this.node.appendChild(this._list);
  
//  this.input.accept = "image/png, image/jpeg, image/gif";
//  this._node.onclick = function(){this.nextElementSibling.click();};
//  this._hidden.onchange = function(){_this.fileUpload(this.files[0]);};
  var _this = this;
  this._input.onchange = function()
  {
    _this.filesUpload(this.files);
    this.value = "";
  };
};

//------------------------------------------------------------------------------

File.prototype.filesUpload = function(files)
{
  console.log(files);
  
  for(var i = 0; i < files.length; i++)
  {
    console.log(files[i]);
    
    this.fileUploadButton(files[i]);
  }
};

//------------------------------------------------------------------------------

File.prototype.fileUploadButton = function(file)
{
  var _this = this;
  
  var thumbnail = document.createElement("div");
  thumbnail.classList.add("thumbnail");
  this._list.appendChild(thumbnail);
  
  var cancel = document.createElement("i");
  cancel.classList.add("button");
  cancel.classList.add("icon");
  cancel.classList.add("cancel");
  cancel.classList.add("icon-cancel");
  cancel.addEventListener("click", function()
  {
    // todo probably a confirm dialog would be appropriated
    _this._list.removeChild(thumbnail);
  });
  thumbnail.appendChild(cancel);
  
  var label = document.createElement("label");
  label.classList.add("name");
  label.innerText = file.name;
  thumbnail.appendChild(label);
  
  var upload = document.createElement("i");
  upload.classList.add("button");
  upload.classList.add("icon");
  upload.classList.add("upload");
  upload.classList.add("icon-upload-cloud");
  upload.addEventListener("click", function()
  {
    _this.fileUpload(file, uploadSuccessCallback, uploadProgressCallback, uploadErrorCallback);
  });
  thumbnail.appendChild(upload);
  
  var uploadSuccessCallback = function(file)
  {
    console.log("uploadSuccessCallback");
    // clear/destroy thumbnail div and create download button passing the file-data-service-object and thumbnail div to be reused
    thumbnail.innerHTML = "";
    _this.fileDownloadButton(file, thumbnail);
  };
  
  var uploadProgressCallback = function(progress)
  {
    console.log("uploadProgressCallback", progress);
  };
  
  var uploadErrorCallback = function()
  {
    console.log("uploadErrorCallback");
  };
  
  if(this.auto() === true)
  {
    this.fileUpload(file, uploadSuccessCallback, uploadProgressCallback, uploadErrorCallback);
  }
};

//------------------------------------------------------------------------------

File.prototype.fileUpload = function(file, uploadSuccessCallback, uploadProgressCallback, uploadErrorCallback)
{
  var name = new Date().getTime() + "_" + Math.random().toString().substring(2);
  var path = this.path() + "/" + name;
  var dir = path.replace(/\/[^\/]*$/g, "");
console.log(path, dir);
  
  var fd = new FormData();
  fd.append("data", file, "");
  new m.store.Store().path(path).params(fd)
  .send(function(computable, loaded, total)
  {
    if(computable)
    {
      uploadProgressCallback(loaded / total);
    }
  })
  .success(function()
  {
    uploadSuccessCallback(this);
  })
  .error(uploadErrorCallback)
  .command("write")
  .exec();
};

//------------------------------------------------------------------------------

File.prototype.fileUpload___ = function(file, uploadSuccessCallback, uploadProgressCallback, uploadErrorCallback)
{
//  var name = new Date().toISOString().replace(/[-T:]/g, "/") + "_" + Math.random().toString().substring(2);
  var name = new Date().getTime() + "_" + Math.random().toString().substring(2);
//  var path = "file/.tmp/" + value;
//  var path = this.path() + "/" + name;
  var path = this.path().replace("read", "write") + "/" + name;
  var dir = path.replace(/\/[^\/]*$/g, "");
  console.log(path, dir);
  
  var _this = this;
  
  var fufunc = function()
  {
    var fd = new FormData();
    fd.append("data", file, "");
    new m.service.Data().source("web.data.file").path(path).params(fd)
    .send(function(computable, loaded, total)
    {
//      console.log("file creation send", arguments, computable, loaded, total);
      if(computable)
      {
        uploadProgressCallback(loaded / total);
      }
    })
    .success(function(){uploadSuccessCallback(this);})
    .error(uploadErrorCallback)
    .create();
  };
  
  fufunc();
  
//  new m.service.Data().source("web.data.dir").path(dir)
//  .success(function()
//  {
//    console.log("dir creation success");
//    fufunc();
//  })
//  .error(function()
//  {
//    console.log("dir creation error");
//    // todo warn and add remove mini button
//  })
//  .write();
  
//  new m.service.Data().source("web.data.dir").path(dir)
//  .success(function()
//  {
//    console.log("dir creation success");
//    fufunc();
//  })
//  .error(function()
//  {
//    console.log("dir creation error");
//    fufunc();
//  })
//  .create();
};

//------------------------------------------------------------------------------

File.prototype.fileDownloadButton = function(fileService, elem)
{
  var _this = this;
  
  var thumbnail = elem;
  if(typeof thumbnail === "undefined")
  {
    thumbnail = document.createElement("div");
    thumbnail.classList.add("thumbnail");
    this._list.appendChild(thumbnail);
  }
  else
  {
    thumbnail.innerHTML = "";
  }
  
  var remove = document.createElement("i");
  remove.classList.add("button");
  remove.classList.add("icon");
  remove.classList.add("delete");
  remove.classList.add("icon-cancel");
  remove.addEventListener("click", function()
  {
    // todo probably a confirm dialog would be appropriated
    fileService.params({destroy: true}).destroy();
    _this._list.removeChild(thumbnail);
  });
  thumbnail.appendChild(remove);
  
  var label = document.createElement("label");
  label.classList.add("name");
  label.innerText = fileService.path().replace(/.*\//g, "");
  thumbnail.appendChild(label);
  
  var download = document.createElement("i");
  download.classList.add("button");
  download.classList.add("icon");
  download.classList.add("download");
  download.classList.add("icon-download-cloud");
  download.addEventListener("click", function()
  {
//    window.open(file.path());
    a.click();
  });
  var a = document.createElement("a");
  // todo get proper file name or at least real file id/hash
  a.setAttribute("download", fileService.path().replace(/.*\//g, ""));
  a.href = fileService.path().replace("write", "read");
  download.appendChild(a);
  thumbnail.appendChild(download);
};

//------------------------------------------------------------------------------
this.File = File;

return this;

}.call(ui));

m.global = {};
m.g = m.global;

//global = m.g;
g = m.g;

m.global.log = m.log.Log();
m.global.log.add(new m.log.LoggerConsoleSimple());
//m.global.log.add(new m.log.LoggerConsoleTrace());
//m.global.log.level(m.log.Log.level.ALL);
//m.global.log.level(m.log.Log.level.OFF);
m.global.log.level(m.log.Log.level.WARN);
//m.global.log.level(m.env.log.level);

//m.global.queue = new mod.Queue();
//m.global.conf = new conf.Configuration();
//m.global.lang = new conf.Language();

//m.global.environment = m.util.environment();
//m.sys[m.global.environment].init();

if(typeof this.root === "undefined" || this.root === null)
{
//  if(document.currentScript === null || (document.currentScript !== null && document.currentScript.src === ""))
  if(document.currentScript === null)
  {
    this.root = location.pathname;
  }
  else
  {
    this.root = document.currentScript.src.replace(location.origin, "").replace(new RegExp("\/([^/]+)$"), "");
    this.path = document.currentScript.src.replace(location.origin, "");
  }
}

//------------------------------------------------------------------------------
// Functions -------------------------------------------------------------------
//------------------------------------------------------------------------------

function changeStyle(value, prev)
{
  var css_layout = document.getElementById("css_layout");
  var css_style = document.getElementById("css_style");
  
  new m.ui.CSS().id("css_layout").path(this.root + "/style/" + value + "/layout.css");
  new m.ui.CSS().id("css_style").path(this.root + "/style/" + value + "/style.css");
  
  if(css_layout !== null)
  {
    css_layout.parentNode.removeChild(css_layout);
  }
  
  if(css_style !== null)
  {
    css_style.parentNode.removeChild(css_style);
  }
}

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

/*

var app = new m.App(this);
or
var app = m(this);
or
var app = m(); -> NO! not working in strict mode

scopes:
global: log, noti, session
app: conf, queue
both overlayed: lang -> first look into lang of app, then into global lang

m.js is the minimal prerequisite, then m allow dynamic loading of everything: libs and css by javascript-inject or java-service
NB each app is standalone, but new m.App(this) is responsible of returning correct objects (global shared if in a multi app system)
eg parent of iframe or window for multiple divs
App has internally a session manager / login shell with default handling that can be overloaded by an external auth-app

some classes like File/Store/Node depend on engine: on browser they are internally services, on nodejs/electron they are api

an auth-app overrides all Service events related to auth (challenge, qr-code, credentials, lot, pin, etc.) and must match with auth-srv
app-srv injects: m.js, proper auth-app (for specific server authn), conf.json bound to session profile
App, based on preloaded conf provided by server, initializes log level, logger and additional lang (App autoloads lang from parent app if exists)
then, main code is executed
if server can preload everything (conf and lang), then main code can start sequentially, otherwise should be enclosed into closure/function and 
called as callback, but the latter is not desirable for clarity and performance because of many async requests vs sync load

thus server must be able to provide correct lang. while conf by session-profile is easy by using a service that translates "home" path to 
specific user, lang requires specific treatment??? maybe not if using home translation plus symlinking specific lang file???
NB still App is responsible for importing parent app lang, because app containers is entirely managed by client side js

main code is plain js not enclosed into anything executed straightforward and receives: m.js lib and app object

app-conf.json by profile (still not easy): app has different confs with own unrelated names, server must translate abstract generic path to one of these
-> need srv capability to: translate paths based on profile/current-session-lot or simply current session
NB all different app-confs maybe still fully available to anyone iff: do not contain "sensitive" information and resources are filtered by authz

thus authz: translates commands (urls-path) and then authorizes -> same authz but stacked with a translator (same with map-tree)
NB translator after authz is much more easy for conf maintaining, but potentially insecure by accidental misconfiguration, 
while translator before authz, guarrantees perfect security, but requires to explicitly authorize translated path
difference is: authz+tran -> i can change tran path without changing authz path, tran+auth -> if a change tran path, then i must change authz path too

last: conf and lang loaded by init with main function callback + url translation not needed because app creates specific url with profile

authn flow:
App-class listen service events to call authn, App-class provide method to call authn-ui
app-main creates a button to call authn-ui via App-method manually, or at start, or in any other case. app can also use authn api directly
App has a default url for authn, but configurable
App initializes differently for generic app and for authn apps by autodetection
App provides every app (generic and authn) method to invoke authn app or main app to allow main and authn to give control each other
main-app and authn-app can register callbacks for event of receiving control

authn can be a menu-app that is an abstract ui-control that has events clear-all and add/remove and works on a given path, rendering is custom
while generic apps can have a common subclass of menu-app, for authn should be optimized on authn

*/

function App()
{
  return App.Class.construct(this, arguments);
}

Class(App)
.inherit(srv.App)
.compose("authn", new srv.Authentication())
.compose("root", "")
.compose("context", "")
.compose("session", {})
.compose("ui", {})
.compose("styles", [])
.compose("log", log.Log())
.compose("conf", new conf.Configuration())
.compose("lang", new conf.Language())
.compose("queue", new mod.Queue())
.compose("noti", new ui.Notifier())
//.compose("elems", {})
//.compose("list", [])
//.compose("mapStore", function()
//{
//  var _this = this;
//  var store = new store.Store();
//  Class.listener(store, "data", function(value, prev){_this.map(value);});
//  
//  return store;
//})
.event("AuthenticationChanged", function(value, prev)
{
  location.href = location.href;
//  this.rebuild();
})
.property("style", "default")
.listener("style", changeStyle)
//.property("value")
//.getter("value", function(value){return this.get(this.elems);})
//.setter("value", function(value){return this.set(value);})
//.listener("value", function(value, prev){this.update();})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

App.prototype.construct = function()
{
  var _this = this;
//  m.srv.Service.prototype.eventServiceUnauthorized = App.prototype.eventServiceUnauthorized;
//  m.srv.Service.prototype.eventServiceForbidden = App.prototype.eventServiceForbidden;
  srv.Service.prototype.eventServiceUnauthorized = function(){_this.eventServiceUnauthorized.apply(_this, arguments)};
  srv.Service.prototype.eventServiceForbidden = function(){_this.eventServiceForbidden.apply(_this, arguments)};
  
  window.app = this;
  
//  this.log = m.log.Log();
  this.log.add(new m.log.LoggerConsoleSimple());
  
//  this.queue = new mod.Queue();
  
//  this.conf = new conf.Configuration();
  
//  this.lang = new conf.Language();
  
  this.context = root;
  
  if(document.currentScript === null)
//  if(document.currentScript === null || (parent !== null && parent.document.getElementById("authn") !== null))
  {
    this.root = location.pathname.replace("/m/app", "");
  }
  else
  {
    this.root = document.currentScript.src.replace(location.origin, "").replace("/m/app", "").replace(new RegExp("\/([^/]+)$"), "");
  }
  this.root = this.root.substring(1);
  
  if(!(parent !== null && parent.document.getElementById("authn") !== null))
  {
    this.ui.authn = new m.ui.Element("iframe").id("authn");
    this.ui.authn.node.addEventListener("load", this.queue.add(function(event)
    {
      _this.ui.authn.node.contentWindow.location.href = "/m/app/pub/auth";
    }));
    var container = this.ui.authn;
    container.style.zIndex = "2147483647";
    container.style.display = "block";
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.border = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
  //  container.style.overflow = "hidden";
    container.style.overflow = "auto";
    container.style.backgroundColor = "transparent";
  //  this.ui.authn.node.addEventListener("keydown", function(event)
  //  {
  //    console.log("blur");
  //    if(event.keyCode === 27 || event.key === "Escape")
  //    {
  //      _this.ui.authn.visible(false);
  //      _this.show();
  //      return false;
  //    }
  //    
  //    return true;
  //  });
  //  this.ui.authn.node.addEventListener("load", this.queue.add(function(event){location.href = "/m/app/pub/auth";}));
  //  this.ui.authn.node.contentWindow.location.href = "/m/app/pub/auth";
    this.ui.authn.classes.add("auth_container");
    this.ui.authn.visible(false);
    this.ui.authn.parent(0);
    
    this.authn.success(function(){_this.eventAuthenticationChanged();});
  }
  else
  {
    this.ui.authn = parent.document.getElementById("authn").Element;
  }
  
  this.style(this.style());
  
  //m.global.environment = m.util.environment();
  //m.sys[m.global.environment].init();
  
  this.queue.add(function()
  {
    _this
    .success(function(styles)
    {
      console.log("style", styles);
    })
    .error(function()
    {
      console.log("style error");
    })
    .dir(_this.root + "/style")
    ;
  })();
  
  console.log("App", this);
};

//------------------------------------------------------------------------------

App.prototype.init = function(main)
{
  // todo look for parent container-app to integrate environment
  
  var _this = this;
  
  var completed = this.queue.add();
  var _main;
  if(typeof main === "undefined" || main === null)
  {
    _main = completed;
  }
  else if(typeof main !== "function")
  {
    throw new TypeError();
  }
  else
  {
    _main = function()
    {
      main.apply(this, arguments);
      completed();
    };
  }
  
  var eventProfileLoad = function(data)
  {
    console.log("session", data);
    
    data = data || {};
    for(var k in data)
    {
      _this.session[k] = data[k];
    }
//    _this.session.id = data.id;
//    _this.session.profile = data.profile;
//    _this.session.profiles = data.profiles;
    
    if(_this.session.id === null && !(frameElement && frameElement.id === "authn"))
    {
      _this.interrupted = true;
      _this.interrupted = function()
      {
        _this.conf.path(_this.root + "/conf/" + _this.session.profile + ".json")
        .success(eventConfLoad)
        .error(eventConfError)
        .read();
      };
      _this.authentication();
      return;
    }
//    _this.conf.path("conf/conf.json").success(initConfLoad).read();
//    _this.conf.path("conf/${profile}.json").success(initConfLoad).read();
    _this.conf.path(_this.root + "/conf/" + _this.session.profile + ".json")
    .success(eventConfLoad)
    .error(eventConfError)
    .read();
  };
  
  var eventProfileError = function()
  {
    _this.session.id = null;
    _this.session.profile = null;
    _this.session.profiles = null;
    
    eventConfError();
  };
  
  var eventConfLoad = function(data)
  {
    console.log(data);
    var logLevel = m.log.Log.level[_this.conf.get("log.level", "all").toUpperCase()];
    _this.log.level(logLevel);
    var loggers = _this.conf.get("log.loggers", []);
    for(var i = 0; i < loggers.length; i++)
    {
      // todo fix jsonToObject to properly find m references
  //    m.global.log.add(m.util.jsonToObject(loggers[i], {"m.ui.Logger": m.ui.Logger}));
    }
    
//    var theme = _this.conf.get("theme", "default");
//    var cssLayout = cssPath + theme + "/layout.css";
//    var cssStyle = cssPath + theme + "/style.css";
//    new m.ui.CSS().id("css_layout").path(cssLayout);
//    new m.ui.CSS().id("css_style").path(cssStyle);
    
    var lang = _this.conf.get("lang", "en-US");
//    _this.lang.path("lang/" + lang + ".json").success(main).error(main).read();
    _this.lang.path(_this.root + "/lang/" + lang + ".json")
    .success(_main)
    .error(_main)
    .read();
  };
  
  var eventConfError = function()
  {
    _this.conf.path(_this.root + "/conf/default.json")
    .success(eventConfLoad)
    .error(eventDefaultConfError)
    .read();
  };
  
  var eventDefaultConfLoad = eventConfLoad;
  
  var eventDefaultConfError = function()
  {
    _main();
  };
  
  this.authn
  .success(eventProfileLoad)
  .error(eventProfileError)
  .session()
  ;
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.menu = function(menuFunction, menuPath, menuParent)
{
//  var completed = this.queue.add();
  var _main;
  if(typeof menuFunction === "undefined" || menuFunction === null)
  {
//    _main = completed;
    _main = function(){};
  }
  else if(typeof menuFunction !== "function")
  {
    throw new TypeError();
  }
  else
  {
    _main = menuFunction;
//    _main = function()
//    {
//      menuFunction.apply(this, arguments);
//      completed();
//    };
  }
  
  var _this = this;
  
  menuPath = menuPath || _this.root;
  menuParent = menuParent || 0;
  
  var eventAppListChanged = function(apps)
  {
    if(typeof apps !== "object")
    {
      eventAppListError();
      
      return;
    }
    
    var frames = document.getElementsByClassName("task_container");
    console.log("deleting frames", frames);
    for(var i = 0; i < frames.length; i++)
    {
      frames[i].Element.visible(false);
      frames[i].Element.parent(null);
      delete frames[i];
    }

    _this.apps = apps;
    _this.appTree = {};
    console.log("app list", menuPath, apps);
    for(var k in apps)
    {
      var a = apps[k];
      if(a !== null && a !== "" && a !== _this.root)
      {
//        console.log(k, a);
        task_create(k, a);
        task_tree_create(k, a);
      }
    }
    console.log("app tree", _this.appTree);
    
    _main(apps, _this.appTree);
  };
  
  var eventAppListError = function()
  {
    console.log("app-list error");
  };
  
  var task_create = function(path, info)
  {
  //  var container = new m.ui.Module().visible(false);
    var container = new m.ui.Element("iframe").visible(false);
    container.classes.add("task_container");
  //  container.style.height = "calc(100% - " + window.getComputedStyle(app.ui.taskbar.node).getPropertyValue("height") + ")";
    
    info.path = path;
    info.container = container;
//    var _document = document;
    info.show = function()
    {
      console.log("task_show", info);
      
//      var frames = _document.getElementsByClassName("task_container");
      var frames = document.getElementsByClassName("task_container");
      for(var i = 0; i < frames.length; i++)
      {
        frames[i].Element.visible(false);
      }
      
      container.visible(true);
      
      if(info.initialized !== true)
      {
        container.node.contentWindow.location.href = "/" + _this.service() + info.path;
        info.initialized = true;
      }
    };
    
    info.hide = function()
    {
      console.log("task_hide", info);
      
      container.visible(false);
    };
    
    info.hideAll = function()
    {
      console.log("task_hide_all", info);
      
      var frames = document.getElementsByClassName("task_container");
      for(var i = 0; i < frames.length; i++)
      {
        frames[i].Element.visible(false);
      }
    };
    
    container.parent(menuParent);
  };
  
  var task_tree_create = function(path, info)
  {
    var data = _this.appTree;
    var branch = path.split("/");
//    for(var i = 1; i < branch.length - 1; i++)
//    {
//      if(typeof data[branch[i]] === "undefined")
//      {
//        data[branch[i]] = {};
//      }
//      data = data[branch[i]];
//    }
//    data[branch[branch.length - 1]] = info;
    for(var i = 1; i < branch.length; i++)
    {
      if(typeof data[branch[i]] === "undefined")
      {
        data[branch[i]] = {};
      }
      data = data[branch[i]];
    }
    data.$app = info;
  };
  
  this.queue.add(function()
  {
    _this
    .success(eventAppListChanged)
    .error(eventAppListError)
    .info(menuPath)
    ;
  })();
//  this
//  .success(eventAppListChanged)
//  .error(eventAppListError)
//  .completed(completed)
//  .info(menuPath)
//  ;
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.eventServiceUnauthorized = function()
{
  this.authentication();
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.eventServiceForbidden = function()
{
  // todo service architecture change to better distinguish 401 and 403
  console.log("App.eventServiceForbidden");
  
  this.authentication();
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.authentication = function()
{
//  this.hide();
  
  this.ui.authn.visible(true);
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.authenticationEnd = function()
{
  this.ui.authn.visible(false);
  
//  this.show();
  
  console.log(parent.app.interrupted, this);
  if(typeof parent.app.interrupted === "function")
  {
    parent.app.interrupted();
  }
  
  return this;
};

//------------------------------------------------------------------------------

App.prototype.show = function()
{
};

//------------------------------------------------------------------------------

App.prototype.hide = function()
{
};
this.App = App;

return this;

}.call(m));

