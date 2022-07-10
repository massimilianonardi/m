package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.util.*;

abstract public class BaseAuthenticator<T> extends ConfigurableWrapper<T> implements Authenticator
{
//  static final long DEFAULT_TIMEOUT = 10000;
  
  protected String hash;
//  protected Long timeout;
  protected IDGenerator idGenerator;
  
//  protected Map<String, Obj> challenges = new LinkedHashMap<String, Obj>();
//  protected Map<String, Timer> challengeTimers = new LinkedHashMap<String, Timer>();
  
  public void configure(Obj params) throws Exception
  {
    hash = params.string(Conf.HASH);
    if(hash == null)
    {
      hash = Hash.DEFAULT;
    }
    
//    timeout = params.integer(Conf.TIMEOUT);
//    if(timeout == null)
//    {
//      timeout = DEFAULT_TIMEOUT;
//    }
    
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
    
    super.configure(params);
  }
  
  public ObjInput challenge(String id) throws Exception
  {
    Obj challenge = new Obj(idGenerator.dateRandom());
//    challenges.put(id, challenge);
//    
//    TimerTask task = new TimerTask()
//    {
//      @Override
//      public void run()
//      {
//        try
//        {
//          m.Global.log.debug(id, challenge.object(), System.currentTimeMillis());
//          challenges.remove(id);
//          challengeTimers.remove(id);
//        }
//        catch(Exception e)
//        {
//          e.printStackTrace();
//        }
//      }
//    };
//    
//    Timer timer = new Timer();
//    timer.schedule(task, timeout);
//    
//    challengeTimers.put(id, timer);
    
    return challenge;
  }
  
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception
  {
//    if(challengeTimers.get(id) != null)
//    {
//      challengeTimers.get(id).cancel();
//      challenges.remove(id);
//      challengeTimers.remove(id);
//    }
    
    ObjInput hashedCredential = getCredentialObj(id);
    
    String proofVerification = Hash.hashString(hash, challengeProof.string());
    Boolean proven = proofVerification.equals(hashedCredential.string());
    
    boolean expired = credentialExpiryCheck(id);
    
    if(expired)
    {
      proven = null;
    }
    
    return proven;
  }
  
  public boolean credentialExpiryCheck(String id) throws Exception
  {
    String expiration = getExpiration(id);
    if(expiration == null || "".equals(expiration))
    {
      return false;
    }
    
    String now = idGenerator.date();
//    Boolean expired = expiration != null && expiration.compareTo(now) < 0;
    Boolean expired = expiration.compareTo(now) < 0;
    
    return expired;
  }
  
  abstract protected ObjInput getCredentialObj(String id) throws Exception;
  abstract protected String getExpiration(String id) throws Exception;
}
