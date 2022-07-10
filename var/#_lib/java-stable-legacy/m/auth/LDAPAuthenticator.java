package m.auth;

import java.util.*;

import javax.naming.*;
import javax.naming.directory.*;
import javax.security.auth.login.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;
import m.service.*;
import m.util.IDGenerator;

public class LDAPAuthenticator implements Authenticator, ConfigurableObject
{
  static final long DEFAULT_TIMEOUT = 10000;
  
  protected Long timeout;
  protected IDGenerator idGenerator;
  
  protected Map<String, Obj> challenges = new LinkedHashMap<String, Obj>();
  protected Map<String, Timer> challengeTimers = new LinkedHashMap<String, Timer>();
  
  protected String domainName;
  protected String ldapServerUrls[];
  
  public void configure(Obj params) throws Exception
  {
    timeout = params.integer(Conf.TIMEOUT);
    if(timeout == null)
    {
      timeout = DEFAULT_TIMEOUT;
    }
    
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
    
    domainName = params.string(Conf.SERVER);
    try
    {
      ldapServerUrls = LDAP.getDomainServers(domainName);
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
  
  public ObjInput challenge(String id) throws Exception
  {
    Obj challenge = new Obj(idGenerator.dateRandom());
    challenges.put(id, challenge);
    
    TimerTask task = new TimerTask()
    {
      @Override
      public void run()
      {
        try
        {
          m.Global.log.debug(System.currentTimeMillis());
          challenges.remove(id);
          challengeTimers.remove(id);
        }
        catch(Exception e)
        {
          e.printStackTrace();
        }
      }
    };
    
    Timer timer = new Timer();
    timer.schedule(task, timeout);
    
    challengeTimers.put(id, timer);
    
    return challenge;
  }
  
  public ObjInput authenticate(String id, ObjInput challengeProof) throws Exception
  {
    if(challengeTimers.get(id) != null)
    {
      challengeTimers.get(id).cancel();
      challenges.remove(id);
      challengeTimers.remove(id);
    }
    
    Boolean proven = true;
    try
    {
      LDAP.getLdapContext(id, challengeProof.string(), domainName, ldapServerUrls);
    }
    catch(Exception e)
    {
      proven = false;
    }
    
//    ObjInput expiration = credentialExpiryCheck(id);
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("authenticated", proven);
//    res.put("expiration", expiration.map());
    
    return new Obj(res);
  }
  
  public ObjInput credentialExpiryCheck(String id) throws Exception
  {
    String expiration = getExpiration(id);
    
    String now = idGenerator.date();
    Boolean expired = expiration != null && expiration.compareTo(now) < 0;
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("expired", expired);
    res.put("expiration", expiration);
    
    return new Obj(res);
  }
  
  public ObjInput credentialRenewal(String id, ObjInput challengeProof, ObjInput credentialNew, int renewalDays) throws Exception
  {
    ObjInput authn = authenticate(id, challengeProof);
    if(authn.bool("authenticated"))
    {
      ObjInput expiration = credentialReset(id, credentialNew, renewalDays);
      authn.map().put("expiration", expiration.object());
      
      return authn;
    }
    else
    {
      return authn;
    }
  }
  
  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception
  {
    setCredential(id, credentialNew);
    
    String expiration = idGenerator.date(renewalDays);
    if(renewalDays < 0)
    {
      expiration = "";
    }
    setExpiration(id, expiration);
    
    return new Obj(expiration);
  }
  
  public void add(String id, ObjInput credential) throws Exception
  {
    throw new Exception();
  }
  
  public void remove(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected ObjInput getCredential(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected void setCredential(String id, ObjInput credentialNew) throws Exception
  {
    throw new Exception();
  }
  
  protected String getExpiration(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected void setExpiration(String id, String expirationNew) throws Exception
  {
    throw new Exception();
  }
}
