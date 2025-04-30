package m.auth;

import m.object.*;

public interface Z_Authenticator
{
  public ObjInput challenge(String id) throws Exception;
  public ObjInput authenticate(String id, ObjInput challengeProof) throws Exception;
}
