package m.service;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;

public class Configuration implements AuthorizedStatelessService, ConfigurableObject
{
  static final protected String CMD_SEPARATOR = "/";
  
  static final protected String CMD_DESTRUCT = "destruct";
  static final protected String CMD_CONSTRUCT = "construct";
  static final protected String CMD_CONFIGURE = "configure";
  
  static final protected String PARAM_CONF = "conf";
  static final protected String PARAM_PATH = "path";
  
  protected ObjectBuilder objectBuilder;
  protected FileSystem fileSystem;
  
  public void construct(Obj args) throws Exception
  {
    destruct();
  }
  
  public void destruct() throws Exception
  {
    if(objectBuilder != null)
    {
      objectBuilder = null;
    }
    
    if(fileSystem != null)
    {
      fileSystem = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    if(params.get(Conf.OBJECT) != null)
    {
      objectBuilder = m.Global.objects.get(ObjectBuilder.class, params.get(Conf.OBJECT));
    }
    
    if(objectBuilder == null)
    {
      objectBuilder = m.Global.objects;
    }
    
    if(params.get(Conf.FILESYSTEM) != null)
    {
      fileSystem = m.Global.objects.get(FileSystem.class, params.get(Conf.FILESYSTEM));
    }
    
    if(fileSystem == null)
    {
//      fileSystem = m.Global.objects.iface(FileSystem.class);
      fileSystem = m.Global.filesystem;
    }
  }
  
  public void execute(String command, ObjInput in, ObjOutput out) throws Exception
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String cmd;
    String path;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      cmd = command;
      path = null;
    }
    else
    {
      cmd = command.substring(0, index);
      path = command.substring(index + CMD_SEPARATOR.length());
    }
    
    m.Global.log.debug(cmd, path);
    
    if(path == null || "".equals(path))
    {
      switch(cmd)
      {
        case CMD_DESTRUCT: m.Global.get().destruct(); break;
        case CMD_CONSTRUCT: m.Global.get().construct(getConfiguration(in)); break;
        case CMD_CONFIGURE: m.Global.get().configure(getConfiguration(in)); break;
        default: throw new Exception();
      }
    }
    else
    {
      ConfigurableObject configurableObject = objectBuilder.get(ConfigurableObject.class, path);
      switch(cmd)
      {
        case CMD_DESTRUCT: configurableObject.destruct(); break;
        case CMD_CONSTRUCT: configurableObject.construct(getConfiguration(in)); break;
        case CMD_CONFIGURE: configurableObject.configure(getConfiguration(in)); break;
        default: throw new Exception();
      }
    }
  }
  
  protected Obj getConfiguration(ObjInput in) throws Exception
  {
    Map conf = in.map(PARAM_CONF);
    String path = in.string(PARAM_PATH);
    
    Obj obj = null;
    
    if(conf != null)
    {
      obj = new Obj(conf);
    }
    else if(path != null)
    {
      obj = new Obj();
//      obj.load(path);
      obj.streamFromInput(fileSystem.read(path));
    }
    
//    if(obj == null)
//    {
//      throw new Exception();
//    }
    
    m.Global.log.debug(obj.object());
    
    return obj;
  }
}
