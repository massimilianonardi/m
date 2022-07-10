package m.service;

import java.util.*;

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
//    m.Global.log.debug(command, in.type());
//    m.Global.log.debug(command, in.object("data").getClass().getName());
    
    Map map = in.map();
    
    if(map.isEmpty())
    {
      m.Global.log.debug(command, "delete");
      object.delete(command);
    }
    else
    {
      Iterator iterator = map.entrySet().iterator();
      Object o = iterator.next();
      o = ((Map.Entry) o).getValue();
      m.Global.log.debug(command, "write", o.getClass().getName());
      if(!object.exists(command)) object.file(command);
      try
      {
        StreamInput si = (StreamInput) o;
        m.Global.log.debug(command, "write-binary");
        StreamSeekable ss = object.stream(command);
        ss.streamFromInput(si);
        ss.close();
      }
      catch(Exception e)
      {
        m.Global.log.debug(command, "write-json");
        StreamSeekable ss = object.stream(command);
//        new Obj(o).streamToOutput(ss);
        ss.write(new Obj(o));
//        ss.write(new Obj(map));
        ss.close();
      }
    }
  }
}
