package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.util.*;

abstract public class BaseAuthenticator<T> extends ConfigurableWrapper<T> implements AuthenticatorManager
{
  static final long DEFAULT_TIMEOUT = 10000;
  
  protected String hash;
  protected Long timeout;
  protected IDGenerator idGenerator;
  
  protected Map<String, Obj> challenges = new LinkedHashMap<String, Obj>();
  protected Map<String, Timer> challengeTimers = new LinkedHashMap<String, Timer>();
  
  public void configure(Obj params) throws Exception
  {
    hash = params.string(Conf.HASH);
    if(hash == null)
    {
      hash = Hash.DEFAULT;
    }
    
    timeout = params.integer(Conf.TIMEOUT);
    if(timeout == null)
    {
      timeout = DEFAULT_TIMEOUT;
    }
    
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
    
    super.configure(params);
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
    
    ObjInput hashedCredential = getCredential(id);
    
    String proofVerification = Hash.hashString(hash, challengeProof.string());
    Boolean proven = proofVerification.equals(hashedCredential.string());
    
    ObjInput expiration = credentialExpiryCheck(id);
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("authenticated", proven);
    res.put("expiration", expiration.map());
    
    return new Obj(res);
  }
  
  public ObjInput authenticate___(String id, ObjInput challengeProof) throws Exception
  {
    Obj challenge = challenges.get(id);
    if(challenge == null)
    {
      throw new Exception();
    }
    
    challengeTimers.get(id).cancel();
    
    challenges.remove(id);
    challengeTimers.remove(id);
    
    ObjInput hashedCredential = getCredential(id);
    
    String proofVerification = Hash.hashString(hash, id + "/" + hashedCredential.string() + "/" + challenge.string());
    Boolean proven = proofVerification.equals(challengeProof.string());
    
    ObjInput expiration = credentialExpiryCheck(id);
    
    Map<String, Object> res = new HashMap<String, Object>();
    res.put("authenticated", proven);
    res.put("expiration", expiration.map());
    
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
  
  abstract public void add(String id, ObjInput credential) throws Exception;
  abstract public void remove(String id) throws Exception;
  
  abstract protected ObjInput getCredential(String id) throws Exception;
  abstract protected void setCredential(String id, ObjInput credentialNew) throws Exception;
  abstract protected String getExpiration(String id) throws Exception;
  abstract protected void setExpiration(String id, String expirationNew) throws Exception;
}
