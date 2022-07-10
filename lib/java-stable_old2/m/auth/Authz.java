package m.auth;

import java.util.*;

import m.object.*;

public interface Authz
{
  public interface Manager
  {
    public List<String> roles(String authentication) throws Exception;
    public List<String> ids(String authentication) throws Exception;
    public List<String> idsWithRole(String authentication, String role) throws Exception;

    public List<String> idRoles(String authentication, String id) throws Exception;
    public void idRoles(String authentication, String id, List<String> roles) throws Exception;

    public Map<String, Boolean> roleSecurityRules(String authentication, String role) throws Exception;
    public void roleSecurityRules(String authentication, String role, Map<String, Boolean> roleSecurityRules) throws Exception;
  }
  
  public interface Session
  {
    public Authorizator authorizator() throws Exception;
    public String id() throws Exception;
    public List<String> profiles() throws Exception;

    public String challenge(String authentication, String id) throws Exception;
    public Boolean authenticate(String authentication, String id, String challengeProof) throws Exception;
    public Boolean unauthenticate(String authentication, String id) throws Exception;

    public boolean authorize(String request) throws Exception;
    public boolean execute(String command, ObjInput in, ObjOutput out) throws Exception;

  //  public String getAttribute(String attribute) throws Exception;
  //  public void setAttribute(String attribute, String value) throws Exception;
  //  public void removeAttribute(String attribute) throws Exception;
  //  public Map<String, String> attributes() throws Exception;
  }
  
  public interface Service
  {
    public void execute(Session session, String command, ObjInput in, ObjOutput out) throws Exception;
  }
  
  public interface ServiceStateless extends Service
  {
    default public void execute(Session session, String command, ObjInput in, ObjOutput out) throws Exception
    {
      execute(command, in, out);
    }

    public void execute(String command, ObjInput in, ObjOutput out) throws Exception;
  }
}
