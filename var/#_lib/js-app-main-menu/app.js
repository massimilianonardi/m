
console.log("main", this);

// globals ---------------------------------------------------------------------

var app = new m.App();
app
.init(main)
//.menu(eventAppListChanged, this.root === "/" ? "/app" : this.root)
;

// main ------------------------------------------------------------------------

function main()
{
  console.log("init-main");
  
//  app.noti.info("main");
  
//  new m.ui.CSS().id("font_roboto").path("https://fonts.googleapis.com/css?family=Roboto:300,400");
//  new m.ui.CSS().id("font_roboto_mono").path("https://fonts.googleapis.com/css?family=Roboto+Mono");
  
//  new m.ui.CSS().id("css_material").path("https://fonts.googleapis.com/icon?family=Material+Icons");
//  new m.ui.CSS().id("css_fa").path("https://use.fontawesome.com/releases/v5.5.0/css/all.css");
  
  app.ui.type = "menu";
  if(parent !== null && parent.document.getElementById("menu") !== null)
  {
    app.ui.type = "submenu";
  }
  console.log("app.ui.type", app.ui.type);
  
  app.ui.main = init_main();
  app.ui.menu = init_menu();
  app.ui.taskbar = init_taskbar();
  
  if(app.ui.type === "menu" && app.ui.type !== "submenu")
  {
    app
    .menu(eventAppListChanged, app.context === "/" ? "/app" : app.context)
    ;
  }
  else if(app.ui.type !== "menu" && app.ui.type === "submenu")
  {
//    app.ui.menu = parent.app.ui.menu;
    app.ui.taskbar = parent.app.ui.taskbar;
    var context = app.context === "/" ? "/app" : app.context;
    var appTree = parent.app.appTree;
    var branch = context.split("/");
//    console.log(appTree, branch);
    for(var i = 1; i < branch.length; i++)
    {
      if(typeof appTree[branch[i]] === "undefined")
      {
        console.log("app tree error");
      }
      appTree = appTree[branch[i]];
    }
//    console.log(appTree, branch);
    eventAppListChanged(parent.app.apps, appTree);
  }
}

// functions -------------------------------------------------------------------

function eventAppListChanged(data, appTree)
{
  app.ui.menu.html("");
  app.ui.taskbar.app_menu.html("");

  var apps = data || {};
  console.log("apps-changed", apps, data, appTree);
  init_appTree(appTree);
//  return;
//  for(var k in apps)
//  {
//    var a = apps[k];
////    console.log(k, a);
//    task_create(a);
//  }
//  for(var k in appTree)
//  {
//    var a = appTree[k];
////    console.log(k, a);
//    task_create(a);
//  }
}

function init_appTree(apps)
{
//console.log("init_appTree - init", apps);
  if(apps.$app && apps.$app.type === "menu" && app.context !== apps.$app.path)
  {
//console.log("init_appTree - menu", apps.$app);
    task_create(apps.$app);
    return;
  }
  
  for(var k in apps)
  {
    var a = apps[k];
//    console.log(k, a);
    if(k === "$app" && !(a.type === "menu" && app.context === a.path))
    {
//console.log("init_appTree - create", k, a);
      task_create(a);
    }
    else if(k !== "$app")
    {
//console.log("init_appTree - loop", a);
      init_appTree(a);
    }
  }
}

function init_main()
{
  var e;
  
  e = new m.ui.Element().id("main").parent(0);
  e.classes.add("main");
  
  var container;
  container = new m.ui.Module().id("background_focus_stealer").parent(e);
//  container = new m.ui.Element("iframe").id("background_focus_stealer").parent(e);
  container.classes.add("background_focus_stealer");
  e.container = container;
  
  return e;
}

function init_menu()
{
  var e;
  
  e = new m.ui.Element().id("menu").visible(true).parent(0);
  e.classes.add("menu");
  
  if(app.ui.type === "menu" && app.ui.type !== "submenu")
  {
    var menu_keydown_event = m.util.keyBindEnterEsc(null, function()
    {
      app.ui.menu.visible(false);
      app.ui.taskbar.visible(true);
//      document.body.removeEventListener("keydown", menu_keydown_event);
    });
    document.body.addEventListener("keydown", menu_keydown_event);
  }
  
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
  });
  
  var navbar;
  navbar = new m.ui.Element().id("navbar");
  navbar.classes.add("taskbar_item");
  navbar.classes.add("taskbar_button");
  
  var sys_menu_button;
  sys_menu_button = new m.ui.Element().id("taskbar_sys_button");
  sys_menu_button.classes.add("taskbar_item");
  sys_menu_button.classes.add("taskbar_button");
  sys_menu_button.html("<i class=\"icon-user\"></i>");
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

//------------------------------------------------------------------------------

function task_create(info)
{
  var button = new m.ui.Element().text(info.title);
  button.classes.add("menu_task_button");
  button.register("click", function()
  {
    task_show(info);
  });
  
  info.menu_button = button;
  
  button.parent(app.ui.menu);
}

//------------------------------------------------------------------------------

function task_show(info)
{
  console.log("task_show", info);
  
  if(info.initialized !== true)
  {
    var button = new m.ui.Element().text(info.title);
    button.classes.add("taskbar_menu_item");
    button.classes.add("taskbar_menu_button");
    button.classes.add("menu_item");
    button.classes.add("menu_button");
    
    button.register("click", function()
    {
//      app.ui.menu.visible(false);
//      app.ui.taskbar.visible(true);
      app.ui.taskbar.app_menu.visible(false);
      task_show(info);
    });
    
    info.taskbar_button = button;
    
//    button.parent(app.ui.taskbar.app_menu);
    app.ui.taskbar.app_menu.node.appendChild(button.node);
  }
  
  info.show();
  
  if(app.ui.type === "menu" && app.ui.type !== "submenu")
  {
    app.ui.menu.visible(false);
    app.ui.taskbar.visible(true);
    app.ui.taskbar.app_menu.visible(false);
  }
  else if(app.ui.type !== "menu" && app.ui.type === "submenu")
  {
    parent.app.ui.menu.visible(false);
  }
}

//------------------------------------------------------------------------------
