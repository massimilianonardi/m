package m.auth;

import m.object.*;

public interface Authenticator
{
  public ObjInput challenge(String id) throws Exception;
  public ObjInput authenticate(String id, ObjInput challengeProof) throws Exception;
  public ObjInput credentialExpiryCheck(String id) throws Exception;
  public ObjInput credentialRenewal(String id, ObjInput challengeProof, ObjInput credentialNew, int renewalDays) throws Exception;
  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception;
  public void add(String id, ObjInput credential) throws Exception;
  public void remove(String id) throws Exception;
}
