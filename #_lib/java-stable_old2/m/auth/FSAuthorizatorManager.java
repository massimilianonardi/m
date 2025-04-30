package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;
import m.file.*;
import m.stream.*;

// todo: define beahaviour on save (currently no authorization applied) if must filter-out roles not authorized
// if get and set treat not authorized roles as transparent: filtered at get (?) and at set filtered from input but keep already existent
public class FSAuthorizatorManager extends ConfigurableWrapper<FileSystem> implements AuthorizatorManager
{
  protected static final String PATH_SEPARATOR = "/";
  
  public List<String> roles(String authentication) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "roles";
    
//    return get().list(path).list();
    Map<String, String> o = new HashMap<String, String>();
    o.put("regex", ".*");
    
    List<String> l = get().find(path, o).list();
    List<String> list = new ArrayList<String>();
    for(int i = 0; i < l.size(); i++)
    {
      String s = l.get(i);
      if(get().isFile(s))
      {
        s = s.replace(path + PATH_SEPARATOR, "");
        list.add(s);
      }
      m.Global.log.debug(l.get(i), path + PATH_SEPARATOR, s);
    }

    list.sort(null);
    
    return list;
  }
  
  public List<String> ids(String authentication) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "ids";
    
    return getList(path);
  }
  
  public List<String> idsWithRole(String authentication, String role) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "role-id-map" + PATH_SEPARATOR + role;
    
    return getList(path);
  }
  
  public List<String> idRoles(String authentication, String id) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "id-role-map" + PATH_SEPARATOR + id;
    
    return getList(path);
  }
  
  public void idRoles(String authentication, String id, List<String> roles) throws Exception
  {
    List<String> oldRoles = idRoles(authentication, id);
    
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "id-role-map" + PATH_SEPARATOR + id;
    setObj(path, new Obj(roles));
    
    for(String role: roles)
    {
      oldRoles.remove(role);
      
      path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "role-id-map" + PATH_SEPARATOR + role;
      Obj obj = getObj(path);
      if(obj == null)
      {
        obj = new Obj(new ArrayList<String>());
      }
      if(!obj.list().contains(id))
      {
        obj.add(id);
      }
      obj.list().sort(null);
      setObj(path, obj);
    }
    
    for(String role: oldRoles)
    {
      path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "role-id-map" + PATH_SEPARATOR + role;
      Obj obj = getObj(path);
      if(obj != null)
      {
        obj.list().remove(role);
        obj.list().sort(null);
        setObj(path, obj);
      }
    }
  }
  
  public Map<String, Boolean> roleSecurityRules(String authentication, String role) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "role" + PATH_SEPARATOR + role;
    
    return getSecurityRules(path);
  }
  
  public void roleSecurityRules(String authentication, String role, Map<String, Boolean> roleSecurityRules) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "role" + PATH_SEPARATOR + role;
    
    setSecurityRules(path, roleSecurityRules);
  }
  
  public Map<String, Boolean> getSecurityRules(String path) throws Exception
  {
    if(!get().isFile(path))
    {
      return null;
    }
    
    Map<String, Boolean> securityRules;
    
    StreamSeekable stream = get().stream(path);
    Obj securityRulesObj = new Obj();
    securityRulesObj.streamFromInput(stream);
    securityRules = securityRulesObj.map();
    
    m.Global.log.debug(path, securityRules);
    
    return securityRules;
  }
  
  public void setSecurityRules(String path, Map<String, Boolean> rules) throws Exception
  {
    StreamSeekable stream = object.stream(path);
    stream.write(new Obj(rules));
  }
  
  public List<String> getList(String path) throws Exception
  {
    Obj obj = getObj(path);
    
    return obj == null ? new ArrayList<String>() : obj.list();
  }
  
  public Obj getObj(String path) throws Exception
  {
    if(!get().isFile(path))
    {
      return null;
//      return new Obj();
    }
    
    StreamSeekable stream = get().stream(path);
    Obj obj = new Obj();
    obj.streamFromInput(stream);
    
    m.Global.log.debug(path, obj.object());
    
    return obj;
  }
  
  public void setObj(String path, Obj obj) throws Exception
  {
    String parent = object.parent(path);
    
    m.Global.log.debug(path, parent, object.root());
    
//    if(!object.isNode(parent))
    if(!object.exists(parent))
    {
      object.nodes(parent);
    }
    StreamSeekable stream = object.stream(path);
    stream.write(obj);
  }
}
