package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.util.*;

public class StackAuthenticator extends ConfigurableList<Authenticator> implements Authenticator, AuthenticatorManager
{
  protected IDGenerator idGenerator;
  
  public void construct(Obj args) throws Exception
  {
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
  }
  
  public ObjInput challenge(String id) throws Exception
  {
    Obj challenge = new Obj(idGenerator.dateRandom());
    
    return challenge;
  }
  
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception
  {
    Boolean proven = false;
    
    for(Authenticator authn: get())
    {
      try
      {
        proven = authn.authenticate(id, challengeProof);
      }
      catch(Exception e)
      {
        e.printStackTrace();
        proven = false;
      }
      m.Global.log.debug(authn.getClass().getName(), id, proven);
//      if(proven != false)
      if(proven == null || proven == true)
      {
        break;
      }
    }
    
    return proven;
  }
  
  public List<String> list() throws Exception
  {
    List<String> l = new ArrayList<String>();
    
    for(Authenticator authn: get())
    {
      if(authn instanceof AuthenticatorManager)
      {
        l.addAll(((AuthenticatorManager) authn).list());
      }
    }
    
    m.Global.log.debug(l);
    
    return l;
  }
  
  public boolean exists(String id) throws Exception
  {
    Boolean exists = false;
    
    for(Authenticator authn: get())
    {
      if(authn instanceof AuthenticatorManager)
      {
        exists = ((AuthenticatorManager) authn).exists(id);
      }
      else
      {
        exists = false;
      }
      m.Global.log.debug(authn.getClass().getName(), id, exists);
      if(exists != false)
      {
        break;
      }
    }
    
    return exists;
  }
  
  public void add(String id, String credential) throws Exception
  {
//    throw new Exception();
    for(Authenticator authn: get())
    {
      Boolean exists = false;
      
      if(authn instanceof AuthenticatorManager)
      {
        exists = ((AuthenticatorManager) authn).exists(id);
        if(!exists)
        {
          ((AuthenticatorManager) authn).add(id, credential);
          break;
        }
        break;
      }
      else
      {
        exists = false;
      }
      m.Global.log.debug(authn.getClass().getName(), id, exists);
      if(exists != false)
      {
        break;
      }
    }
  }
  
  public void remove(String id) throws Exception
  {
//    throw new Exception();
    for(Authenticator authn: get())
    {
      Boolean exists = false;
      
      if(authn instanceof AuthenticatorManager)
      {
        exists = ((AuthenticatorManager) authn).exists(id);
        if(exists)
        {
          ((AuthenticatorManager) authn).remove(id);
          break;
        }
      }
      else
      {
        exists = false;
      }
      m.Global.log.debug(authn.getClass().getName(), id, exists);
      if(exists != false)
      {
        break;
      }
    }
  }
  
  public String getCredential(String id) throws Exception
  {
    String credential = null;
    
    for(Authenticator authn: get())
    {
      if(authn instanceof AuthenticatorManager)
      {
        credential = ((AuthenticatorManager) authn).getCredential(id);
      }
      else
      {
        credential = null;
      }
      m.Global.log.debug(authn.getClass().getName(), id);
      if(credential != null)
      {
        break;
      }
    }
    
    return credential;
  }
  
  public void setCredential(String id, String credentialNew) throws Exception
  {
    for(Authenticator authn: get())
    {
      if(authn instanceof AuthenticatorManager)
      {
        try
        {
          ((AuthenticatorManager) authn).setCredential(id, credentialNew);
          m.Global.log.debug(authn.getClass().getName(), id);
          break;
        }
        catch(Exception e)
        {
          continue;
        }
      }
    }
  }
  
  public String getExpiration(String id) throws Exception
  {
    String expiration = null;
    
    for(Authenticator authn: get())
    {
      if(authn instanceof AuthenticatorManager)
      {
        expiration = ((AuthenticatorManager) authn).getExpiration(id);
      }
      else
      {
        expiration = null;
      }
      m.Global.log.debug(authn.getClass().getName(), id, expiration);
      if(expiration != null)
      {
        break;
      }
    }
    
    return expiration;
  }
  
  public void setExpiration(String id, String expirationNew) throws Exception
  {
    for(Authenticator authn: get())
    {
      if(authn instanceof AuthenticatorManager)
      {
        ((AuthenticatorManager) authn).setExpiration(id, expirationNew);
        m.Global.log.debug(authn.getClass().getName(), id, expirationNew);
        break;
      }
    }
  }
}
