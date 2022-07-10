package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;

public class FSBaseAuthenticator extends BaseAuthenticator<___FileSystem> implements Authenticator
{
  public void add(String id, ObjInput credential) throws Exception
  {
    setCredential(id, credential);
  }
  
  public void remove(String id) throws Exception
  {
    get().delete(id);
  }
  
  protected ObjInput getCredential(String id) throws Exception
  {
    StreamSeekable stream = get().stream(id);
    Obj hashedCredentialStored = new Obj();
    hashedCredentialStored.streamFromInput(stream);
    
    return hashedCredentialStored;
  }
  
  protected void setCredential(String id, ObjInput credentialNew) throws Exception
  {
    StreamSeekable stream = object.stream(id);
    
    String hashedCredential = credentialNew == null ? null : Hash.hashString(hash, credentialNew.string());
    stream.write(new Obj(hashedCredential));
  }
  
  protected void setCredential___(String id, ObjInput credentialNew) throws Exception
  {
    StreamSeekable stream = object.stream(id);
    
    stream.write(credentialNew.bytes());
  }
  
  protected String getExpiration(String id) throws Exception
  {
    if(!get().exists(id + ".expiration"))
    {
      return null;
    }
    
    StreamSeekable stream = get().stream(id + ".expiration");
    Obj expiration = new Obj();
    expiration.streamFromInput(stream);
    
    return expiration.string();
  }
  
  protected void setExpiration(String id, String expirationNew) throws Exception
  {
    StreamSeekable stream = object.stream(id + ".expiration");
    
    stream.write(new Obj(expirationNew));
  }
}
