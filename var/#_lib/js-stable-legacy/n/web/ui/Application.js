//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Application()
{
  return Class(Application).construct(this, arguments);
}

Class(Application)
//.inherit(core.ElementControl)
//.property("label", "label")
//.property("children", "children")
//.property("callback", function(){})
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Application.prototype.construct = function()
{
  $.noty.defaults = 
  {
    layout: 'bottomRight', // 'top', 'topLeft', 'topCenter', 'topRight', 'centerLeft', 'center', 'centerRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'bottom'
    theme: 'relax', // 'defaultTheme', 'bootstrapTheme', 'relax'
    type: 'alert', // 'alert', 'success', 'error', 'warning', 'information', 'confirm'
    text: '', // can be html or string
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: 
    {
      open: 'animated bounceInRight', // or Animate.css class names like: 'animated bounceInLeft'
      close: 'animated bounceOutRight', // or Animate.css class names like: 'animated bounceOutLeft'
      easing: 'swing', // not used with Animate.css
      speed: 500 // opening & closing animation speed. Not used with Animate.css
    },
    timeout: 15000, // false, milliseconds -> delay for closing event. Set false for sticky notifications
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 8, // you can set max visible notification for dismissQueue true option,
    killer: false, // for close all notifications before show
    closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
    callback: 
    {
      onShow: function() {},
      afterShow: function() {},
      onClose: function() {},
      afterClose: function() {},
      onCloseClick: function() {}
    },
    buttons: false // an array of buttons
  };
  
//  noty({type: "warning", text: "warning"});
//  noty({type: "error", text: "error"});
//  noty({type: "alert", text: "alert"});
//  noty({type: "success", text: "success"});
//  noty({type: "information", text: "information"});
//  noty({type: "confirm", text: "confirm"});
  
  // events
  var dataAuthPendingQueue = [];
  m.web.Server.prototype.authenticate = function(retryCallback)
  {
    dataAuthPendingQueue.push(retryCallback);
    auth.login.visible(true);
    noty({type: "information", text: "Autenticazione richiesta!"});
  };
  
  m.web.Server.prototype.error = function(status, data, method, xhr)
  {
    console.log("serverError", status, data, method, xhr);
    noty({type: "error", text: "Errore server! Codice: " + status});
  };
  
  TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLogin = function(data, mime, method, xhr)
  {
    item_right_dropdown_menu_login.visible(false);
    item_right_dropdown_menu_chpwd.visible(true);
    item_right_dropdown_menu_logout.visible(true);
    while(0 < dataAuthPendingQueue.length)
    {
      var retryCallback = dataAuthPendingQueue[0];
      dataAuthPendingQueue.splice(0,1);
      retryCallback();
    }
  };

  TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLoginError = function()
  {
  };

  TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLogout = function()
  {
    item_right_dropdown_menu_chpwd.visible(false);
    item_right_dropdown_menu_logout.visible(false);
    item_right_dropdown_menu_login.visible(true);
  };

  TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLogoutError = function()
  {
  };

  TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationChangePasswordRequired = function()
  {
  };

  TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationChangePassword = function()
  {
    item_right_dropdown_menu_login.visible(false);
    item_right_dropdown_menu_chpwd.visible(true);
    item_right_dropdown_menu_logout.visible(true);
  };

  TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationChangePasswordError = function()
  {
  };
  
  m.web.data.Data.prototype.eventDataChanged = function()
  {
    console.log("dataChanged");
    this.get();
    noty({type: "information", text: "Data changed!"});
  };
  m.web.data.Data.prototype.eventDataSave = function(data)
  {
    console.log("dataSaved", data);
    noty({type: "information", text: "Data saved!"});
  };
  m.web.data.Data.prototype.eventDataErrorLoad = function(status, data, xhr)
  {
    console.log("dataErrorLoad", status, data, xhr);
    noty({type: "error", text: "Errore nel caricamento dati! Codice: " + status});
  };
  m.web.data.Data.prototype.eventDataErrorSave = function(status, data, xhr)
  {
    console.log("dataErrorSave", status, data, xhr);
    noty({type: "error", text: "Errore nel salvataggio dati! Codice: " + status});
  };
  
  // todo get app config, role config, user profile
  m.web.ui.util.importCSS("file/app/theme/default.css");
//  m.sys.Lang().add("file/app/lang/default.json");
  
  var auth = new TWBootstrapAuthentication().parent(0);
  
  // navbar
  var navbar = new TWBootstrapNavigationBar().parent(0);
  
  var logo = new m.web.ui.core.Element("img").parent(navbar.logo);
  logo.node.src = "logo.png";
  
  var options = new m.web.ui.core.Element("li").parent(navbar.right);
  options.classes.add("dropdown");
  var item_right_dropdown_toggle = new m.web.ui.core.Element("a").parent(options);
  item_right_dropdown_toggle.classes.add("dropdown-toggle");
  item_right_dropdown_toggle.node.setAttribute("data-toggle", "dropdown");
  item_right_dropdown_toggle.node.setAttribute("role", "button");
  item_right_dropdown_toggle.node.setAttribute("aria-haspopup", "true");
  item_right_dropdown_toggle.node.setAttribute("aria-expanded", "false");
  item_right_dropdown_toggle.node.href = "#";
  item_right_dropdown_toggle.html("Opzioni <span class='caret'></span>");
  var item_right_dropdown_menu = new m.web.ui.core.Element("ul").parent(options);
  item_right_dropdown_menu.classes.add("dropdown-menu");
  
  var item_right_dropdown_menu_login = new m.web.ui.core.Element("li").parent(item_right_dropdown_menu);
  item_right_dropdown_menu_login.html("<a href='#'>Login</a>");
  item_right_dropdown_menu_login.node.firstChild.addEventListener("click", function()
  {
    auth.login.visible(true);
  });
  
  var item_right_dropdown_menu_chpwd = new m.web.ui.core.Element("li").parent(item_right_dropdown_menu);
  item_right_dropdown_menu_chpwd.html("<a href='#'>Cambia password</a>");
  item_right_dropdown_menu_chpwd.node.firstChild.addEventListener("click", function()
  {
    auth.password.visible(true);
  });
  
  var item_right_dropdown_menu_logout = new m.web.ui.core.Element("li").parent(item_right_dropdown_menu);
  item_right_dropdown_menu_logout.html("<a href='#'>Logout</a>");
  item_right_dropdown_menu_logout.node.firstChild.addEventListener("click", function()
  {
    auth.logout();
  });
  
  // TODO get a specific resource that requires authentication to see if logged and set login/chpwd/logout visibility accordingly

  this.navbar = navbar;
  this.auth = auth;
  this.options = options;
  
  this.eventInit();
};

//------------------------------------------------------------------------------

Application.prototype.loadConfig = function()
{
  var _this = this;
  
  function init(roleConfig, userConfig)
  {
    roleConfig = roleConfig || {};
    userConfig = userConfig || {};
    
    this.config = this.config || {};
    this.config.role = roleConfig;
    this.config.user = userConfig;
    
    console.log(this.config);
    _this.eventLoadConfig(this.config);
  }
  
  var appConfig = new m.web.data.Data();
  appConfig.eventDataLoad = function(data)
  {
    var roleConfig = {};
    if(data.data && data.data[0] && data.data[0][2])
    {
      roleConfig = JSON.parse(data.data[0][2]);
    }
    var profileConfig = new m.web.data.Data();
    profileConfig.eventDataLoad = function(data)
    {
      var userConfig = {};
      if(data.data && data.data[0] && data.data[0][2])
      {
        userConfig = JSON.parse(data.data[0][2]);
      }
      init(roleConfig, userConfig);
    };
    profileConfig.url("data/system/config/profiles");
  };
  appConfig.url("data/system/config/apps");
  
  return this;
};

//------------------------------------------------------------------------------

Application.prototype.eventInit = function()
{
  return this;
};

//------------------------------------------------------------------------------

Application.prototype.eventLoadConfig = function(config)
{
  return this;
};

//------------------------------------------------------------------------------
