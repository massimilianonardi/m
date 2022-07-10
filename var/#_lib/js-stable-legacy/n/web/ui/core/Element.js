//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Element()
{
  // return Class(ClassName).construct(this, arguments, {properties}, [inherited], [[implemented]], {composed_obj1:[], ...}, {polymorphed_ob1:[], ...});
  return Class(Element).construct(this, arguments, undefined, undefined, undefined, undefined, undefined);
}

Class(Element)
.polymorph("event", Object)
//.compose("event", event.EventHandler)
//.compose("classes", Object)
//.polymorph("style", Object)
//.properties()
//.property("id")
//.property("parent")
//.property("visible")
//.property("html")
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
  var cname = this.constructor.name;
  if(cname !== "Element")
  {
    this.classes.add(cname);
  }
};

//------------------------------------------------------------------------------

Element.prototype.id = function(identifier)
{
//  if(typeof identifier === "undefined")
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
//  if(typeof element === "undefined")
  if(arguments.length === 0)
  {
    return this.node.parentNode;
  }
  else if(element === null)
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
  else if(element instanceof Element)
  {
    element.node.appendChild(this.node);
    
    return this;
  }
//  else if(element instanceof window.Element)
  else if(element instanceof window.Node)
  {
    element.appendChild(this.node);
    
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
    return $(this.node).is(":visible");
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

Element.prototype.html = function(code)
{
//  if(typeof code === "undefined")
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
//  if(typeof text === "undefined")
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

Element.prototype.add = function(element)
{
  if(element instanceof Element)
  {
    this.node.appendChild(element.node);
    
    return this;
  }
//  else if(element instanceof window.Element)
  else if(element instanceof window.Node)
  {
    this.node.appendChild(element);
    
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
  if(element instanceof Element)
  {
    this.node.removeChild(element.node);
    
    return this;
  }
//  else if(element instanceof window.Element)
  else if(element instanceof window.Node)
  {
    this.node.removeChild(element);
    
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

Class(Element).polymorph("event", "register", function(name, listener)
{
  this.node.addEventListener(name, listener);
  
  return this;
});

//------------------------------------------------------------------------------

Class(Element).polymorph("event", "unregister", function(name, listener)
{
  this.node.removeEventListener(name, listener);
  
  return this;
});

//------------------------------------------------------------------------------

Class(Element).polymorph("event", "notify", function(event)
{
  this.node.dispatchEvent(event);
  
  return this;
});

//------------------------------------------------------------------------------
