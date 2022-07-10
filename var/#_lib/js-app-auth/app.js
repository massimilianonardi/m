
console.log("auth", this);

// globals ---------------------------------------------------------------------

g = g || {};
g.ui = g.ui || {};
g.ui.registration = g.ui.registration || {};
g.ui.authentication = g.ui.authentication || {};
g.ui.unauthentication = g.ui.unauthentication || {};
g.ui.credential = g.ui.credential || {};
g.ui.settings = g.ui.settings || {};

g.event = g.event || {};

g.session = g.session || {};

// main ------------------------------------------------------------------------

var app = new m.App();
app.init(main);

// functions -------------------------------------------------------------------

function main()
{
  console.log("authn-main");
  
//  app.noti.info("authn");
  
  new m.ui.CSS().id("css_layout").path(app.root + "/style/default/layout.css");
  new m.ui.CSS().id("css_style").path(app.root + "/style/default/style.css");
  
//  g.ui.registration.container = new m.ui.Element().id("registration").import(app.root + "/html/registration.html", app.queue.add(registrationInit));
  g.ui.authentication.container = new m.ui.Element().id("authentication").import(app.root + "/html/authentication.html", app.queue.add(authenticationInit));
  g.ui.unauthentication.container = new m.ui.Element().id("unauthentication").import(app.root + "/html/unauthentication.html", app.queue.add(unauthenticationInit));
  g.ui.credential.container = new m.ui.Element().id("credential").import(app.root + "/html/credential.html", app.queue.add(credentialInit));
//  g.ui.settings.container = new m.ui.Element().id("settings").import(app.root + "/html/settings.html", app.queue.add(settingsInit));
//  
//  g.ui.registration.container.classes.add("authentication");
  g.ui.authentication.container.classes.add("authentication");
  g.ui.unauthentication.container.classes.add("authentication");
  g.ui.credential.container.classes.add("authentication");
//  g.ui.settings.container.classes.add("authentication");
  
  g.ui.authentication.container.visible(false).parent(0);
  g.ui.unauthentication.container.visible(false).parent(0);
  g.ui.credential.container.visible(false).parent(0);
  
  if(app.session.id === null || app.session.id === "")
  {
    g.ui.authentication.container.visible(true);
  }
  else
  {
//    g.ui.unauthentication.id.value = app.session.id;
    g.ui.unauthentication.container.visible(true);
  }
  
//  app.ui.authentication = new m.ui.Element().id("authentication").import(app.root + "/html/authentication.html", app.queue.add(authenticationInit));
//  app.ui.authentication.classes.add("authentication");
//  app.ui.authentication.parent(0);
}

//------------------------------------------------------------------------------

g.ui.authentication.show = function(id, credential)
{
//  console.log("g.ui.authentication.show");
  
  if(typeof g.ui.authentication.container === "undefined" || typeof g.ui.authentication.id === "undefined" || typeof g.ui.authentication.credential === "undefined")
  {
    return;
  }
  
  g.ui.authentication.id.value = "";
  g.ui.authentication.credential.value = "";
  
//  g.ui.hide();
//  g.ui.authentication.container.visible(true);
//  g.ui.authentication.container.parent(0);
  
  if(typeof id === "string" && id !== "")
  {
    g.ui.authentication.id.value = id;
    g.ui.authentication.credential.focus();
  }
  else if(typeof g.session.id === "string" && g.session.id !== "")
  {
    g.ui.authentication.id.value = g.session.id;
    g.ui.authentication.credential.focus();
  }
  else
  {
    g.ui.authentication.id.focus();
  }
};

g.ui.authentication.hide = function()
{
//  console.log("g.ui.authentication.hide");
  
  if(typeof g.ui.authentication.container === "undefined" || typeof g.ui.authentication.id === "undefined" || typeof g.ui.authentication.credential === "undefined")
  {
    return;
  }
  
  g.ui.authentication.id.value = "";
  g.ui.authentication.credential.value = "";
  
//  g.ui.authentication.container.parent(null);
//  g.ui.authentication.container.visible(false);
  
//  g.ui.show();
  app.authenticationEnd();
};

g.ui.credential.show = function(id, credential, credentialNew, credentialNewVerify)
{
  if(typeof g.ui.credential.container === "undefined" || typeof g.ui.credential.id === "undefined" || typeof g.ui.credential.credential === "undefined" || typeof g.ui.credential.credentialNew === "undefined" || typeof g.ui.credential.credentialNewVerify === "undefined")
  {
    return;
  }
  
  g.ui.credential.id.value = "";
  g.ui.credential.credential.value = "";
  g.ui.credential.credentialNew.value = "";
  g.ui.credential.credentialNewVerify.value = "";
  
//  g.ui.hide();
  g.ui.credential.container.visible(true);
  g.ui.credential.container.parent(0);
  
  if(typeof id === "string" && id !== "")
  {
    g.ui.credential.id.value = id;
    g.ui.credential.credential.focus();
  }
  else if(typeof app.session.id === "string" && app.session.id !== "")
  {
    g.ui.credential.id.value = app.session.id;
    g.ui.credential.id.readOnly = true;
    g.ui.credential.credential.focus();
  }
  else
  {
    g.ui.credential.id.focus();
  }
};

g.ui.credential.hide = function()
{
  if(typeof g.ui.credential.container === "undefined" || typeof g.ui.credential.id === "undefined" || typeof g.ui.credential.credential === "undefined" || typeof g.ui.credential.credentialNew === "undefined" || typeof g.ui.credential.credentialNewVerify === "undefined")
  {
    return;
  }
  
  g.ui.credential.id.value = "";
  g.ui.credential.credential.value = "";
  g.ui.credential.credentialNew.value = "";
  g.ui.credential.credentialNewVerify.value = "";
  
  g.ui.credential.container.parent(null);
  g.ui.credential.container.visible(false);
  
//  g.ui.show();
};

//------------------------------------------------------------------------------

function registrationInit()
{
}

function authenticationInit()
{
//  console.log("authenticationInit");
  
//  console.log("authenticationInit", app.lang);
  
  this.node.innerHTML = m.util.translate(this.node.innerHTML, app.lang);
  
  var _username = this.select("input")[0];
  var _password = this.select("input")[1];
//  this.node.addEventListener("keydown", keyBindEnterEsc(authenticate, g.ui.authentication.hide));
  _username.addEventListener("keydown", keyBindEnterEsc(authenticate, g.ui.authentication.hide));
  _password.addEventListener("keydown", keyBindEnterEsc(authenticate, g.ui.authentication.hide));
  this.select("input")[2].addEventListener("click", authenticate);
  this.select("input")[3].addEventListener("click", g.ui.authentication.hide);
  
  g.ui.authentication.id = _username;
  g.ui.authentication.credential = _password;
}

function unauthenticationInit()
{
//  console.log("unauthenticationInit");
  
//  console.log("unauthenticationInit", app.lang);
  
  this.node.innerHTML = m.util.translate(this.node.innerHTML, app.lang);
  
  var _username = this.select("input")[0];
  _username.addEventListener("keydown", keyBindEnterEsc(authenticate, g.ui.authentication.hide));
  this.select("input")[1].addEventListener("click", unauthenticate);
  this.select("input")[2].addEventListener("click", g.ui.credential.show);
  this.select("input")[3].addEventListener("click", g.ui.authentication.hide);
  
  console.log(app.session, app.session["authn-man"]);
  if(app.session["authn-man"] !== true)
  {
    this.select("input")[2].style.display = "none";
  }
  
  g.ui.unauthentication.id = _username;
  
  if(app.session.id === null || app.session.id === "")
  {
//    g.ui.authentication.container.visible(true);
  }
  else
  {
    g.ui.unauthentication.id.value = app.session.id;
//    g.ui.unauthentication.container.visible(true);
  }
}

function credentialInit()
{
//  console.log("credentialInit");
  
//  console.log("credentialInit", app.lang);
  
  this.node.innerHTML = m.util.translate(this.node.innerHTML, app.lang);
  
  var _username = this.select("input")[0];
  var _password = this.select("input")[1];
  var _password_new = this.select("input")[2];
  var _password_new_verify = this.select("input")[3];
//  this.node.addEventListener("keydown", keyBindEnterEsc(authenticate, g.ui.authentication.hide));
  _username.addEventListener("keydown", keyBindEnterEsc(credential, g.ui.credential.hide));
  _password.addEventListener("keydown", keyBindEnterEsc(credential, g.ui.credential.hide));
  _password_new.addEventListener("keydown", keyBindEnterEsc(credential, g.ui.credential.hide));
  _password_new_verify.addEventListener("keydown", keyBindEnterEsc(credential, g.ui.credential.hide));
  this.select("input")[4].addEventListener("click", credential);
  this.select("input")[5].addEventListener("click", g.ui.credential.hide);
  
  g.ui.credential.id = _username;
  g.ui.credential.credential = _password;
  g.ui.credential.credentialNew = _password_new;
  g.ui.credential.credentialNewVerify = _password_new_verify;
}

function settingsInit()
{
}

//------------------------------------------------------------------------------

function keyBindEnterEsc(callbackOK, callbackCancel)
{
  return function(event)
  {
    if(event.keyCode === 13 || event.key === "Enter")
    {
      callbackOK();
      return false;
    }
    else if(event.keyCode === 27 || event.key === "Escape")
    {
      callbackCancel();
      return false;
    }
    return true;
  };
}

//------------------------------------------------------------------------------

function authenticate()
{
  var id = g.ui.authentication.id.value;
  var credential = g.ui.authentication.credential.value;
//  console.log("id", id, "credential", credential);
  
  app.authn
  .success(function()
  {
    app.noti.info(app.lang.get("auth.authenticationSuccess"));
//    g.ui.authentication.hide();
    parent.location.href = parent.location.href;
  })
  .unauthorized(function()
  {
    app.noti.warn(app.lang.get("auth.credentialChangeRequired"));
//    g.ui.authentication.hide();
    g.ui.authentication.container.visible(false);
    g.ui.credential.show(id);
  })
  .error(function()
  {
    app.noti.error(app.lang.get("auth.authenticationError"));
  })
  .authenticate(id, credential);
}

function credential()
{
  var id = g.ui.credential.id.value;
  var credentialOld = g.ui.credential.credential.value;
  var credentialNew = g.ui.credential.credentialNew.value;
//  console.log("id", id, "credentialOld", credentialOld, "credentialNew", credentialNew);
  
  if(g.ui.credential.credentialNew.value !== g.ui.credential.credentialNewVerify.value)
  {
    app.noti.error(app.lang.get("auth.credentialTheTwoDoNotMatchError"));
    return undefined;
  }
  if(g.ui.credential.credential.value === g.ui.credential.credentialNew.value)
  {
    app.noti.error(app.lang.get("auth.credentialOldAndNewMustNotMatchError"));
    return undefined;
  }
  
  app.authn
  .success(function()
  {
    app.noti.info(app.lang.get("auth.credentialChangeSuccess"));
    g.ui.credential.hide();
    app.noti.warn(app.lang.get("auth.authenticationRequired"));
    g.ui.authentication.show(id);
    unauthenticate();
  })
  .unauthorized(function()
  {
    app.noti.error(app.lang.get("auth.unauthorized"));
  })
  .error(function()
  {
    app.noti.error(app.lang.get("auth.credentialChangeError"));
  })
  .credential(id, credentialOld, credentialNew);
}

function unauthenticate()
{
  app.authn
  .success(function()
  {
    app.noti.info(app.lang.get("auth.unauthenticationSuccess"));
//    g.ui.unauthentication.hide();
    parent.location.href = parent.location.href;
  })
  .unauthorized(function()
  {
    app.noti.error(app.lang.get("auth.unauthorized"));
  })
  .error(function()
  {
    app.noti.error(app.lang.get("auth.unauthenticationError"));
  })
  .unauthenticate();
};
