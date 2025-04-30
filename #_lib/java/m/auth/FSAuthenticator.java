package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.util.*;
import m.file.*;
import m.stream.*;

public class FSAuthenticator extends BaseAuthenticator<FileSystem> implements AuthenticatorManager
{
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception
  {
    if(id == null && challengeProof == null) return null;
    
    return super.authenticate(id, challengeProof);
  }
  
  protected ObjInput getCredentialObj(String id) throws Exception
  {
    StreamSeekable stream = get().stream(id);
    Obj hashedCredentialStored = new Obj();
    hashedCredentialStored.streamFromInput(stream);
    
    return hashedCredentialStored;
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
  
  public List<String> list() throws Exception
  {
    ObjInput obj = get().list("");
    if(obj == null || obj.object() == null)
    {
      return new ArrayList<String>();
    }
    
    List<String> list = obj.list();
    List<String> l = new ArrayList<String>();
    for(String item: list)
    {
      if(item != null && !item.endsWith(".expiration"))
      {
        l.add(item);
      }
    }
    
    return l;
  }
  
  public boolean exists(String id) throws Exception
  {
    return get().exists(id);
  }
  
  public void add(String id, String credential) throws Exception
  {
//    throw new Exception();
    StreamSeekable stream = object.stream(id);
    
    String hashedCredential = credential == null ? null : Hash.hashString(hash, credential);
    stream.write(new Obj(hashedCredential));
  }
  
  public void remove(String id) throws Exception
  {
//    throw new Exception();
    get().delete(id);
  }
  
  public String getCredential(String id) throws Exception
  {
    return getCredentialObj(id).string();
  }
  
  public void setCredential(String id, String credentialNew) throws Exception
  {
    StreamSeekable stream = object.stream(id);
    
    String hashedCredential = credentialNew == null ? null : Hash.hashString(hash, credentialNew);
    stream.write(new Obj(hashedCredential));
    
    if(get().exists(id + ".expiration"))
    {
      get().delete(id + ".expiration");
    }
  }
  
  public void setExpiration(String id, String expirationNew) throws Exception
  {
    StreamSeekable stream = object.stream(id + ".expiration");
    
    stream.write(new Obj(expirationNew));
  }
}
