package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;
import m.file.*;
import m.stream.*;

public class FSAuthorizator extends BaseAuthorizator<FileSystem>
{
  protected static final String PATH_SEPARATOR = "/";
  
  protected BaseAuthorizatorSession createBaseSession(String id) throws Exception
  {
    return new BaseAuthorizatorSession().init(this, id);
  }
  
  public ObjInput getIDProfileAndRoles(String authentication, String id) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + "id-role-map" + PATH_SEPARATOR + id;
//      String path = "id" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + id + PATH_SEPARATOR + "profile";
//      String path = "id" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + id + PATH_SEPARATOR + "roles";
//      throw new Exception();
    
    m.Global.log.debug(path, get().isFile(path));
    
    if(!get().isFile(path))
    {
      return null;
    }
    
    StreamSeekable stream = get().stream(path);
    Obj profileObj = new Obj();
    profileObj.streamFromInput(stream);
    
    m.Global.log.debug(path, get().isFile(path), profileObj.object());
    
    return profileObj;
  }
  
  public Map<String, Boolean> getAuthenticationSecurityRules(String authentication, String type, String name) throws Exception
  {
    String path = "authentication" + PATH_SEPARATOR + authentication + PATH_SEPARATOR + type + PATH_SEPARATOR + name;
    return getSecurityRules(path);
  }
  
  public Map<String, Boolean> getAttributeSecurityRules(String attribute, String name) throws Exception
  {
    String path = "attribute" + PATH_SEPARATOR + attribute + PATH_SEPARATOR + name;
    return getSecurityRules(path);
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
}
