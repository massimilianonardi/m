package m.auth;

import java.util.*;

import m.object.*;

// authentications and attributes are independent, thus order of add or removal is ininfluent (use AdvancedAuthorizatorSession for that)
public class BaseAuthorizatorSession<T> implements AuthorizatorSession
{
  protected BaseAuthorizator<T> authorizator;
  protected String id;
  
  protected Map<String, ObjInput> authentications = new HashMap<String, ObjInput>();
  
//  protected Map<String, String> attributes = new HashMap<String, String>();
  
  protected PrefixMap<Boolean> authorizations = new PrefixMap();
  protected Map<String, Map<String, Boolean>> authorizationProfiles = new LinkedHashMap<String, Map<String, Boolean>>();
  protected List<String> authorizationProfilesStack = new ArrayList<String>();
  protected static final String AUTHORIZATION_PROFILES_SEPARATOR = "/";
  
  public BaseAuthorizatorSession init(BaseAuthorizator authorizator, String sessionID) throws Exception
  {
    if(authorizator == null || sessionID == null)
    {
      throw new Exception();
    }
    
    this.authorizator = authorizator;
    id = sessionID;
    
//    setAttribute("session", "anonymous");
    addAttributeSecurityRules("session", "anonymous");
    
    return this;
  }
  
  public Authorizator authorizator() throws Exception
  {
    return authorizator;
  }
  
  public String id() throws Exception
  {
    return id;
  }
  
  public String profile() throws Exception
  {
    return authorizationProfilesStack.get(1);
  }
  
  public List<String> profiles() throws Exception
  {
    return authorizationProfilesStack;
  }
  
  // BaseAuthorizatorSession doesn't change security rules when challenges are requested, but more advanced session should!
  // but challenges expiration and handling (more challenges requested per id, etc.) is performed by authenticators as per specific config
  // it is not responsibility of authorizator because it is part of the authentication process
  synchronized public ObjInput challenge(String authentication, String id) throws Exception
  {
    return authorizator.authenticators().get(authentication).challenge(id);
  }
  
  synchronized public Boolean authenticate(String authentication, String id, ObjInput challengeProof) throws Exception
  {
    // the commented line allows more authenticated id for the same authenticator and is wrong, 
    // while is ok to have more authenticated id with different authenticators
//    if(authentications.containsKey(authentication + "/" + id))
    if(authentications.containsKey(authentication))
    {
      unauthenticate(authentication, id);
    }
    
    Authenticator authn = authorizator.authenticators().get(authentication);
    Boolean authenticationResult = authn.authenticate(id, challengeProof);
    if(authenticationResult == null || authenticationResult == false)
    {
      return authenticationResult;
    }
    
    if(authentications.isEmpty())
    {
      addAttributeSecurityRules("session", "authenticated");
    }
    ObjInput authorizatorIDProfileAndRoles = authorizator.getIDProfileAndRoles(authentication, id);
//    authentications.put(authentication + "/" + id, res);
    authentications.put(authentication, authorizatorIDProfileAndRoles);
//    this.id = authorizator.renameSession(this.id);
    
    if(authorizatorIDProfileAndRoles != null)
    {
      Iterator<String> iterator = authorizatorIDProfileAndRoles.list().iterator();
      while(iterator.hasNext())
      {
        addAuthenticationSecurityRules(authentication, "roles", iterator.next());
      }
//      if(authorizatorIDProfileAndRoles.string("profile") != null)
//      {
//        addAuthenticationSecurityRules(authentication, "profile", authorizatorIDProfileAndRoles.string("profile"));
//      }
//      
//      if(authorizatorIDProfileAndRoles.list("roles") != null)
//      {
//        Iterator<String> iterator = authorizatorIDProfileAndRoles.list("roles").iterator();
//        while(iterator.hasNext())
//        {
//          addAuthenticationSecurityRules(authentication, "role", iterator.next());
//        }
//      }
    }
    
    addAuthenticationSecurityRules(authentication, "id", id);
    
    return authenticationResult;
  }
  
  synchronized public Boolean unauthenticate(String authentication, String id) throws Exception
  {
//    ObjInput res = authentications.get(authentication + "/" + id);
    ObjInput authorizatorIDProfileAndRoles = authentications.get(authentication);
//    authentications.remove(authentication + "/" + id);
    authentications.remove(authentication);
//    this.id = authorizator.renameSession(this.id);
    
    if(authorizatorIDProfileAndRoles != null)
    {
      Iterator<String> iterator = authorizatorIDProfileAndRoles.list().iterator();
      while(iterator.hasNext())
      {
        removeAuthenticationSecurityRules(authentication, "roles", iterator.next());
      }
//      if(authorizatorIDProfileAndRoles.string("profile") != null)
//      {
//        removeAuthenticationSecurityRules(authentication, "profile", authorizatorIDProfileAndRoles.string("profile"));
//      }
//      
//      if(authorizatorIDProfileAndRoles.list("roles") != null)
//      {
//        Iterator<String> iterator = authorizatorIDProfileAndRoles.list("roles").iterator();
//        while(iterator.hasNext())
//        {
//          removeAuthenticationSecurityRules(authentication, "role", iterator.next());
//        }
//      }
    }
    
    removeAuthenticationSecurityRules(authentication, "id", id);
    
    return true;
  }
  
  public boolean authorize(String request) throws Exception
  {
    Boolean authz = authorizations.prefix(request);
    
    m.Global.log.debug(authz, authorizationProfilesStack.toArray(), authorizationProfiles.keySet(), authorizations);
//    for(String a: authorizationProfiles.keySet())
//    {
//      m.Global.log.debug(a, authorizationProfiles.get(a));
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
  
//  public String getAttribute(String attribute) throws Exception
//  {
//    return attributes.get(attribute);
//  }
  
//  synchronized public void setAttribute(String attribute, String value) throws Exception
//  {
//    String previousValue = attributes.get(attribute);
//    if((previousValue == null && value == null) || (previousValue != null && previousValue.equals(value)))
//    {
//      return;
//    }
//    
//    attributes.put(attribute, value);
//    addAttributeSecurityRules(attribute, value);
////    attributeChanged(attribute, previousValue, value);
//  }
  
//  public void removeAttribute(String attribute) throws Exception
//  {
//    removeAttributeSecurityRules(attribute, attributes.get(attribute));
//    attributes.remove(attribute);
//  }
  
  public void destroy() throws Exception
  {
    authentications.clear();
//    attributes.clear();
    authorizations.clear();
    authorizationProfiles.clear();
    authorizationProfilesStack.clear();
    
    try
    {
      authorizator.destroySession(id);
    }
    catch(Exception e)
    {
    }
    authorizator = null;
  }
  
  protected void addAuthenticationSecurityRules(String authentication, String type, String name) throws Exception
  {
    String path = "authentication" + AUTHORIZATION_PROFILES_SEPARATOR + authentication + AUTHORIZATION_PROFILES_SEPARATOR + type + AUTHORIZATION_PROFILES_SEPARATOR + name;
    if(authorizationProfiles.containsKey(path))
    {
      return;
    }
    
    Map<String, Boolean> authz = authorizator.getAuthenticationSecurityRules(authentication, type, name);
    
    authorizationProfiles.put(path, authz);
    authorizationProfilesStack.add(path);
    
    m.Global.log.debug(authentication, type, name, authz);
    
    updateSecurityRules();
  }
  
  protected void removeAuthenticationSecurityRules(String authentication, String type, String name) throws Exception
  {
    String path = "authentication" + AUTHORIZATION_PROFILES_SEPARATOR + authentication + AUTHORIZATION_PROFILES_SEPARATOR + type + AUTHORIZATION_PROFILES_SEPARATOR + name;
    authorizationProfiles.remove(path);
    authorizationProfilesStack.remove(path);
    
    m.Global.log.debug(authentication, type, name);
    
    updateSecurityRules();
  }
  
  protected void addAttributeSecurityRules(String attribute, String name) throws Exception
  {
    String path = "attribute" + AUTHORIZATION_PROFILES_SEPARATOR + attribute + AUTHORIZATION_PROFILES_SEPARATOR + name;
    if(authorizationProfiles.containsKey(path))
    {
      return;
    }
    
    Map<String, Boolean> authz = authorizator.getAttributeSecurityRules(attribute, name);
    
    authorizationProfiles.put(path, authz);
    authorizationProfilesStack.remove(path);
    authorizationProfilesStack.add(path);
    
    m.Global.log.debug(attribute, name, authz);
    
    updateSecurityRules();
  }
  
  protected void removeAttributeSecurityRules(String attribute, String name) throws Exception
  {
    String path = "attribute" + AUTHORIZATION_PROFILES_SEPARATOR + attribute + AUTHORIZATION_PROFILES_SEPARATOR + name;
    authorizationProfiles.remove(path);
    authorizationProfilesStack.remove(path);
    
    m.Global.log.debug(attribute, name);
    
    updateSecurityRules();
  }
  
  synchronized protected void updateSecurityRules() throws Exception
  {
    m.Global.log.debug("before", authorizations);
    
//    authorizations = new PrefixMap();
    
    for(String path: authorizationProfilesStack)
    {
      Map<String, Boolean> authorizationProfile = authorizationProfiles.get(path);
      m.Global.log.debug("loop", path, authorizationProfile);
      if(authorizationProfile != null)
      {
        for(String key: authorizationProfile.keySet())
        {
          Boolean policy = authorizationProfile.get(key);

//          m.Global.log.debug("subloop", path, key, policy, authorizations.tailMap(key, true).headMap(key + Character.MAX_VALUE, true));
          authorizations.tailMap(key, true).headMap(key + Character.MAX_VALUE, true).clear();
          authorizations.put(key, policy);
        }
      }
    }
    
    m.Global.log.debug("after", authorizations);
  }
}
