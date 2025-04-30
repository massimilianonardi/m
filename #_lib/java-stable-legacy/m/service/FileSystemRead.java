package m.service;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;
import m.stream.*;

public class FileSystemRead extends ConfigurableWrapper<___FileSystem> implements AuthorizedService
{
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    m.Global.log.debug(command);
    
    if(object.isFile(command))
    {
//      ByteStreamSeekable file = object.data(command);
//      file.open();
//      out.set(file);
      StreamSeekable ss = object.stream(command);
      out.set(ss);
      ss.close();
//      out.set(object.stream(command));
    }
    else if(object.isNode(command) || object.isSymbolicLink(command))
    {
      out.set(object.list(command));
    }
    else
    {
      throw new Exception();
    }
  }
}
