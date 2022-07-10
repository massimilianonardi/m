//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Form()
{
  return Form.Class.construct(this, arguments);
}

Class(Form)
.inherit(Element)
.compose("elems", {})
.compose("list", [])
.property("struct")
.setter("struct", function(value){if(Array.isArray(value)){this.build(value); return value;} else {throw new TypeError();}})
.property("value")
.getter("value", function(value){return this.get(this.elems);})
.setter("value", function(value){return this.set(value);})
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Form.prototype.construct = function(tag)
{
  var cname = this.constructor.name;
  if(cname !== "Element")
  {
    this.classes.add(cname);
  }
  this.classes.add(cname);
};

//------------------------------------------------------------------------------

Form.prototype.build = function(struct)
{
  for(var i = 0; i < struct.length; i++)
  {
    var elemStruct = struct[i];
    if(typeof elemStruct !== "object" || typeof elemStruct.name !== "string")
    {
      throw new TypeError();
    }
    
    var elem;
    if(elemStruct.type === "form" && Array.isArray(elemStruct.struct))
    {
      elem = new m.ui.Form();
    }
    else
    {
      elem = new m.ui.FormElement();
    }
    
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
    
    elem.parent(this);
    this.list.push(elem);
    this.elems[elemStruct.name] = elem;
  }
};

//------------------------------------------------------------------------------

Form.prototype.build_ = function(struct)
{
  for(var i = 0; i < struct.length; i++)
  {
    var elemStruct = struct[i];
    var elem;
    if(Array.isArray(elemStruct))
    {
      elem = new m.ui.Form().parent(this).struct(elemStruct);
    }
    else if(typeof elemStruct === "object")
    {
      elem = new m.ui.FormElement().parent(this);
      
      if(typeof elemStruct.name === "string")
      {
        this.elems[elemStruct.name] = elem;
      }
      
      for(var k in elemStruct)
      {
        elem[k](elemStruct[k]);
      }
    }
    else
    {
      throw new TypeError();
    }
    
    this.list.push(elem);
  }
};

//------------------------------------------------------------------------------

Form.prototype.get = function(elems)
{
  var res = {};
  
  for(var k in elems)
  {
    var e = elems[k];
    res[k] = e.value();
  }
  
  return res;
};

//------------------------------------------------------------------------------

Form.prototype.set = function(values)
{
  for(var k in values)
  {
    if(this.elems[k].type() === "text")
    {
      this.elems[k].value(values[k]);
    }
    else
    {
      this.elems[k]._node._value = values[k];
    }
  }
};

//------------------------------------------------------------------------------

Form.prototype.reset = function(values)
{
  var struct = this.struct();
  for(var i = 0; i < struct.length; i++)
  {
    var elemStruct = struct[i];
    if(typeof elemStruct !== "object" || typeof elemStruct.name !== "string")
    {
      throw new TypeError();
    }
    
    var elem = this.list[i];
    if(elemStruct.type === "form" && Array.isArray(elemStruct.struct))
    {
      elem.reset();
    }
    
    if(typeof elemStruct.value !== "undefined")
    {
      elem.value(elemStruct.value);
    }
    else
    {
      elem.value("");
    }
  }
};

//------------------------------------------------------------------------------
