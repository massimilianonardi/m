package m.auth;

public interface Authn
{
  public interface Manager
  {
    public Boolean credentialExpiry(String id) throws Exception;
    public Boolean credentialRenewal(String id, String challengeProof, String credentialNew, int renewalDays) throws Exception;
    public Boolean credentialReset(String id, String credentialNew, int renewalDays) throws Exception;
    public void add(String id, String credential) throws Exception;
    public void setCredential(String id, String credential) throws Exception;
    public void remove(String id) throws Exception;
  }

  default public String challenge(String id) throws Exception
  {
    return null;
  }
  
  public Boolean authenticate(String id, String challengeProof) throws Exception;
}
