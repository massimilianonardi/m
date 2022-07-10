//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Container(properties)
{
  return Class(Container).construct(this, undefined, properties, ["div"]);
}

Class(Container)
.inherit(Element)
.properties()
;

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

//Container.prototype.construct = function()
//{
//  this.dom = this.dom || {};
//  this.dom.expanded = new Element().parent(this);
//  this.dom.expanded.classes.add("ContainerExpanded");
//  // use MutationObserver to catch any child added and move it to this.dom.expanded
//};

//------------------------------------------------------------------------------
