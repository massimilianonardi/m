package m.auth;

import java.util.*;

public interface AuthorizatorManager
{
  public List<String> roles(String authentication) throws Exception;
  public List<String> ids(String authentication) throws Exception;
  public List<String> idsWithRole(String authentication, String role) throws Exception;
  
  public List<String> idRoles(String authentication, String id) throws Exception;
  public void idRoles(String authentication, String id, List<String> roles) throws Exception;
  
  public Map<String, Boolean> roleSecurityRules(String authentication, String role) throws Exception;
  public void roleSecurityRules(String authentication, String role, Map<String, Boolean> roleSecurityRules) throws Exception;
}
