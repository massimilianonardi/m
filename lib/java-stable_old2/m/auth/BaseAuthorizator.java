package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;

abstract public class BaseAuthorizator<T> extends ConfigurableWrapper<T> implements Authorizator
{
  protected IDGenerator idGenerator;
  protected Map<String, BaseAuthorizatorSession> sessions = new HashMap();
  protected List<Listener> listeners = new ArrayList();
  
  protected ConfigurableMap<Authenticator> authns;
  protected ConfigurableMap<AuthorizedService> services;
  
  public void construct(Obj args) throws Exception
  {
    idGenerator = new IDGenerator().dateFormat("yyyy-MM-dd_HH-mm-ss");
  }
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
    authns = m.Global.objects.get(ConfigurableMap.class, "m.conf.ConfigurableMap", null, params.get(Conf.AUTHENTICATIONS), null, null, null, null, null);
    services = m.Global.objects.get(ConfigurableMap.class, "m.conf.ConfigurableMap", null, params.get(Conf.SERVICES), null, null, null, null, null);
  }
  
  public void addListener(Listener listener) throws Exception
  {
    listeners.add(listener);
  }
  
  public void removeListener(Listener listener) throws Exception
  {
    listeners.remove(listener);
  }
  
  public List<Listener> listeners() throws Exception
  {
    return listeners;
  }
  
  public AuthorizatorSession createSession() throws Exception
  {
    String id = idGenerator.uuid();
    
    m.Global.log.debug(id);
    
    if(sessions.containsKey(id))
    {
      throw new Exception();
    }
    
    BaseAuthorizatorSession session = createBaseSession(id);
    sessions.put(id, session);
    
    for(Listener listener: listeners)
    {
      listener.sessionCreated(session);
    }
    
    return session;
  }
  
  abstract protected BaseAuthorizatorSession createBaseSession(String id) throws Exception;
  
  public AuthorizatorSession session(String id) throws Exception
  {
    return sessions.get(id);
  }
  
  public void destroySession(String id) throws Exception
  {
    m.Global.log.debug(id);
    
    BaseAuthorizatorSession session = sessions.get(id);
    
    for(Listener listener: listeners)
    {
      listener.sessionDestroy(session);
    }
    
    sessions.remove(id);
    session.destroy();
  }
  
  public String renameSession(String id) throws Exception
  {
    String newID = idGenerator.uuid();
    
//    sessions.put(newID, sessions.remove(id));
    sessions.put(newID, sessions.get(id));
    sessions.remove(id);
    
    m.Global.log.debug(id, newID);
    
    for(Listener listener: listeners)
    {
      listener.sessionRenamed(id, newID);
    }
    
    return newID;
  }
  
  public Map<String, Authenticator> authenticators() throws Exception
  {
    return authns.get();
  }
  
  public PrefixMap<AuthorizedService> services() throws Exception
  {
    return services.get();
  }
  
  abstract public ObjInput getIDProfileAndRoles(String authentication, String id) throws Exception;
  abstract public Map<String, Boolean> getAuthenticationSecurityRules(String authentication, String type, String name) throws Exception;
  abstract public Map<String, Boolean> getAttributeSecurityRules(String attribute, String name) throws Exception;
}
