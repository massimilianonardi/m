package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;

public class StackDBADAuthenticator extends DBAuthenticator
{
  protected String domainName;
  protected String ldapServerUrls[];
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
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
  
  public ObjInput authenticate(String id, ObjInput challengeProof) throws Exception
  {
    if(challengeTimers.get(id) != null)
    {
      challengeTimers.get(id).cancel();
      challenges.remove(id);
      challengeTimers.remove(id);
    }
    
    Map<String, Object> res = new HashMap<String, Object>();
    
    Boolean proven = true;
    try
    {
      LDAP.getLdapContext(id, challengeProof.string(), domainName, ldapServerUrls);
    }
    catch(Exception e)
    {
      proven = false;
    }
    
    if(proven == false)
    {
      ObjInput hashedCredential = getCredential(id);
      
      String proofVerification = Hash.hashString(hash, challengeProof.string());
      proven = proofVerification.equals(hashedCredential.string());
      
      ObjInput expiration = credentialExpiryCheck(id);
      res.put("expiration", expiration.map());
    }
    
    res.put("authenticated", proven);
    
    return new Obj(res);
  }
  
  public void add(String id, ObjInput credential) throws Exception
  {
    throw new Exception();
  }
  
  public void remove(String id) throws Exception
  {
    throw new Exception();
  }
}
