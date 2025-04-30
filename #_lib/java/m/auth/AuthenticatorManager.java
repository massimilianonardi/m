package m.auth;

import java.util.*;

import m.object.*;

public interface AuthenticatorManager
{
//  public ObjInput credentialExpiry(String id) throws Exception;
//  public ObjInput credentialRenewal(String id, ObjInput challengeProof, ObjInput credentialNew, int renewalDays) throws Exception;
//  public ObjInput credentialReset(String id, ObjInput credentialNew, int renewalDays) throws Exception;
  
  public List<String> list() throws Exception;
  public boolean exists(String id) throws Exception;
  public void add(String id, String credential) throws Exception;
  public void remove(String id) throws Exception;
  
  abstract public String getCredential(String id) throws Exception;
  abstract public void setCredential(String id, String credentialNew) throws Exception;
  abstract public String getExpiration(String id) throws Exception;
  abstract public void setExpiration(String id, String expirationNew) throws Exception;
}
