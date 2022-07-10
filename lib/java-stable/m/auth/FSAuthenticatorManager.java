package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.file.*;
import m.stream.*;

public class FSAuthenticatorManager extends BaseAuthenticatorManager<FileSystem>
{
  public boolean exists(String id) throws Exception
  {
    if(get().exists(id))
    {
      return true;
    }
    
    return false;
  }
  
  public void add(String id, String credential) throws Exception
  {
    setCredential(id, credential);
  }
  
  public void remove(String id) throws Exception
  {
    get().delete(id);
  }
  
  public String getCredential(String id) throws Exception
  {
    StreamSeekable stream = get().stream(id);
    Obj hashedCredentialStored = new Obj();
    hashedCredentialStored.streamFromInput(stream);
    
    return hashedCredentialStored.string();
  }
  
  public void setCredential(String id, String credentialNew) throws Exception
  {
    StreamSeekable stream = object.stream(id);
    
    String hashedCredential = credentialNew == null ? null : Hash.hashString(hash, credentialNew);
    stream.write(new Obj(hashedCredential));
  }
  
  public String getExpiration(String id) throws Exception
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
  
  public void setExpiration(String id, String expirationNew) throws Exception
  {
    StreamSeekable stream = object.stream(id + ".expiration");
    
    stream.write(new Obj(expirationNew));
  }
}
