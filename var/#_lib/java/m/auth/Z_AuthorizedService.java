package m.auth;

import m.object.*;

public interface Z_AuthorizedService
{
  public void execute(Z_AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception;
}
