package m.auth;

import m.object.*;

public interface AuthorizedStatelessService extends AuthorizedService
{
  default public void execute(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    execute(command, in, out);
  }
  
  public void execute(String command, ObjInput in, ObjOutput out) throws Exception;
}
