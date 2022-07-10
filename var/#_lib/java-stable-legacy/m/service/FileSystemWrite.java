package m.service;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;
import m.stream.*;

public class FileSystemWrite extends ConfigurableWrapper<___FileSystem> implements AuthorizedService
{
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    m.Global.log.debug(command);
    
    object.file(command);
    
    if(in.type(StreamInput.class))
    {
      StreamSeekable ss = object.stream(command);
//      ss.streamFromInput(in.stream());
      ss.streamFromInput(in.stream(""));
      ss.close();
    }
    else
    {
      object.delete(command);
    }
//    object.stream(command).streamFromInput(in.stream());
  }
}
