package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.enc.*;
import m.util.*;

public class StackAuthenticator extends ConfigurableList<Authenticator> implements Authenticator
{
  protected IDGenerator idGenerator;
  
  public void construct(Obj args) throws Exception
  {
    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd HH:mm:ss");
  }
  
  public ObjInput challenge(String id) throws Exception
  {
    Obj challenge = new Obj(idGenerator.dateRandom());
    
    return challenge;
  }
  
  public Boolean authenticate(String id, ObjInput challengeProof) throws Exception
  {
    Boolean proven = false;
    
    for(Authenticator authn: get())
    {
      try
      {
        proven = authn.authenticate(id, challengeProof);
      }
      catch(Exception e)
      {
        e.printStackTrace();
        proven = false;
      }
      m.Global.log.debug(authn.getClass().getName(), id, proven);
      if(proven != false)
      {
        break;
      }
    }
    
    return proven;
  }
}
