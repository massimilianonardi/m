package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;
import m.file.*;
import m.stream.*;

public class FSAuthenticator extends BaseAuthenticator<FileSystem>
{
  protected ObjInput getCredential(String id) throws Exception
  {
    StreamSeekable stream = get().stream(id);
    Obj hashedCredentialStored = new Obj();
    hashedCredentialStored.streamFromInput(stream);
    
    return hashedCredentialStored;
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
}
