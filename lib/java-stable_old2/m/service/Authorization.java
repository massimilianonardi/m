package m.service;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

//public class Authorization implements ConfigurableObject, AuthorizedService
public class Authorization extends ConfigurableWrapper<AuthorizatorManager> implements AuthorizedService
{
  static final protected String CMD_SEPARATOR = "/";
  
  static final protected String CMD_ROLES = "roles";
  static final protected String CMD_IDS = "ids";
  static final protected String CMD_IDSWITHROLE = "idsWithRole";
  static final protected String CMD_GETIDROLES = "getIDRoles";
  static final protected String CMD_SETIDROLES = "setIDRoles";
  static final protected String CMD_GETRULES = "getRules";
  static final protected String CMD_SETRULES = "setRules";
  
  static final protected String SEPARATOR = "/";
  
  static final protected String AUTHENTICATION_PREFIX = "authentication";
  static final protected String AUTHENTICATION_DEFAULT = "id";
  
  static final protected String HTTP_FIELD_ROLES = "roles";
  static final protected String HTTP_FIELD_RULES = "rules";
  
  static final protected String APP_PREFIX = "/m/authorization/role/";
  
  protected String appPrefix = APP_PREFIX;
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
    if(params.string(Conf.PREFIX) != null)
    {
      appPrefix = params.string(Conf.PREFIX);
    }
  }
  
  public void execute(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String cmd;
    String authn;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      cmd = command;
      authn = null;
    }
    else
    {
      cmd = command.substring(0, index);
      authn = command.substring(index + CMD_SEPARATOR.length());
    }
    
    m.Global.log.debug(cmd, authn);
    
    executePath(session, cmd, authn, in, out);
  }
  
  public void executePath(AuthorizatorSession session, String command, String authn, ObjInput in, ObjOutput out) throws Exception
  {
    switch(command)
    {
      case CMD_ROLES: roles(session, authn, in, out); break;
      case CMD_IDS: ids(session, authn, in, out); break;
      case CMD_IDSWITHROLE: idsWithRole(session, authn, in, out); break;
      case CMD_GETIDROLES: getIDRoles(session, authn, in, out); break;
      case CMD_SETIDROLES: setIDRoles(session, authn, in, out); break;
      case CMD_GETRULES: getRules(session, authn, in, out); break;
      case CMD_SETRULES: setRules(session, authn, in, out); break;
      default: m.Global.log.debug(command, "unrecognized command exception!"); throw new Exception();
    }
  }
  
  public void roles(AuthorizatorSession session, String authn, ObjInput in, ObjOutput out) throws Exception
  {
//    out.set(get().roles(authn));
    List<String> l = get().roles(authn);
    List<String> list = authorizedRoles(session, l);
    list.sort(null);

    out.set(list);
  }
  
  public void ids(AuthorizatorSession session, String authn, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(get().ids(authn));
  }
  
  public void idsWithRole(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authn;
    String role;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      authn = command;
      role = null;
    }
    else
    {
      authn = command.substring(0, index);
      role = command.substring(index + CMD_SEPARATOR.length());
    }
    
    m.Global.log.debug(authn, role);
    
    out.set(get().idsWithRole(authn, role));
  }
  
  public void getIDRoles(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authn;
    String id;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      authn = command;
      id = null;
    }
    else
    {
      authn = command.substring(0, index);
      id = command.substring(index + CMD_SEPARATOR.length());
    }
    
    m.Global.log.debug(authn, id);
    
    out.set(authorizedRoles(session, get().idRoles(authn, id)));
  }
  
  public void setIDRoles(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authn;
    String id;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      authn = command;
      id = null;
    }
    else
    {
      authn = command.substring(0, index);
      id = command.substring(index + CMD_SEPARATOR.length());
    }
    
    List<String> roles = authorizedRoles(session, in.list(HTTP_FIELD_ROLES));
    List<String> previousRoles = get().idRoles(authn, id);
    previousRoles.removeAll(authorizedRoles(session, previousRoles));
    roles.addAll(previousRoles);
    
    m.Global.log.debug(authn, id, roles);
    
    get().idRoles(authn, id, roles);
    
    out.set(true);
  }
  
  public void getRules(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authn;
    String role;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      authn = command;
      role = null;
    }
    else
    {
      authn = command.substring(0, index);
      role = command.substring(index + CMD_SEPARATOR.length());
    }
    
    m.Global.log.debug(authn, role);
    
    out.set(get().roleSecurityRules(authn, role));
  }
  
  public void setRules(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authn;
    String role;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      authn = command;
      role = null;
    }
    else
    {
      authn = command.substring(0, index);
      role = command.substring(index + CMD_SEPARATOR.length());
    }
    
    Map<String, Boolean> rules = in.map(HTTP_FIELD_RULES);
    
    m.Global.log.debug(authn, role, rules);
    
    get().roleSecurityRules(authn, role, rules);
    
    out.set(true);
  }
  
  public List<String> authorizedRoles(AuthorizatorSession session, List<String> roles) throws Exception
  {
    List<String> list = new ArrayList<String>();
    if(roles != null)
    {
      for(int i = 0; i < roles.size(); i++)
      {
        String s = roles.get(i);
        if(session.authorize(appPrefix.substring(1) + s))
        {
          list.add(s);
        }
      }
    }
    
    return list;
  }
}
