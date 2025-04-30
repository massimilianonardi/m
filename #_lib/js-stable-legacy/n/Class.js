//var m = n;

//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Class(c)
{
  if(typeof c !== "function")
  {
    throw new TypeError();
  }
  
  if(this instanceof Class)
  {
    throw new SyntaxError();
  }
  
  if(typeof c.prototype === "undefined")
  {
    throw new ReferenceError();
  }
  
  if(!(c.prototype._classinfo instanceof Class))
  {
    var instance = Object.create(Class.prototype);
    
    instance._target = c;
    instance._inherit = undefined;
    instance._implement = [];
    instance._compose = {};
    instance._polymorph = {};
    instance._static = false;
    instance._singleton = false;
    instance._new = false;
    instance._defaults = {};
    
    c.prototype._classinfo = instance;
  }
  
  return c.prototype._classinfo;
}

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Class.prototype.construct = function(context, args, properties, args_inherit, args_implement, args_compose, args_polymorph)
{
  if(!(context instanceof this._target))
  {
    if(this._static || this._singleton)
    {
      var instance = this.instance;
      if(typeof instance === "undefined")
      {
        instance = Object.create(this._target.prototype);
        this.ctor(instance, args, properties, args_inherit, args_implement, args_compose, args_polymorph);
        this.instance = instance;
      }
      return instance;
    }
    else if(this._new)
    {
      throw new SyntaxError();
    }
    
    if(typeof this._target.prototype.stateless === "function")
    {
      return this._target.prototype.stateless.apply(context, args);
    }
    else
    {
      return {};
    }
  }
  else if(this._singleton)
  {
    throw new SyntaxError();
  }
  
  return this.ctor(context, args, properties, args_inherit, args_implement, args_compose, args_polymorph);
};

//------------------------------------------------------------------------------

Class.prototype.ctor = function(context, args, properties, args_inherit, args_implement, args_compose, args_polymorph)
{
  if(0 < Object.getOwnPropertyNames(this._defaults).length)
  {
    context._classinstance = context._classinstance || {};
    context._classinstance._properties = context._classinstance._properties || {};
    this.props.call(context, this._defaults, false);
    this.props.call(context, properties, false);
  }
  
//  if(0 < Object.getOwnPropertyNames(this._defaults).length)
//  {
//    context._classinstance = context._classinstance || {};
//    context._classinstance._properties = context._classinstance._properties || {};
//  }
//  
//  if(0 < Object.getOwnPropertyNames(properties || {}).length)
//  {
//    this.props.call(context, this._defaults, false);
//    this.props.call(context, properties, false);
//  }
  
  // construct
  if(typeof this._inherit !== "undefined")
  {
    this._inherit.apply(context, args_inherit);
  }
  
  args_implement = args_implement || [];
  for(var i = 0; i < this._implement.length; i++)
  {
    this._implement[i].apply(context, args_implement[i]);
  }
  
  args_compose = args_compose || {};
  for(var k in this._compose)
  {
    context[k] = new this._compose[k](args_compose[k] || {});
    context[k]._classinstance = context[k]._class || {};
    context[k]._classinstance._parent = context;
  }
  
  args_polymorph = args_polymorph || {};
  for(var k in this._polymorph)
  {
    context[k] = new this._polymorph[k](args_polymorph[k] || {});
    context[k]._classinstance = context[k]._classinstance || {};
    context[k]._classinstance._parent = context;
  }
  
  if(this._target.prototype.hasOwnProperty("construct") && typeof this._target.prototype.construct === "function")
  {
    this._target.prototype.construct.apply(context, args);
  }
  
  return context;
};

//------------------------------------------------------------------------------

Class.prototype.inherit = function(base)
{
  if(typeof base !== "function")
  {
    throw new TypeError();
  }
  
  this._inherit = base;
  
  var _target = this._target;
  var constructor = _target.prototype.constructor;
  var _classinfo = _target.prototype._classinfo;
//  _target.prototype = new base();
  _target.prototype = Object.create(base.prototype);
  _target.prototype.constructor = constructor;
  _target.prototype._classinfo = _classinfo;
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.implement = function(base)
{
  if(typeof base !== "function")
  {
    throw new TypeError();
  }
  
  this._implement.push(base);
  
  var _target = this._target;
  var constructor = _target.prototype.constructor;
  var _classinfo = _target.prototype._classinfo;
  for(var k in base.prototype)
  {
    _target.prototype[k] = base.prototype[k];
  }
  _target.prototype.constructor = constructor;
  _target.prototype._classinfo = _classinfo;
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.compose = function(property, base, method)
{
  if(typeof base === "undefined")
  {
    return this._compose[property];
  }
  
  if(typeof base === "string")
  {
    // base = method name
//    this._compose[property].prototype[base] = function(){method.apply(this._classinstance._parent, arguments);};
    this._compose[property].prototype[base] = method;
    return this;
  }
  
  if(typeof base !== "function")
  {
    throw new TypeError();
  }
  
  function compose(){return Class(compose).construct(this, arguments, undefined, arguments);};
  Class(compose).inherit(base);
  this._compose[property] = compose;
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.polymorph = function(property, base, method)
{
  if(typeof base === "undefined")
  {
    return this._polymorph[property];
  }
  
  if(typeof base === "string")
  {
    // base = method name
    this._polymorph[property].prototype[base] = function(){method.apply(this._classinstance._parent, arguments);};
    return this;
  }
  
  if(typeof base !== "function")
  {
    throw new TypeError();
  }
  
  function polymorph(){return Class(polymorph).construct(this, arguments, undefined, arguments);};
  Class(polymorph).inherit(base);
  this._polymorph[property] = polymorph;
  
  for(var k in base.prototype)
  {
    if(typeof base.prototype[k] === "function")
    {
      this._polymorph[property].prototype[k] = function(){base.prototype[k].apply(this._classinstance._parent, arguments);};
    }
  }
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.staticable = function(enable)
{
  if(typeof enable !== "boolean" && typeof enable !== "undefined")
  {
    throw new TypeError();
  }
  
  this._static = false;
  if(typeof enable === "undefined" || enable === true)
  {
    this._static = true;
  }
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.singleton = function(enable)
{
  if(typeof enable !== "boolean" && typeof enable !== "undefined")
  {
    throw new TypeError();
  }
  
  this._singleton = false;
  if(typeof enable === "undefined" || enable === true)
  {
    this._singleton = true;
  }
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.requireNew = function(enable)
{
  if(typeof enable !== "boolean")
  {
    throw new TypeError();
  }
  
  this._new = false;
  if(typeof enable === "undefined" || enable === true)
  {
    this._new = true;
  }
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.property = function(property, value)
{
  if(typeof property !== "string")
  {
    throw new TypeError();
  }
  
  this._defaults[property] = value;
  
  this._target.prototype[property] = function(value, notify)
  {
//    if(typeof value === "undefined")
    if(arguments.length === 0)
    {
      return this._classinstance._properties[property];
    }
    else
    {
      this._classinstance._properties[property] = value;
      
      if(typeof this.eventPropertiesChanged === "function" && notify !== false)
      {
        this.eventPropertiesChanged(property);
      }
      
      return this;
    }
  };
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.properties = function()
{
  this._target.prototype.properties = Class.prototype.props;
  
  return this;
};

//------------------------------------------------------------------------------

Class.prototype.props = function(properties, notify)
{
//  if(typeof properties === "undefined")
  if(arguments.length === 0)
  {
    return this._classinstance._properties;
  }
  else
  {
    for(var k in properties)
    {
      if(typeof this[k] === "function")
      {
        this[k](properties[k], notify);
      }
      else
      {
        this._classinstance._properties[k] = properties[k];
      }
    }

    if(typeof this.eventPropertiesChanged === "function" && notify !== false)
    {
      this.eventPropertiesChanged();
    }

    return this;
  }
};

//------------------------------------------------------------------------------

Class.prototype.isDerivedOf = function(base)
{
  return this._inherit === base;
};

//------------------------------------------------------------------------------

Class.prototype.isImplementationOf = function(base)
{
  var res = false;
  
  for(var i = 0; i < this._implement.length; i++)
  {
    res = res || this._implement[i] === base;
  }
  
  return res;
};

//------------------------------------------------------------------------------

Class.prototype.isCapableOf = function(base)
{
  return this.isDerivedOf(base) || this.isImplementationOf(base);
};

//------------------------------------------------------------------------------
