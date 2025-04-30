//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Tree()
{
  return Class(Tree).construct(this, arguments);
}

Class(Tree)
.inherit(core.ElementControl)
.property("label", "label")
.property("children", "children")
.property("callback", function(){})
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Tree.prototype.construct = function()
{
};

//------------------------------------------------------------------------------

Tree.prototype.render = function()
{
  this.html("");
  
  var data = this.data();
  if(typeof data === "undefined")
  {
    return this;
  }
  
//  console.log(this, data);
  function toogle(labelDOM, childrenDOM)
  {
    labelDOM.event.register("click", function()
    {
//      console.log(childrenDOM, childrenDOM.visible());
      childrenDOM.visible(!childrenDOM.visible());
    });
    childrenDOM.visible(false);
  }
  
  function buildTree(parent, nodes, label, children, labelClass, childrenClass, nodeFunction)
  {
    if(typeof parent === "undefined" || typeof nodes === "undefined" || typeof nodes[0] === "undefined")
    {
      return false;
    }
    for(var i = 0; i < nodes.length; i++)
    {
      if(typeof nodes[i][label] === "undefined")
      {
        continue;
      }
      var labelDOM = new core.Element().parent(parent).text(nodes[i][label]);
      labelDOM.classes.add(labelClass);
      if(typeof nodeFunction === "function")
      {
        nodeFunction(parent, labelDOM, nodes[i]);
      }
      var childrenDOM = new core.Element().parent(parent);
      childrenDOM.classes.add(childrenClass);
      toogle(labelDOM, childrenDOM);
      if(typeof nodes[i][children] !== "undefined")
      {
        buildTree(childrenDOM, nodes[i][children], label, children, labelClass, childrenClass, nodeFunction);
      }
    }
    return true;
  }
  
  buildTree(this, data, this.label(), this.children(), "label", "children", this.callback());
  
  return this;
};

//------------------------------------------------------------------------------
