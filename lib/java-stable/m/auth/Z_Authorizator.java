package m.auth;

import java.util.*;

import m.object.*;

public interface Z_Authorizator
{
  public interface Listener
  {
    public void sessionCreated(Z_AuthorizationSession session) throws Exception;
    public void sessionDestroyed(Z_AuthorizationSession session) throws Exception;
    public void sessionRenamed(Z_AuthorizationSession session) throws Exception;
  }
  
  public void addListener(Listener listener) throws Exception;
  public void removeListener(Listener listener) throws Exception;
  public List<Listener> listeners() throws Exception;
  
  public PrefixMap<Z_AuthorizedService> services() throws Exception;
  public Map<String, Z_AuthenticatorManager> authenticators() throws Exception;
  
  public Z_AuthorizationSession createSession() throws Exception;
  public void destroySession(String id) throws Exception;
  public String renameSession(String id) throws Exception;
  public Z_AuthorizationSession session(String id) throws Exception;
}
