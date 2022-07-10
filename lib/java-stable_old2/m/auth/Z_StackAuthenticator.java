package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.util.*;

public class Z_StackAuthenticator extends ConfigurableList<Z_AuthenticatorManager> implements Z_AuthenticatorManager
{
  public ObjInput challenge(String id) throws Exception
  {
    return get().get(0).challenge(id);
  }
  
  public ObjInput authenticate(String id, ObjInput challengeProof) throws Exception
  {
    ObjInput auth = get().get(0).authenticate(id, challengeProof);
    
    int i = 1;
    while(auth.bool("authenticated") != true)
    {
      auth = get().get(i).authenticate(id, challengeProof);
      i++;
    }
    
    return auth;
  }
  
  public ObjInput credentialExpiryCheck(String id) throws Exception
  {
    return get().get(0).credentialExpiryCheck(id);
  }
  
  public ObjInput credentialRenewal(String id, ObjInput challengeProof, ObjInput credentialNew, int renewalDays) throws Exception
  {
    throw new Exception();
  }
  
  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception
  {
    throw new Exception();
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
