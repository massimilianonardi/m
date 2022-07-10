//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Element()
{
  return Element.Class.construct(this, arguments);
}

Class(Element)
//.inherit(m.ui.core.Element)
.property("style")
.property("id")
.getter("id", function(){return this.element.id();})
.setter("id", function(value){this.element.id(value); return value;})
.property("classes")
.getter("classes", function(){return this.element.classes;})
.setter("classes", function(value)
{
  if(typeof value !== "string")
  {
    throw new TypeError();
  }
  
  var cl = value.split(",");
  for(var i = 0; i < cl.length; i++)
  {
    if(cl[i][0] === "-")
    {
      this.element.classes.remove(cl[i].substring(1));
    }
    else if(cl[i][0] === "!")
    {
      this.element.classes.toggle(cl[i].substring(1));
    }
    else
    {
      this.element.classes.add(cl[i]);
    }
  }
  
  return this;
})
.property("parent")
.getter("parent", function(){return this.element.parent();})
.setter("parent", function(value)
{
  // remove this from previous parent children
  // low-level parent changing
  // add this to new parent children
  var p = value;
  if(value instanceof m.ui.Element)
  {
    p = value.element;
  }
  else if(value instanceof Element)
  {
    p = value.element;
  }
  this.element.parent(p);
  
  return value;
})
.property("show", undefined, function(){return this.element.visible();}, function(value){this.element.visible(value); return this;})
.property("show")
.getter("show", function(){return this.element.visible();})
.setter("show", function(value){this.element.visible(value); return value;})
.property("enable", true)
.property("interactive")
.property("interact", false, undefined, function(value)
{
  if(typeof value !== "boolean")
  {
    throw new TypeError();
  }
  
  var type = (this.meta() || {}).type || "text";
  if(type !== "text")
  {
    throw new TypeError();
  }
  
  this._classinstance._properties.edit = value;
  
  if(value)
  {
    this.text.visible(false);
    this.edit.node.value = this.text.text();
    this.edit.visible(true);
  }
  else
  {
    this.edit.visible(false);
    this.text.text(this.edit.node.value);
    this.text.visible(true);
  }
  
  return this;
})
.property("value")
.property("focus", false)
//.property("select", false)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Element.prototype.construct = function()
{
  m.global.log.debug(this, arguments);
  
  this.element = new dom.Element();
  this.element.node.Element = this;
  
  this.classes(this.constructor.name);
  
  this.actions();
  
//  this.actions();
  
//  this.eventConfigurationChange(conf);
//  this.reset();
};

//------------------------------------------------------------------------------

Element.prototype.destroy = function()
{
  m.global.log.debug(this, arguments);
  
  // remove from parent children
  // if parent is null then hide, attach to body and then remove, or do nothing?
  this.element.node.parentNode.removeChild(this.element.node);
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.clear = function()
{
  m.global.log.debug(this, arguments);
  
  // remove all children
  this.element.html("");
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.reset = function()
{
  m.global.log.debug(this, arguments);
  
  this.clear();
  
  this.image = undefined;
  this.text = undefined;
  this.edit = undefined;
  
  var type = (this.meta() || {}).type;
  if(type === "image")
  {
  }
  else if(type === "url/image")
  {
    this.image = new dom.Element("img").parent(this.element);
    this.image.node.src = this.translate("url/image").toString();
  }
  else
  {
    var text = (this.translate("text") || "").toString();
    this.text = new dom.Element("div").text(text).parent(this.element);
    if(this.interactive())
    {
//      this.text.node.contentEditable = "true"
      this.edit = new dom.Element("textarea").visible(false).parent(this.element);
      this.edit.node.value = text;
    }
  }
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.register = function(name, listener)
{
  m.global.log.debug(this, arguments);
  
  this.element.register(name, listener);
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.unregister = function(name, listener)
{
  m.global.log.debug(this, arguments);
  
  this.element.unregister(name, listener);
  
  return this;
};

//------------------------------------------------------------------------------

Element.prototype.eventConfigurationChange = function(conf)
{
//  m.global.log.debug(this, arguments);
  
  var _this = this;
  // todo get mapping from conf (<device, type, value> -> actionMethod)
  // and register properly -> choose the proper event and create a customized function to do the mapping
  var conf = g.conf.data();
  var eventMapping = g.conf.get("ui.event.map.select", "click");
  // todo get rule-based conf of elem
  // todo rule-based conf system based on id, js-class, css-classes and same parent params
  // todo rule-based conf system based on id, js-class, css-classes -> css-classes sufficies and can substitute js-class, id and layout structure position
  // the latter requires that code generating ui make element distinguisable assigning a specific class (eg table_child_1)
//  for(var i = 0; i < mappings.length; i++)
//  {
//    //
//  }
  
//  this.register("click", function(event){this.eventElementInputMousePress(event.button);});
//  this.register("dblclick", function(event){this.eventElementInputMousePress(event.button + 1000);});
//  this.register("mousedown", function(event){this.eventElementInputMouseDown(event.button);});
//  this.register("mouseup", function(event){this.eventElementInputMouseUp(event.button);});
//  this.register("keypress", function(event){this.eventElementInputKeyboardPress(event.code);});
//  this.register("keydown", function(event){this.eventElementInputKeyboardDown(event.code);});
//  this.register("keyup", function(event){this.eventElementInputKeyboardUp(event.code);});
//  if(ie)
//  {
//    this.register("keypress", function(event){this.eventElementInputKeyboardPress(event.keyCode);});
//    this.register("keydown", function(event){this.eventElementInputKeyboardDown(event.keyCode);});
//    this.register("keyup", function(event){this.eventElementInputKeyboardUp(event.keyCode);});
//  }
  
  this.update();
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInput = function(device, type, value)
{
  m.global.log.debug(this, arguments);
  
  // todo get mapping from conf (<device, type, value> -> actionMethod)
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputMousePress = function(value)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputMouseDown = function(value)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputMouseUp = function(value)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputMouseAbsolute = function(x, y)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputMouseRelative = function(x, y)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputMouseAbsoluteNormalized = function(x, y)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputMouseRelativeNormalized = function(x, y)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputKeyboardPress = function(value)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputKeyboardDown = function(value)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------

Element.prototype.eventElementInputKeyboardUp = function(value)
{
  m.global.log.debug(this, arguments);
};

//------------------------------------------------------------------------------
