package m.auth;

import m.object.*;

public interface Authenticator
{
  default public ObjInput challenge(String id) throws Exception
  {
    return null;
  }
  
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception;
}
