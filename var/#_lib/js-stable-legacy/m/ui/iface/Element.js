//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Element()
{
  return Element.Class.construct(this, arguments);
}

Class(Element)
.property("style")
.property("id")
.property("classes")
.property("parent")
.property("visible")
.property("enable", true)
.property("value")
.property("readonly")
.property("focus", false)
.property("select", false)
.property("destroy")
.property("clear")
.property("reset")
.property("text - image sound vide etc.")
.property("html")
.property("import - as module loads js css and html")
.property("add")
.property("remove")
.property("register")
.property("unregister")
.property("notify")
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Element.prototype.construct = function()
{
  m.global.log.debug(this, arguments);
  
  this.classes(this.constructor.name);
//  this.actions();
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
