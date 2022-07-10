package m.auth;

import java.util.*;

//import m.object.*;

public interface Authorizator
{
  public interface Listener
  {
    public void sessionCreated(AuthorizatorSession session) throws Exception;
    public void sessionDestroy(AuthorizatorSession session) throws Exception;
    public void sessionRenamed(String oldSessionID, String newSessionID) throws Exception;
  }
  
  public void addListener(Listener listener) throws Exception;
  public void removeListener(Listener listener) throws Exception;
  public List<Listener> listeners() throws Exception;
  
//  public PrefixMap<AuthorizedService> services() throws Exception;
//  public Map<String, ZAuthenticatorManager> authenticators() throws Exception;
//  public Map<String, ZAuthenticator> authenticators() throws Exception;
  
  public AuthorizatorSession createSession() throws Exception;
  public AuthorizatorSession session(String sessionID) throws Exception;
  public void destroySession(String sessionID) throws Exception;
  public String renameSession(String sessionID) throws Exception;
}
