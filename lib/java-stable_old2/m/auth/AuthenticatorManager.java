package m.auth;

import m.object.*;

public interface AuthenticatorManager extends Z_Authenticator
{
  public ObjInput credentialExpiry(String id) throws Exception;
  public ObjInput credentialRenewal(String id, ObjInput challengeProof, ObjInput credentialNew, int renewalDays) throws Exception;
  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception;
//  public boolean exists(String id) throws Exception;
  public void add(String id, ObjInput credential) throws Exception;
  public void setCredential(String id, ObjInput credential) throws Exception;
  public void remove(String id) throws Exception;
}
