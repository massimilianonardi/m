//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TWBootstrapNavigationBar()
{
  return Class(TWBootstrapNavigationBar).construct(this, arguments);
}

Class(TWBootstrapNavigationBar)
.inherit(core.Element)
//.property("label", "label")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

TWBootstrapNavigationBar.prototype.construct = function()
{
  var navbar = new m.web.ui.core.Element("nav").parent(this);
  navbar.classes.add("navbar");
  navbar.classes.add("navbar-default");
  
  var navcontainer = new m.web.ui.core.Element().parent(navbar);
  navcontainer.classes.add("container-fluid");
  
  var navbarheader = new m.web.ui.core.Element().parent(navcontainer);
  navbarheader.classes.add("navbar-header");
  navbarheader.style.width = "100%";
  
  var nbid = "id_" + Math.random().toString().substring(2);
  
  var navbarheaderbutton = new m.web.ui.core.Element("button").parent(navbarheader);
  navbarheaderbutton.classes.add("navbar-toggle");
  navbarheaderbutton.classes.add("collapsed");
  navbarheaderbutton.node.type = "button";
  navbarheaderbutton.node.setAttribute("data-toggle", "collapse");
  navbarheaderbutton.node.setAttribute("data-target", "#" + nbid);
  navbarheaderbutton.node.setAttribute("aria-expanded", "false");
  navbarheaderbutton.html("<span class='sr-only'>Toggle navigation</span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span>");
  
  var navbarheaderbrand = new m.web.ui.core.Element("a").parent(navbarheader);
  navbarheaderbrand.classes.add("navbar-brand");
  navbarheaderbrand.node.href = "#";
  
  var navbarheadercollapse = new m.web.ui.core.Element().parent(navbarheader);
  navbarheadercollapse.classes.add("collapse");
  navbarheadercollapse.classes.add("navbar-collapse");
  navbarheadercollapse.node.id = nbid;
  
  var navbarheaderleft = new m.web.ui.core.Element("ul").parent(navbarheadercollapse);
  navbarheaderleft.classes.add("nav");
  navbarheaderleft.classes.add("navbar-nav");
  navbarheaderleft.classes.add("navbar-left");
  
  var navbarheaderright = new m.web.ui.core.Element("ul").parent(navbarheadercollapse);
  navbarheaderright.classes.add("nav");
  navbarheaderright.classes.add("navbar-nav");
  navbarheaderright.classes.add("navbar-right");
  
  this.logo = navbarheaderbrand;
  this.left = navbarheaderleft;
  this.right = navbarheaderright;
};

//------------------------------------------------------------------------------
