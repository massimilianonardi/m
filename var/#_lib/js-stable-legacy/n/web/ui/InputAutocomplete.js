//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function InputAutocomplete(properties)
{
  return Class(InputAutocomplete).construct(this, undefined, properties);
}

Class(InputAutocomplete)
.inherit(Input)
.implement(data.Data)
//.implement(data.DataFilterTable)
.properties()
.property("key", 0)
.property("text", 1)
.property("exact", true)
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

InputAutocomplete.prototype.construct = function()
{
  this.dom = {};
  this.dom.input = new core.Element("input").parent(this.node);
  this.dom.input.node.type = "hidden";
  this.dom.text = new core.Element("input").parent(this.node);
  this.dom.text.node.type = "text";
  this.dom.list = new core.Element().parent(this.node).visible(false);
  
  var _this = this;
  this.dom.text.event.register("change", function(event){_this.eventInputChange(this.value);});
  
  this.dom.text.event.register("change", function(event){_this.dom.list.visible(false);});
//  this.dom.text.event.register("blur", function(event){_this.dom.list.visible(false);});
  this.dom.text.event.register("blur", function(event)
  {
//    window.requestAnimationFrame(function(){_this.dom.list.visible(false);});
    window.setTimeout(function(){_this.dom.list.visible(false);}, 500);
  });
  this.dom.text.event.register("focus", function(event){_this.dom.list.visible(true);});
  this.dom.text.event.register("keyup", function(event)
  {
    // filter data based on current input value
    var value = this.value;
    var text = _this.text();
    var data = {};
    data.type = _this.data().type;
    data.meta = _this.data().meta;
    data.data = _this.data().data.filter(function(element, index, array)
    {
      return -1 < element[text].indexOf(value);
    });
    _this.eventDataLoad(data);
    // find best match
    // highlight best match element in list
    // complete input with best match (completion highlighted)
  });
};

//------------------------------------------------------------------------------

InputAutocomplete.prototype.eventDataLoad = function(data, mime)
{
  this.dom.list.html("");
  var text = this.text();
//  var data = (this.data() || {}).data || [];
  var data = data.data;
  for(var i = 0; i < data.length; i++)
  {
    var optionValue = data[i][text];
    var elem = new core.Element().parent(this.dom.list).text(optionValue);
    elem.classes.add("item");
    elem.node.setAttribute("data-value", data[i][this.key()]);
    var _this = this;
    elem.event.register("click", function()
    {
//      console.log("clicked", this.Element.text(), this.getAttribute("data-value"));
      _this.value(this.getAttribute("data-value"));
      _this.dom.text.node.value = this.Element.text();
    });
//    elem.event.register("mouseover", function()
//    {
////      console.log("mouseover");
//      var selection = document.createRange();
////      var selection = window.document.createRange();
////      selection.selectNodeContents(this);
//      selection.selectNode(this);
////      selection.setStartBefore(this);
////      selection.setEndAfter(this);
//      window.getSelection().removeAllRanges();
//      window.getSelection().addRange(selection);
//    });
  }
  
  return this;
};

//------------------------------------------------------------------------------

InputAutocomplete.prototype.value = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.value;
  }
  else
  {
    this.dom.input.node.value = value;
    this.eventPropertiesChanged("value");
    return this;
  }
};

//------------------------------------------------------------------------------

InputAutocomplete.prototype.readonly = function(value)
{
  if(typeof value === "undefined")
  {
    return this.dom.input.node.readOnly;
  }
  else
  {
    this.dom.input.node.readOnly = value;
    this.eventPropertiesChanged("readonly");
    return this;
  }
};

//------------------------------------------------------------------------------

InputAutocomplete.prototype.enabled = function(value)
{
  if(typeof value === "undefined")
  {
    return !this.dom.input.node.disabled;
  }
  else
  {
    this.dom.input.node.disabled = !value;
    this.eventPropertiesChanged("enabled");
    return this;
  }
};

//------------------------------------------------------------------------------
