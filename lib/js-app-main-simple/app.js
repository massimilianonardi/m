
console.log("main", this);

// globals ---------------------------------------------------------------------

var app = new m.App();
app
.init(main)
.menu(eventAppListChanged, this.root === "/" ? "/app" : this.root)
;

// main ------------------------------------------------------------------------

function main()
{
  console.log("init-main");
  
//  app.noti.info("main");
  
  new m.ui.CSS().id("font_roboto").path("https://fonts.googleapis.com/css?family=Roboto:300,400");
  new m.ui.CSS().id("font_roboto_mono").path("https://fonts.googleapis.com/css?family=Roboto+Mono");
  
//  new m.ui.CSS().id("css_material").path("https://fonts.googleapis.com/icon?family=Material+Icons");
//  new m.ui.CSS().id("css_fa").path("https://use.fontawesome.com/releases/v5.5.0/css/all.css");
  
  new m.ui.CSS().id("css_layout").path(app.root + "/style/default/layout.css");
  new m.ui.CSS().id("css_style").path(app.root + "/style/default/style.css");
  
  app.ui.main = init_main();
  app.ui.desktop = init_desktop();
  app.ui.taskbar = init_taskbar();
}

// functions -------------------------------------------------------------------

function eventAppListChanged(data, appTree)
{
  app.ui.desktop.app_menu.html("");
  app.ui.taskbar.app_menu.html("");

  var apps = data || {};
  console.log("apps-changed", apps, data, appTree);
  for(var k in apps)
  {
    var a = apps[k];
//    console.log(k, a);
    task_create(a);
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

function init_desktop()
{
  var e;
  
  e = new m.ui.Element().id("desktop").visible(true).parent(0);
  e.classes.add("desktop");
  
  var app_menu = new m.ui.Element().id("desktop_app_menu");
  app_menu.classes.add("desktop_menu");
  app_menu.visible(true);
  app_menu.parent(e);
  e.app_menu = app_menu;
  
  var desktop_keydown_event = m.util.keyBindEnterEsc(null, function()
  {
    app.ui.desktop.visible(false);
    app.ui.taskbar.visible(true);
    document.body.removeEventListener("keydown", desktop_keydown_event);
  });
  document.body.addEventListener("keydown", desktop_keydown_event);
  
  return e;
}

function init_taskbar()
{
  var e;
  
  e = new m.ui.Element().id("taskbar").visible(false).parent(0);
  e.classes.add("taskbar");
  
  e.app_menu_button = init_app_menu_button().parent(e);
  e.sys_menu_button = init_sys_menu_button().parent(e);
  
  var app_menu = new m.ui.Element().id("taskbar_app_menu");
  app_menu.classes.add("taskbar_left_menu");
  app_menu.classes.add("taskbar_menu");
  app_menu.classes.add("menu");
  app_menu.visible(false);
  app_menu.parent(e);
  e.app_menu = app_menu;
  
  var sys_menu = app.ui.authn;
//  var sys_menu = new m.ui.Element("iframe").id("taskbar_sys_menu");
//  sys_menu.classes.add("auth_container");
////  sys_menu.style.height = "calc(100% - " + window.getComputedStyle(e.node).getPropertyValue("height") + ")";
//  sys_menu.visible(false);
//  sys_menu.parent(e);
  e.sys_menu = sys_menu;
  
  document.body.tabIndex= 0;
  document.body.addEventListener("blur", function()
  {
    app.ui.taskbar.app_menu.visible(false);
//    app.ui.taskbar.sys_menu.visible(false);
  });
  
  return e;
}

function init_app_menu_button()
{
  
  var app_menu_button;
  app_menu_button = new m.ui.Element().id("taskbar_app_button");
  app_menu_button.classes.add("taskbar_item");
  app_menu_button.classes.add("taskbar_button");
  app_menu_button.html("<i class=\"icon-apps\"></i>");
  app_menu_button.register("click", function()
  {
    app.ui.taskbar.app_menu.visible(!app.ui.taskbar.app_menu.visible());
    app.ui.taskbar.sys_menu.visible(false);
  });
  
  return app_menu_button;
}

function init_sys_menu_button()
{
  var sys_menu_button;
  sys_menu_button = new m.ui.Element().id("taskbar_sys_button");
  sys_menu_button.classes.add("taskbar_item");
  sys_menu_button.classes.add("taskbar_button");
  sys_menu_button.html("<i class=\"icon-user\"></i>");
  sys_menu_button.register("click", function()
  {
    app.authentication();
//    app.ui.taskbar.sys_menu.visible(!app.ui.taskbar.sys_menu.visible());
    app.ui.taskbar.app_menu.visible(false);
//    if(app.ui.taskbar.sys_menu.visible() === true)
//    {
//      app.ui.taskbar.app_menu_button.node.style.visibility = "hidden";
//    }
//    else
//    {
//      app.ui.taskbar.app_menu_button.node.style.visibility = "";
////      app.ui.taskbar.app_menu_button.node.style.visibility = "visible";
//    }
  });
  
  return sys_menu_button;
}

//------------------------------------------------------------------------------

function task_create(info)
{
  var desktop_button = new m.ui.Element().text(info.title);
  desktop_button.classes.add("desktop_task_button");
  desktop_button.register("click", function()
  {
    task_show(info);
  });
  
  var taskbar_button = new m.ui.Element().text(info.title);
  taskbar_button.classes.add("taskbar_menu_item");
  taskbar_button.classes.add("taskbar_menu_button");
  taskbar_button.classes.add("menu_item");
  taskbar_button.classes.add("menu_button");
  taskbar_button.register("click", function()
  {
    task_show(info);
  });
  
  info.taskbar_button = taskbar_button;
  info.desktop_button = desktop_button;
  
  taskbar_button.parent(app.ui.taskbar.app_menu);
  desktop_button.parent(app.ui.desktop.app_menu);
}

//------------------------------------------------------------------------------

function task_show(info)
{
  console.log("task_show", info);
  
  info.show();
  
  app.ui.desktop.visible(false);
  app.ui.taskbar.visible(true);
  app.ui.taskbar.app_menu.visible(false);
  app.ui.taskbar.sys_menu.visible(false);
}

//------------------------------------------------------------------------------
