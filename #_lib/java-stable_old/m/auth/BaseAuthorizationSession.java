package m.auth;

import java.util.*;

import m.object.*;

public class BaseAuthorizationSession implements AuthorizationSession
{
  protected String id;
  
  protected Authorizator authorizator;
  protected Profiler profiler;
  
  protected List<Listener> listeners = new ArrayList();
  protected Map<String, String> attributes = new HashMap<String, String>();
  
  public BaseAuthorizationSession(Authorizator authorizator, Profiler profiler, String sessionID) throws Exception
  {
    this.authorizator = authorizator;
    this.profiler = profiler;
    id = sessionID;
    
    profiler.sessionCreated();
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
  
  public void destroy() throws Exception
  {
    if(profiler == null)
    {
      return;
    }
    
    profiler.sessionDestroyed();
    profiler = null;
    
    attributes.clear();
    listeners.clear();
    
    authorizator.destroySession(id);
    authorizator = null;
  }
  
  public String id() throws Exception
  {
    return id;
  }
  
  public Authorizator authorizator() throws Exception
  {
    return authorizator;
  }
  
  public Profiler profiler() throws Exception
  {
    return profiler;
  }
  
  public String getAttribute(String attribute) throws Exception
  {
    return attributes.get(attribute);
  }
  
  synchronized public void setAttribute(String attribute, String value) throws Exception
  {
    String previousValue = attributes.get(attribute);
//    if((previousValue == null && value == null) || (previousValue != null && previousValue.equals(value)))
//    {
//      return;
//    }
    
    attributes.put(attribute, value);
    profiler.sessionAttributeChanged(attribute, previousValue, value);
    
    for(Listener listener: listeners)
    {
      listener.sessionAttributeChanged(attribute, previousValue, value);
    }
  }
  
  public Map<String, String> attributes(String key) throws Exception
  {
    return attributes;
  }
  
  public ObjInput challenge(String authentication, String id) throws Exception
  {
    ObjInput challenge = authorizator.authenticators().get(authentication).challenge(id);
    profiler.sessionChallenged(authentication, id);
    
    return challenge;
  }
  
  public ObjInput authenticate(String authentication, String id, ObjInput challengeProof) throws Exception
  {
    profiler.sessionUnchallenged(authentication, id);
    
    ObjInput authn = authorizator.authenticators().get(authentication).authenticate(id, challengeProof);
    if(authn.bool("authenticated"))
    {
      this.id = authorizator.renameSession(this.id);
      
      profiler.sessionAuthenticated(authentication, id);
      
      for(Listener listener: listeners)
      {
        listener.sessionAuthenticated(authentication, id);
      }
      
      if(authn.get("expiration") != null  && authn.get("expiration").bool("expired") != null && authn.get("expiration").bool("expired") == true)
      {
        profiler.sessionAuthenticationExpired(authentication, id);
        
        for(Listener listener: listeners)
        {
          listener.sessionAuthenticationExpired(authentication, id);
        }
      }
      
      if(authn.map("attributes") != null)
      {
//        for(String key: ((Map<String, String>) authn.map("attributes")).keySet())
//        {
//        }
        for(Map.Entry<String, String> entry: ((Map<String, String>) authn.map("attributes")).entrySet())
        {
          setAttribute(entry.getKey(), entry.getValue());
        }
      }
      
      return authn;
    }
    else
    {
      return authn;
    }
  }
  
  public ObjInput unauthenticate(String authentication, String id) throws Exception
  {
    profiler.sessionUnauthenticated(authentication, id);
    
    for(Listener listener: listeners)
    {
      listener.sessionUnauthenticated(authentication, id);
    }
    
    this.id = authorizator.renameSession(this.id);
    
    return new Obj(true);
  }
  
  public boolean authorize(String request) throws Exception
  {
    Boolean authz = profiler.authorization().prefix(request);
//    m.Global.log.debug(profiler.profileStack(), profiler.profiles().toArray(), profiler.authorizations().keySet(), profiler.configurations().keySet(), profiler.authorization().keySet(), profiler.configuration().object());
    m.Global.log.debug(authz, profiler.profiles().toArray(), profiler.authorization().keySet(), profiler.configuration().object(), profiler.authorizations());
//    for(String a: profiler.authorizations().keySet())
//    {
//      m.Global.log.debug(a, profiler.authorizations().get(a));
//    }
    return authz == null ? false : authz;
  }
  
  public boolean execute(String command, ObjInput in, ObjOutput out) throws Exception
  {
    if(!authorize(command))
    {
      m.Global.log.debug(command, false);
      
      return false;
    }
    
    AuthorizedService service = authorizator.services().prefix(command);
    
    if(service == null)
    {
      m.Global.log.debug(command, false);
      
      return false;
    }
    else
    {
      String serviceKey = authorizator.services().prefixKey(command);
      String cmd = command.substring(serviceKey.length());
      
      m.Global.log.debug(command, true, serviceKey, cmd, service.getClass().getName());
      
      // todo do not pass in/out directly but wrap them around authorization classes that detect max request size at real time, params policies, etc.
      service.execute(this, cmd, in, out);
      
      return true;
    }
  }
}
