package m.auth;

import m.object.*;
import m.conf.*;
import m.util.*;

public class LDAPAuthenticator implements Authenticator, ConfigurableObject
{
  protected IDGenerator idGenerator;
  
  protected String domainName;
  protected String ldapServerUrls[];
  
  public void construct(Obj args) throws Exception
  {
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
  }
  
  public void configure(Obj params) throws Exception
  {
    domainName = params.string(Conf.SERVER);
    try
    {
      ldapServerUrls = LDAP.getDomainServers(domainName);
    }
    catch(Exception e)
    {
      m.Global.log.debug(domainName, e.getMessage(), e.toString());
//      e.printStackTrace();
    }
  }
  
  public ObjInput challenge(String id) throws Exception
  {
    Obj challenge = new Obj(idGenerator.dateRandom());
    
    return challenge;
  }
  
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception
  {
    Boolean proven = true;
    
    try
    {
      LDAP.getLdapContext(id, challengeProof.string(), domainName, ldapServerUrls);
    }
    catch(Exception e)
    {
      proven = false;
    }
    
    return proven;
  }
}
