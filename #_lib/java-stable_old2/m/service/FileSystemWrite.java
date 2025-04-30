package m.service;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;
import m.stream.*;

public class FileSystemWrite extends ConfigurableWrapper<FileSystem> implements AuthorizedStatelessService
{
  public void execute(String command, ObjInput in, ObjOutput out) throws Exception
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    m.Global.log.debug(command);
    
    object.file(command);
    
    if(in.type(StreamInput.class))
    {
    m.Global.log.debug(command, "write");
      StreamSeekable ss = object.stream(command);
//      ss.streamFromInput(in.stream());
      ss.streamFromInput(in.stream(""));
      ss.close();
    }
    else
    {
    m.Global.log.debug(command, "delete");
      object.delete(command);
    }
      StreamSeekable ss = object.stream(command);
//      ss.streamFromInput(in.stream());
      ss.streamFromInput(in.stream(""));
      ss.close();
//    object.stream(command).streamFromInput(in.stream());
  }
}
