package m.auth;

import java.util.*;

import m.object.*;

public interface Authorizator
{
  public interface Listener
  {
    public void sessionCreated(AuthorizationSession session) throws Exception;
    public void sessionDestroyed(AuthorizationSession session) throws Exception;
  }
  
  public void addListener(Listener listener) throws Exception;
  public void removeListener(Listener listener) throws Exception;
  public List<Listener> listeners() throws Exception;
  
  public PrefixMap<AuthorizedService> services() throws Exception;
  public Map<String, Authenticator> authenticators() throws Exception;
  
  public AuthorizationSession createSession(String id) throws Exception;
  public void destroySession(String id) throws Exception;
  public AuthorizationSession session(String id) throws Exception;
}
