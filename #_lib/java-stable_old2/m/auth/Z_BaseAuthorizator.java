package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;

// todo parametrize classes for session, profiler, in/out-authorizators and methods to create instances -> no pass them to session!!!
public class Z_BaseAuthorizator extends ConfigurableMap<Z_AuthorizedService> implements Z_Authorizator
{
  protected ConfigurableMap<Z_AuthenticatorManager> authns;
  protected Obj profilerObjConf;
  
  protected List<Listener> listeners = new ArrayList();
  protected Map<String, Z_AuthorizationSession> sessions = new HashMap();
  
  protected IDGenerator idGenerator;
  
  public void construct(Obj args) throws Exception
  {
    idGenerator = new IDGenerator().dateFormat("yyyy-MM-dd_HH-mm-ss");
  }
  
  public void configure(Obj params) throws Exception
  {
    authns = m.Global.objects.get(ConfigurableMap.class, "m.conf.ConfigurableMap", null, params.get(Conf.AUTHENTICATIONS), null, null, null, null, null);
    profilerObjConf = params.get(Conf.PROFILER);
    
    super.configure(params.get(Conf.SERVICES));
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
  
  public PrefixMap<Z_AuthorizedService> services() throws Exception
  {
    return get();
  }
  
  public Map<String, Z_AuthenticatorManager> authenticators() throws Exception
  {
    return authns.get();
  }
  
  public Z_AuthorizationSession createSession() throws Exception
  {
//    String id = idGenerator.dateRandom();
    String id = idGenerator.uuid();
    
    m.Global.log.debug(id);
    
    Z_AuthorizationSession session = new Z_BaseAuthorizationSession(this, m.Global.objects.get(Z_AuthorizationSession.Profiler.class, profilerObjConf), id);
    sessions.put(id, session);
    
    for(Listener listener: listeners)
    {
      listener.sessionCreated(session);
    }
    
    return session;
  }
  
  public void destroySession(String id) throws Exception
  {
    m.Global.log.debug(id);
    
    Z_AuthorizationSession session = sessions.get(id);
    
    for(Listener listener: listeners)
    {
      listener.sessionDestroyed(session);
    }
    
    session.destroy();
    sessions.remove(id);
  }
  
  public String renameSession(String id) throws Exception
  {
//    String newID = idGenerator.dateRandom();
    String newID = idGenerator.uuid();
    
    Z_AuthorizationSession session = sessions.get(id);
    
//    sessions.put(newID, sessions.remove(id));
    sessions.put(newID, sessions.get(id));
    sessions.remove(id);
    
    for(Listener listener: listeners)
    {
      listener.sessionRenamed(session);
    }
    
    m.Global.log.debug(id, newID);
    
    return newID;
  }
  
  public Z_AuthorizationSession session(String id) throws Exception
  {
    return sessions.get(id);
  }
}
