//------------------------------------------------------------------------------
// Class -----------------------------------------------------------------------
//------------------------------------------------------------------------------

function LoginPasswordChange()
{
  return Class(LoginPasswordChange).construct(this, arguments);
}

Class(LoginPasswordChange)
.inherit(core.ElementControl)
.property("title", "")
.property("username", "")
.property("password", "")
.properties();

//------------------------------------------------------------------------------
// Methods ---------------------------------------------------------------------
//------------------------------------------------------------------------------

LoginPasswordChange.prototype.render = function()
{
  this.html("");
  
  var title = new core.Element().parent(this);
  title.classes.add("Title");
  title.html(this.title());
  
  var form = new core.Element().parent(this);
  form.classes.add("Form");
  form.html("<table><tr><td>New Password</td><td><input class='textinput' type='password' name='passwordNew' /></td></tr><tr><td>New Password (verify)</td><td><input class='textinput' type='password' name='passwordNewVerify' /></td></tr></table");
  
  var button = new core.Element().parent(this);
  button.classes.add("Button");
  button.html("<input type='button' value='Change' />");
  
  var self = this;
  function login()
  {
    var passwordNew = form.select("input[name='passwordNew']")[0].value;
    var passwordNewVerify = form.select("input[name='passwordNewVerify']")[0].value;
    if(passwordNew !== passwordNewVerify)
    {
      alert("'New Password' and 'New Password (verify)' are different!");
      form.select("input[name='passwordNew']")[0].value = "";
      form.select("input[name='passwordNewVerify']")[0].value = "";
      return;
    }
    var s = new m.web.Server().url("auth/passwordChange").method("POST").params({username: self.username(), password: self.password(), passwordNew: passwordNew, passwordNewVerify: passwordNewVerify});
    s.success = function(data, mime, method, xhr)
    {
      console.log(data);
      if(data.login)
      {
        self.success();
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
  form.select("input[name='passwordNew']")[0].addEventListener("keypress", enter);
  form.select("input[name='passwordNewVerify']")[0].addEventListener("keypress", enter);
  
  return this;
};

//------------------------------------------------------------------------------

LoginPasswordChange.prototype.success = function()
{
};

//------------------------------------------------------------------------------

LoginPasswordChange.prototype.error = function()
{
};

//------------------------------------------------------------------------------
