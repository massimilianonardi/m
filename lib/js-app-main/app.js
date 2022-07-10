
console.log("main", this);

// globals ---------------------------------------------------------------------

var appPath = this.root === "/" ? "/app" : this.root;
var mainMenuID = "menu";
var mainMenu = parent === null ? null : parent.document.getElementById(mainMenuID);
var ismain = mainMenu === null ? true : false;

var app = new m.App();
app
.init(main)
;

// main ------------------------------------------------------------------------

function main()
{
//  console.log("init-main");
  
  app.ui.menu = init_menu();
  
  if(ismain)
  {
    app.ui.type = "menu";
    app.ui.taskbar = init_taskbar();
    
    var menu_keydown_event = m.util.keyBindEnterEsc(null, function()
    {
      app.ui.menu.visible(false);
      app.ui.taskbar.visible(true);
//      document.body.removeEventListener("keydown", menu_keydown_event);
    });
    document.body.addEventListener("keydown", menu_keydown_event);
    
//    app.ui.menu.visible(false);
//    app.authentication();
    
    app.menu(eventAppListChanged, appPath);
  }
  else
  {
    app.ui.type = "submenu";
    app.ui.taskbar = parent.app.ui.taskbar;
    eventAppListChanged(null, subTree(appPath));
  }
}

function init_menu()
{
  var e;
  
  e = new m.ui.Element().id("menu").visible(true).parent(0);
  e.classes.add("menu");
  
  return e;
}

function init_taskbar()
{
  var e;
  
  e = new m.ui.Element().id("taskbar").visible(false).parent(0);
  e.classes.add("taskbar");
  
  var app_menu_button;
  app_menu_button = new m.ui.Element().id("taskbar_app_button");
  app_menu_button.classes.add("taskbar_item");
  app_menu_button.classes.add("taskbar_button");
  app_menu_button.html("<i class=\"icon-apps\"></i>");
  app_menu_button.register("click", function()
  {
    app.ui.taskbar.app_menu.visible(!app.ui.taskbar.app_menu.visible());
  });
  
  var menu_button;
  menu_button = new m.ui.Element().id("taskbar_menu_button");
  menu_button.classes.add("taskbar_item");
  menu_button.classes.add("taskbar_button");
  menu_button.html("<i class=\"icon-home\"></i>");
  menu_button.register("click", function()
  {
    app.ui.menu.visible(!app.ui.menu.visible());
    app.ui.taskbar.app_menu.visible(false);
    app.ui.taskbar.navbar.html("");
  });
  
  var navbar;
  navbar = new m.ui.Element().id("navbar");
  navbar.classes.add("taskbar_item");
  navbar.classes.add("taskbar_button");
  
  var sys_menu_button;
  sys_menu_button = new m.ui.Element().id("taskbar_sys_button");
  sys_menu_button.classes.add("taskbar_item");
  sys_menu_button.classes.add("taskbar_button");
  sys_menu_button.html("<i class=\"icon-person\"></i>");
  sys_menu_button.register("click", function()
  {
    app.authentication();
//    app.ui.menu.visible(false);
  });
  
  e.app_menu_button = app_menu_button.parent(e);
  e.menu_button = menu_button.parent(e);
  e.navbar = navbar.parent(e);
  e.sys_menu_button = sys_menu_button.parent(e);
  
  var app_menu = new m.ui.Element().id("taskbar_app_menu");
  app_menu.classes.add("taskbar_left_menu");
  app_menu.classes.add("taskbar_menu");
  app_menu.visible(false);
  app_menu.parent(e);
  e.app_menu = app_menu;
  
  document.body.tabIndex= 0;
  document.body.addEventListener("blur", function()
  {
    app.ui.taskbar.app_menu.visible(false);
  });
  
  return e;
}

// functions -------------------------------------------------------------------

function subTree(path)
{
  var appTree = parent.app.appTree;
  var branch = path.split("/");
//console.log(appTree, branch);
  for(var i = 1; i < branch.length; i++)
  {
    if(typeof appTree[branch[i]] === "undefined")
    {
      console.log("app tree error");
    }
    appTree = appTree[branch[i]];
  }
//console.log(appTree, branch);
  
  return appTree;
}

//------------------------------------------------------------------------------

function eventAppListChanged(data, appTree)
{
  app.ui.menu.html("");
  if(app.ui.type === "menu")
  {
    app.ui.taskbar.app_menu.html("");
  }

  var apps = data || {};
//console.log("apps-changed", apps, data, appTree);
  init_appTree(appTree);
}

//------------------------------------------------------------------------------

function init_appTree(apps)
{
//console.log("init_appTree - init", apps);
  if(apps.$app && apps.$app.type === "menu" && app.context !== apps.$app.path)
  {
//console.log("init_appTree - menu", apps.$app);
    task_menu_create(apps.$app);
    return;
  }
  
  var l = [];
  for(var k in apps)
  {
    l.push(k);
  }
  l.sort();
  
  for(var i = 0; i < l.length; i++)
  {
    k = l[i];
    var a = apps[k];
//    console.log("init_appTree - item", k, a);
    if(k === "$app" && !(a.type === "menu" && app.context === a.path))
    {
//console.log("init_appTree - create", k, a);
      task_app_create(a);
    }
    else if(k !== "$app")
    {
//console.log("init_appTree - loop", a);
      init_appTree(a);
    }
  }
}

//------------------------------------------------------------------------------

function task_menu_create(info)
{
  var button = new m.ui.Element().text(info.title);
  button.classes.add("menu_task_button");
  button.classes.add("menu_submenu_button");
  button.register("click", function()
  {
    task_menu_show(info);
  });
  
  info.menu_button = button;
  
  button.parent(app.ui.menu);
}

//------------------------------------------------------------------------------

function task_app_create(info)
{
  var button = new m.ui.Element().text(info.title);
  button.classes.add("menu_task_button");
  button.register("click", function()
  {
    task_app_show(info);
  });
  
  info.menu_button = button;
  
  button.parent(app.ui.menu);
}

//------------------------------------------------------------------------------

function task_menu_show(info)
{
//  console.log("task_show", info);
  
  info.show();
  
  if(app.ui.type === "menu")
  {
    app.ui.menu.visible(false);
    app.ui.taskbar.visible(true);
    app.ui.taskbar.app_menu.visible(false);
  }
  else if(app.ui.type === "submenu")
  {
    parent.app.ui.menu.visible(false);
  }
  
  info.index = info.index || app.ui.taskbar.navbar.node.children.length;
  
//  var button = new m.ui.Element().html("<i class=\"icon-arrow_forward\"></i>" + info.title);
//  var button = new m.ui.Element().html("<i class=\"icon-play_arrow\"></i>" + info.title);
//  var button = new m.ui.Element().html("<i class=\"icon-keyboard_arrow_right\"></i>" + info.title);
  var button = new m.ui.Element().html("<i class=\"icon-navigate_next\"></i>" + info.title);
  button.classes.add("taskbar_item");
  button.classes.add("taskbar_button");
  
  button.register("click", function()
  {
    app.ui.taskbar.app_menu.visible(false);
    var children = app.ui.taskbar.navbar.node.children;
//    console.log(info.index, children);
    for(var i = children.length - 1; info.index < i; i--)
    {
      app.ui.taskbar.navbar.node.removeChild(children[i]);
    }
    info.show();
  });
  
  info.navbar_button = button;
  
  app.ui.taskbar.navbar.node.appendChild(button.node);
}

//------------------------------------------------------------------------------

function task_app_show(info)
{
//  console.log("task_show", info);
  
  if(info.initialized !== true)
  {
    var button = new m.ui.Element().text(info.title);
    button.classes.add("taskbar_menu_item");
    button.classes.add("taskbar_menu_button");
    button.classes.add("menu_item");
    button.classes.add("menu_button");
    
    button.register("click", function()
    {
      app.ui.taskbar.app_menu.visible(false);
      info.show();
      app.ui.taskbar.navbar.html("");
      var children = info.navbar_buttons;
      for(var i = 0; i < children.length; i++)
      {
        app.ui.taskbar.navbar.node.appendChild(children[i]);
      }
    });
    
    info.taskbar_button = button;
    info.navbar_buttons = [];
    var children = app.ui.taskbar.navbar.node.children;
    for(var i = 0; i < children.length; i++)
    {
      info.navbar_buttons.push(children[i]);
    }
    
    app.ui.taskbar.app_menu.node.appendChild(button.node);
  }
  
  info.show();
  
  if(app.ui.type === "menu")
  {
    app.ui.menu.visible(false);
    app.ui.taskbar.visible(true);
    app.ui.taskbar.app_menu.visible(false);
  }
  else if(app.ui.type === "submenu")
  {
    parent.app.ui.menu.visible(false);
  }
}

//------------------------------------------------------------------------------
