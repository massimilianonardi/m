package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;

public class BaseTemplateAuthorizator<T> extends BaseAuthorizator<T>
{
  protected BaseAuthorizatorSession createBaseSession(String id) throws Exception
  {
    return new BaseAuthorizatorSession().init(this, id);
  }
  
  public ObjInput getIDProfileAndRoles(String authentication, String id) throws Exception
  {
    throw new Exception();
  }
  
  public Map<String, Boolean> getAuthenticationSecurityRules(String authentication, String type, String name) throws Exception
  {
    throw new Exception();
  }
  
  public Map<String, Boolean> getAttributeSecurityRules(String attribute, String name) throws Exception
  {
    throw new Exception();
  }
}
