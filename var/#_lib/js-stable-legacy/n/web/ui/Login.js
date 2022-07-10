//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function Login()
{
  return Class(Login).construct(this, arguments);
}

Class(Login)
.inherit(core.ElementControl)
.property("title", "")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

Login.prototype.render = function()
{
  this.html("");
  
  var title = new m.web.ui.core.Element().parent(this);
  title.classes.add("Title");
  title.html(this.title());
  
  var form = new m.web.ui.core.Element().parent(this);
  form.classes.add("Form");
  form.html("<table><tr><td>Username</td><td><input class='textinput' type='text' name='username' /></td></tr><tr><td>Password</td><td><input class='textinput' type='password' name='password' /></td></tr></table");
  
  var button = new m.web.ui.core.Element().parent(this);
  button.classes.add("Button");
  button.html("<input type='button' value='Login' />");
  
  var self = this;
  function login()
  {
    var username = form.select("input[name='username']")[0].value;
    var password = form.select("input[name='password']")[0].value;
    var s = new m.web.Server().url("auth/login").method("POST").params({username: username, password: password});
    s.success = function(data, mime, method, xhr)
    {
      console.log(data);
      if(data.login)
      {
        self.success();
      }
      else if(data.chpwd)
      {
        var pc = new LoginPasswordChange();
        pc.title("Change Password Required!");
        pc.username(username);
        pc.password(password);
        
        var parent = self.parent();
        self.parent().removeChild(self.node);
        pc.parent(parent);
      }
      else
      {
        self.error();
      }
    };
    s.execute();
  }
  
  function enter(event)
  {
    if(event.keyCode === 13)
    {
      login();
      return false;
    }
    return true;
  }
  
  button.node.firstChild.addEventListener("click", login);
  form.select("input[name='username']")[0].addEventListener("keypress", enter);
  form.select("input[name='password']")[0].addEventListener("keypress", enter);
  
  return this;
};

//------------------------------------------------------------------------------

Login.prototype.success = function()
{
};

//------------------------------------------------------------------------------

Login.prototype.error = function()
{
};

//------------------------------------------------------------------------------
