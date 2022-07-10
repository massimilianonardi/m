
console.log("auth-man", this);

// globals ---------------------------------------------------------------------

var app = new m.App();
app
.init(main)
;

// main ------------------------------------------------------------------------

function main()
{
  console.log("auth-man-init-main");
  
  m.mod.loadLibraryDynamically("/m/app/pub/lib/m", "modules_ui_js.json", "modules_ui_css.json", null, null);
  
  app.noti.info(app.lang.get("global.welcome"));
  
//  new m.ui.CSS().id("font_roboto").path("https://fonts.googleapis.com/css?family=Roboto:300,400");
//  new m.ui.CSS().id("font_roboto_mono").path("https://fonts.googleapis.com/css?family=Roboto+Mono");
//  
////  new m.ui.CSS().id("css_material").path("https://fonts.googleapis.com/icon?family=Material+Icons");
////  new m.ui.CSS().id("css_fa").path("https://use.fontawesome.com/releases/v5.5.0/css/all.css");
//  
//  new m.ui.CSS().id("css_layout").path(app.root + "/style/default/layout.css");
//  new m.ui.CSS().id("css_style").path(app.root + "/style/default/style.css");
//  
//  app.ui.main = init_main();
//  app.ui.desktop = init_desktop();
//  app.ui.taskbar = init_taskbar();
  
  var container_1_label = new m.ui.Element().id("container_1_label").text(app.lang.get("auth.user-roles")).parent(0);
  
  var container = new m.ui.Element().id("container").parent(0);
  
  var authz = new m.srv.Authorization();
  
  var userSelect = new m.ui.Select().label(app.lang.get("auth.user")).id("user").parent(container);
  m.Class.listener(userSelect, "value", function(value, prev)
  {
    authz
    .success(function(data)
    {
//      console.log(data);
      rolesSelect.value(data);
    })
    .error(error)
    .getIDRoles(value);
  });
  
//  authz
  new m.srv.Authorization()
  .success(function(data)
  {
//    console.log(data);
    var map = {};
    for(var i = 0; i < data.length; i++)
    {
      map[data[i]] = data[i];
    }
//    console.log(map);
    userSelect.map(map);
    userSelect.value(userSelect.value());
  })
  .error(error)
  .ids();
  
  var rolesSelect = new m.ui.Select().label(app.lang.get("auth.roles")).id("roles").conf({multiple: true, startOpen: true, stayOpen: true}).parent(container);
  m.Class.listener(rolesSelect, "value", function(value, prev)
  {
//    console.log(value, prev, this);
  });
  
//  authz
  new m.srv.Authorization()
  .success(function(data)
  {
//    console.log(data);
    var map = {};
    for(var i = 0; i < data.length; i++)
    {
      map[data[i]] = data[i];
    }
//    console.log(map);
    rolesSelect.map(map);
    roleSelect.map(map);
    roleSelect.value(roleSelect.value());
  })
  .error(error)
  .roles();
  
  var saveButton = new m.ui.Button().label(app.lang.get("global.save")).id("save").parent(container);
  saveButton.callback(function()
  {
//    console.log("click save");
//    authz
    new m.srv.Authorization()
    .success(function(data)
    {
      console.log(data);
      app.noti.info(app.lang.get("global.success"));
    })
    .error(error)
    .setIDRoles(userSelect.value(), rolesSelect.value());
  });
  
  var container_2_label = new m.ui.Element().id("container_2_label").text(app.lang.get("auth.users-in-role")).parent(0);
  
  var container_roles = new m.ui.Element().id("container_roles").parent(0);
  
  var roleSelect = new m.ui.Select().label(app.lang.get("auth.role")).id("role").parent(container_roles);
  var usersSelect = new m.ui.Select().label(app.lang.get("auth.users")).id("users").conf({startOpen: true, stayOpen: true}).parent(container_roles);
  
  m.Class.listener(roleSelect, "value", function(value, prev)
  {
//    authz
    new m.srv.Authorization()
    .success(function(data)
    {
//      console.log(data);
      var map = {};
      for(var i = 0; i < data.length; i++)
      {
        map[data[i]] = data[i];
      }
//      console.log(map);
      usersSelect.map(map);
    })
    .error(error)
    .idsWithRole(value);
  });
  
  window.a = app;
  window.s = rolesSelect;
}

// functions -------------------------------------------------------------------

function error()
{
  console.error("error", this, arguments);
  app.noti.error(app.lang.get("global.error"));
}

//------------------------------------------------------------------------------
