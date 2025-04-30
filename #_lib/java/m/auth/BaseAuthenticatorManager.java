package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.util.*;

abstract public class BaseAuthenticatorManager<T> extends ConfigurableWrapper<T> implements AuthenticatorManager
{
  static final long DEFAULT_TIMEOUT = 10000;
  
  protected String hash;
  protected IDGenerator idGenerator;
  
  public void configure(Obj params) throws Exception
  {
    hash = params.string(Conf.HASH);
    if(hash == null)
    {
      hash = Hash.DEFAULT;
    }
    
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
    
    super.configure(params);
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
    if(challengeProof != null && challengeProof.string() != null && challengeProof.string().equals(getCredential(id)))
    {
      ObjInput expiration = credentialReset(id, credentialNew, renewalDays);
//      authn.map().put("expiration", expiration.object());
      
      return new Obj(true);
    }
    else
    {
      return new Obj(false);
    }
  }
  
  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception
  {
    setCredential(id, credentialNew.string());
    
    String expiration = idGenerator.date(renewalDays);
    if(renewalDays < 0)
    {
      expiration = "";
    }
    setExpiration(id, expiration);
    
    return new Obj(expiration);
  }
  
  abstract public boolean exists(String id) throws Exception;
  abstract public void add(String id, String credential) throws Exception;
  abstract public void remove(String id) throws Exception;
  
  abstract public String getCredential(String id) throws Exception;
  abstract public void setCredential(String id, String credentialNew) throws Exception;
  abstract public String getExpiration(String id) throws Exception;
  abstract public void setExpiration(String id, String expirationNew) throws Exception;
}
