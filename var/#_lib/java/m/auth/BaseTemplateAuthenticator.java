package m.auth;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.util.*;

public class BaseTemplateAuthenticator<T> extends BaseAuthenticator<T>
{
  protected ObjInput getCredentialObj(String id) throws Exception
  {
    throw new Exception();
  }
  
  protected String getExpiration(String id) throws Exception
  {
    return null;
  }
}
