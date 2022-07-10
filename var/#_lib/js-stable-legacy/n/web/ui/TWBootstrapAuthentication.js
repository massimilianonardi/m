//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function TWBootstrapAuthentication()
{
  return Class(TWBootstrapAuthentication).construct(this, arguments);
}

Class(TWBootstrapAuthentication)
.inherit(core.Element)
//.property("label", "label")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.construct = function()
{
  var _this = this;
  var login = new m.web.ui.core.Element().parent(this).html("<div class='modal' id='login-modal' tabindex='-1' role='dialog' style='display: initial;'> <div class='modal-dialog'><div class='loginmodal-container'><h1>Login</h1><br><form><input type='text' name='username' placeholder='Username'><input type='password' name='password' placeholder='Password'><input type='button' name='login' class='login loginmodal-submit' value='Login'> <input type='button' name='login' class='login loginmodal-cancel' value='Annulla'> </form></div></div></div>");
  login.visible(false);
  function loginDo()
  {
    var username = login.select("input[name='username']")[0].value;
    var password = login.select("input[name='password']")[0].value;
    login.select("input[name='password']")[0].value = "";
    var s = new m.web.Server().url("auth/login").method("POST").params({username: username, password: password});
    s.success = function(data, mime, method, xhr)
    {
      if(data.login)
      {
        chpwd.select("input[name='username']")[0].value = username;
        login.visible(false);
        _this.eventBootstrapAuthenticationLogin(data, mime, method, xhr);
        noty({type: "information", text: "Login effettuato con successo!"});
      }
      else if(data.chpwd)
      {
        login.visible(false);
        chpwd.visible(true);
        chpwd.select("input[name='username']")[0].value = username;
        chpwd.select("input[name='password']")[0].value = password;
        _this.eventBootstrapAuthenticationChangePasswordRequired(data, mime, method, xhr);
        noty({type: "warning", text: "Cambio password richiesto!"});
      }
      else
      {
        _this.eventBootstrapAuthenticationLoginError(data, mime, method, xhr);
        noty({type: "error", text: "Error!"});
      }
    };
    s.execute();
  }
  login.select(".loginmodal-submit")[0].addEventListener("click", loginDo);
  login.select(".loginmodal-cancel")[0].addEventListener("click", function()
  {
    login.visible(false);
  });
  
  function loginEnter(event)
  {
    if(event.keyCode === 13)
    {
      loginDo();
      return false;
    }
    return true;
  }
  
  function loginEsc(event)
  {
    if(event.keyCode === 27 || event.key === "Escape")
    {
      login.visible(false);
      return false;
    }
    return true;
  }
  
  login.select("input[name='username']")[0].addEventListener("keypress", loginEnter);
  login.select("input[name='password']")[0].addEventListener("keypress", loginEnter);
  login.select("input[name='username']")[0].addEventListener("keyup", loginEsc);
  login.select("input[name='password']")[0].addEventListener("keyup", loginEsc);
  
  // password change
  var chpwd = new m.web.ui.core.Element().parent(this).html("<div class='modal' id='chpwd-modal' tabindex='-1' role='dialog' style='display: initial;'> <div class='modal-dialog'><div class='loginmodal-container'><h1>Cambio password</h1><br><form><input type='text' name='username' placeholder='Username'><input type='password' name='password' placeholder='Vecchia password'><input type='password' name='passwordNew' placeholder='Nuova password'><input type='password' name='passwordNewVerify' placeholder='Verifica nuova password'><input type='button' name='login' class='login loginmodal-submit' value='Cambia password'> <input type='button' name='login' class='login loginmodal-cancel' value='Annulla'> </form></div></div></div>");
  chpwd.visible(false);
  function chpwdDo()
  {
    var username = chpwd.select("input[name='username']")[0].value;
    var password = chpwd.select("input[name='password']")[0].value;
    var passwordNew = chpwd.select("input[name='passwordNew']")[0].value;
    var passwordNewVerify = chpwd.select("input[name='passwordNewVerify']")[0].value;
    chpwd.select("input[name='password']")[0].value = "";
    chpwd.select("input[name='passwordNew']")[0].value = "";
    chpwd.select("input[name='passwordNewVerify']")[0].value = "";
    if(passwordNew !== passwordNewVerify)
    {
      noty({type: "error", text: "\"Nuova password\" e \"Verifica nuova password\" non sono uguali!"});
      chpwd.select("input[name='passwordNew']")[0].value = "";
      chpwd.select("input[name='passwordNewVerify']")[0].value = "";
      return;
    }
    var s = new m.web.Server().url("auth/passwordChange").method("POST").params({username: username, password: password, passwordNew: passwordNew, passwordNewVerify: passwordNewVerify});
    s.success = function(data, mime, method, xhr)
    {
      console.log(data, mime, method, xhr);
      if(data.login)
      {
        chpwd.visible(false);
        _this.eventBootstrapAuthenticationChangePassword(data, mime, method, xhr);
        noty({type: "information", text: "Password cambiata con successo!"});
      }
      else
      {
        _this.eventBootstrapAuthenticationChangePasswordError(data, mime, method, xhr);
        noty({type: "error", text: "Errore nel cambio password!"});
      }
    };
    s.execute();
  }
  chpwd.select(".loginmodal-submit")[0].addEventListener("click", chpwdDo);
  chpwd.select(".loginmodal-cancel")[0].addEventListener("click", function()
  {
    chpwd.visible(false);
  });
  
  function chpwdEnter(event)
  {
    if(event.keyCode === 13)
    {
      chpwdDo();
      return false;
    }
    return true;
  }
  
  function chpwdEsc(event)
  {
    if(event.keyCode === 27 || event.key === "Escape")
    {
      chpwd.visible(false);
      return false;
    }
    return true;
  }
  
  chpwd.select("input[name='username']")[0].addEventListener("keypress", chpwdEnter);
  chpwd.select("input[name='password']")[0].addEventListener("keypress", chpwdEnter);
  chpwd.select("input[name='passwordNew']")[0].addEventListener("keypress", chpwdEnter);
  chpwd.select("input[name='passwordNewVerify']")[0].addEventListener("keypress", chpwdEnter);
  chpwd.select("input[name='username']")[0].addEventListener("keyup", chpwdEsc);
  chpwd.select("input[name='password']")[0].addEventListener("keyup", chpwdEsc);
  chpwd.select("input[name='passwordNew']")[0].addEventListener("keyup", chpwdEsc);
  chpwd.select("input[name='passwordNewVerify']")[0].addEventListener("keyup", chpwdEsc);
  
  this.login = login;
  this.password = chpwd;
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.logout = function()
{
  var _this = this;
  
  var s = new m.web.Server().url("auth/logout");
  s.success = function(data, mime, method, xhr)
  {
    if(!data.login)
    {
      // logout succesful
      _this.eventBootstrapAuthenticationLogout(data, mime, method, xhr);
      noty({type: "information", text: "Logout effettuato con successo!"});
    }
    else
    {
      // logout error
      console.log(data);
      _this.eventBootstrapAuthenticationLogoutError(data, mime, method, xhr);
      noty({type: "error", text: "Errore nel logout!"});
    }
  };
  s.error = function(status, data, method, xhr)
  {
    // logout error
    console.log(status, data, method, xhr);
    _this.eventBootstrapAuthenticationLogoutError(data, undefined, method, xhr);
    noty({type: "error", text: "Errore nel logout! Codice: " + status});
  };
  s.execute();
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLogin = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLoginError = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLogout = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationLogoutError = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationChangePasswordRequired = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationChangePassword = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------

TWBootstrapAuthentication.prototype.eventBootstrapAuthenticationChangePasswordError = function(data, mime, method, xhr)
{
};

//------------------------------------------------------------------------------
