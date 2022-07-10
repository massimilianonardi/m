package m.auth;

import m.object.*;

public interface AuthorizedService
{
  public void execute(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception;
}
