package m.service;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class Authentication implements ConfigurableObject, AuthorizedService
{
  static final protected String CMD_SEPARATOR = "/";
  
  static final protected String CMD_CHALLENGE = "challenge";
  static final protected String CMD_AUTHENTICATE = "authenticate";
  static final protected String CMD_UNAUTHENTICATE = "unauthenticate";
  static final protected String CMD_CREDENTIAL = "credential";
  static final protected String CMD_ADD = "add";
  static final protected String CMD_REMOVE = "remove";
  static final protected String CMD_ID = "id";
  static final protected String CMD_SESSION = "session";
  static final protected String CMD_PROFILE = "profile";
  static final protected String CMD_PROFILES = "profiles";
  
  static final protected String PROFILER_SEPARATOR = "/";
  
  static final protected String AUTHENTICATION_PREFIX = "authentication";
  static final protected String AUTHENTICATION_DEFAULT = "id";
  
  static final protected String HTTP_FIELD_AUTHENTICATION = "authentication";
  static final protected String HTTP_FIELD_ID = "id";
  static final protected String HTTP_FIELD_CREDENTIAL = "credential";
  static final protected String HTTP_FIELD_CREDENTIAL_NEW = "credentialNew";
  
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String cmd;
    String path;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      cmd = command;
      path = null;
    }
    else
    {
      cmd = command.substring(0, index);
      path = command.substring(index + CMD_SEPARATOR.length());
    }
    
    m.Global.log.debug(cmd, path);
    
    executePath(session, cmd, path, in, out);
  }
  
  public void executePath(AuthorizationSession session, String command, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = getAuthentication(session, command, in, out);
    String id = getID(session, command, in, out);
    
    m.Global.log.debug(command, authentication, id);
    
    switch(command)
    {
      case CMD_CHALLENGE: challenge(session, authentication, id, path, in, out); break;
      case CMD_AUTHENTICATE: authenticate(session, authentication, id, path, in, out); break;
      case CMD_UNAUTHENTICATE: unauthenticate(session, authentication, id, path, in, out); break;
      case CMD_CREDENTIAL: credential(session, authentication, id, path, in, out); break;
      case CMD_ADD: add(session, authentication, id, path, in, out); break;
      case CMD_REMOVE: remove(session, authentication, id, path, in, out); break;
      case CMD_ID: id(session, authentication, id, path, in, out); break;
      case CMD_SESSION: session(session, authentication, id, path, in, out); break;
      case CMD_PROFILE: profile(session, authentication, id, path, in, out); break;
      case CMD_PROFILES: profiles(session, authentication, id, path, in, out); break;
      default: m.Global.log.debug(command, "unrecognized command exception!"); throw new Exception();
    }
  }
  
  public void challenge(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(session.challenge(authentication, id).string());
  }
  
  public void authenticate(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
session.challenge(authentication, id);
    String credential = in.string(HTTP_FIELD_CREDENTIAL);
//    out.set(session.authenticate(authentication, id, credential == null ? null : new Obj(credential)).map());
    ObjInput authn = session.authenticate(authentication, id, credential == null ? null : new Obj(credential));
    
m.Global.log.debug(id, "password change check", authn);
    if(authn.get("expiration").bool("expired") == true)
    {
      session.unauthenticate(authentication, id);
      javax.servlet.http.HttpServletResponse response = ((m.web.WebObjOutput) out).getHttpServletResponse();
      response.setStatus(javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
m.Global.log.debug(id, "password change check - expired", authn, authn.get("expiration"), authn.get("expiration").bool("expired"));
    }
    
    out.set(authn.map());
  }
  
  public void unauthenticate(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String idExplicit = in.string(HTTP_FIELD_ID);
    if(idExplicit == null)
    {
      while(id != null)
      {
        m.Global.log.debug(authentication, id);
        
        session.unauthenticate(authentication, id);
        id = getID(session, path, in, out);
      }
    }
    else
    {
      m.Global.log.debug(authentication, idExplicit);
      
      session.unauthenticate(authentication, idExplicit);
    }
    
    session.destroy();
  }
  
  public void credential(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String credential = in.string(HTTP_FIELD_CREDENTIAL);
    String credentialNew = in.string(HTTP_FIELD_CREDENTIAL_NEW);
    Long renewalDays = session.profiler().configuration() == null ? -1 : session.profiler().configuration().integer("authentication-credential-renew-days/id");
    out.set(session.authorizator().authenticators().get(authentication).credentialRenewal(id, new Obj(credential), new Obj(credentialNew), renewalDays == null ? -1 : renewalDays.intValue()).map());
  }
  
  public void add(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String credential = in.string(HTTP_FIELD_CREDENTIAL);
    session.authorizator().authenticators().get(authentication).add(id, new Obj(credential));
  }
  
  public void remove(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    session.authorizator().authenticators().get(authentication).remove(id);
  }
  
  public void id(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    if("null".equals(id))
    {
      out.set((String) null);
    }
    else
    {
      out.set(id);
    }
  }
  
  public void session(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    // todo review concept: instead of session id, return conf???
    
    Obj obj = new Obj(new HashMap<String, Object>());
    
    PrefixSet profiles = session.profiler().profiles();
//    String profile = profiles.last();
    String profile = profiles.higher("role/");
    if(profile != null && !"role/".equals(profile) && profile.startsWith("role/"))
    {
      profile = profile.replace("role/", "");
    }
    else
    {
      profile = profiles.last();
    }
    
    obj.set("id", "null".equals(id) ? null : id);
    obj.set("profile", "null".equals(profile) ? null : profile);
//    obj.set("profiles", session.profiler().profiles());
    
    m.Global.log.debug(id, obj.object());
    
    out.set(obj.map());
//    out.set(session.id());
  }
  
  public void profile(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    // todo review concept: instead of profile name, return conf (but not authorizations???)
    PrefixSet profiles = session.profiler().profiles();
    
//    String profile = profiles.last();
    String profile = profiles.higher("role/");
    if(profile != null && !"role/".equals(profile) && profile.startsWith("role/"))
    {
      profile = profile.replace("role/", "");
    }
    else
    {
      profile = profiles.last();
    }
    
    m.Global.log.debug(profiles.toArray(), profile);
    
    if("null".equals(profile))
    {
      out.set((String) null);
    }
    else
    {
      out.set(profile);
    }
  }
  
  public void profiles(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    PrefixSet profiles = session.profiler().profiles();
    
    if("null".equals(profiles))
    {
      out.set((String) null);
    }
    else
    {
      out.set(profiles.toString());
    }
  }
  
  protected String getAuthentication(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = in.string(HTTP_FIELD_AUTHENTICATION);
    if(authentication == null || "".equals(authentication))
    {
      authentication = AUTHENTICATION_DEFAULT;
    }
    
    return authentication;
  }
  
  protected String getID(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = getAuthentication(session, command, in, out);
    String prefix = AUTHENTICATION_PREFIX + PROFILER_SEPARATOR + authentication + PROFILER_SEPARATOR;
    String id = in.string(HTTP_FIELD_ID);
    if(id == null || "".equals(id))
    {
      List<String> stack = session.profiler().profileStack();
      if(stack != null)
      {
        for(String profile: stack)
        {
          if(profile.startsWith(prefix))
          {
            id = profile;
          }
        }
        
        if(id != null)
        {
          int index = id.indexOf(prefix);
          if(-1 == index)
          {
            id = null;
          }
          else
          {
            id = id.replace(prefix, "");
          }
        }
      }
    }
    
    return id;
  }
}
