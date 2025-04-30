package m.auth;

import java.util.*;

import m.object.*;

public interface Z_AuthorizationSession
{
  public interface Listener
  {
    public void sessionCreated() throws Exception;
    public void sessionDestroyed() throws Exception;
    public void sessionChallenged(String authentication, String id) throws Exception;
    public void sessionUnchallenged(String authentication, String id) throws Exception;
    public void sessionAuthenticationExpired(String authentication, String id) throws Exception;
    public void sessionAuthenticated(String authentication, String id) throws Exception;
    public void sessionUnauthenticated(String authentication, String id) throws Exception;
    public void sessionAttributeChanged(String attribute, String previousValue, String value) throws Exception;
  }
  
  public interface Profiler extends Listener
  {
    public PrefixSet profiles() throws Exception;
    public List<String> profileStack() throws Exception;
    public PrefixMap<Boolean> authorization() throws Exception;
    public Map<String, Map<String, Boolean>> authorizations() throws Exception;
    public Map<String, Boolean> authorization(String key) throws Exception;
    public Obj configuration() throws Exception;
    public Map<String, Obj> configurations() throws Exception;
    public Obj configuration(String key) throws Exception;
  }
  
  public void addListener(Listener listener) throws Exception;
  public void removeListener(Listener listener) throws Exception;
  public List<Listener> listeners() throws Exception;
  
  public void destroy() throws Exception;
  
  public String id() throws Exception;
  
  public Z_Authorizator authorizator() throws Exception;
  public Profiler profiler() throws Exception;
  
  public String getAttribute(String attribute) throws Exception;
  public void setAttribute(String attribute, String value) throws Exception;
  public Map<String, String> attributes(String key) throws Exception;
  
  public ObjInput challenge(String authentication, String id) throws Exception;
  public ObjInput authenticate(String authentication, String id, ObjInput challengeProof) throws Exception;
  public ObjInput unauthenticate(String authentication, String id) throws Exception;
  
  public boolean authorize(String request) throws Exception;
  
  public boolean execute(String command, ObjInput in, ObjOutput out) throws Exception;
}
