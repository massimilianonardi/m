package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;

// todo parametrize classes for session, profiler, in/out-authorizators and methods to create instances -> no pass them to session!!!
public class BaseAuthorizator extends ConfigurableMap<AuthorizedService> implements Authorizator
{
  protected ConfigurableMap<Authenticator> authns;
  protected Obj profilerObjConf;
  
  protected List<Listener> listeners = new ArrayList();
  protected Map<String, AuthorizationSession> sessions = new HashMap();
  
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
  
  public PrefixMap<AuthorizedService> services() throws Exception
  {
    return get();
  }
  
  public Map<String, Authenticator> authenticators() throws Exception
  {
    return authns.get();
  }
  
  public AuthorizationSession createSession(String id) throws Exception
  {
    m.Global.log.debug(id);
    
    AuthorizationSession session = new BaseAuthorizationSession(this, m.Global.objects.get(AuthorizationSession.Profiler.class, profilerObjConf), id);
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
    
    AuthorizationSession session = sessions.get(id);
    
    for(Listener listener: listeners)
    {
      listener.sessionDestroyed(session);
    }
    
    session.destroy();
    sessions.remove(id);
  }
  
  public AuthorizationSession session(String id) throws Exception
  {
    return sessions.get(id);
  }
}
