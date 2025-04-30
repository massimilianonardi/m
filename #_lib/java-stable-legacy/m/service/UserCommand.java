package m.service;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class UserCommand extends ConfigurableWrapper<AuthorizedService> implements AuthorizedService
{
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String p = java.nio.file.Paths.get(command).normalize().toString();
    if(p.startsWith(".."))
    {
      throw new Exception();
    }
    
//    List<String> authentications = session.profiler().authentications().get("id");
//    object.execute(session, authentications.get(authentications.size() - 1) + "/" + command, in, out);
  }
}
