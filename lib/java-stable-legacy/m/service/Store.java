package m.service;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;
import m.store.*;
import m.stream.*;

// in configure check if filestore is conf, else check path has file inside
// then in write check if param:file-store is true then use file store else normal
public class Store extends ConfigurableWrapper<StorePath> implements AuthorizedService
{
  static final protected String CMD_SEPARATOR = "/";
  
  static final protected String CMD_READ = "read";
  static final protected String CMD_WRITE = "write";
  static final protected String CMD_LIST = "list";
  static final protected String CMD_FIND = "find";
  
  static final protected String PROFILER_SEPARATOR = "/";
  
  static final protected String AUTHENTICATION_PREFIX = "authentication";
  static final protected String AUTHENTICATION_DEFAULT = "id";
  
  static final protected String HTTP_FIELD_AUTHENTICATION = "authentication";
  static final protected String HTTP_FIELD_ID = "id";
  static final protected String HTTP_FIELD_CREDENTIAL = "credential";
  static final protected String HTTP_FIELD_CREDENTIAL_NEW = "credentialNew";
  
//  protected StoreFile storeFile;
//  
//  public void configure(Obj params) throws Exception
//  {
//    super.configure(params);
//    
//    if(get() instanceof FSStorePath)
//    {
//      storeFile = ((FSStorePath) get()).storeFile;
//    }
//  }
  
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
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
    
    executePath(session, cmd, path, in, out);
  }
  
  public void executePath(AuthorizationSession session, String command, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = getAuthentication(session, command, in, out);
    String id = getID(session, command, in, out);
    
    m.Global.log.debug(command, path, authentication, id);
    
    switch(command)
    {
      case CMD_READ: read(session, authentication, id, path, in, out); break;
      case CMD_WRITE: write(session, authentication, id, path, in, out); break;
      case CMD_LIST: list(session, authentication, id, path, in, out); break;
      case CMD_FIND: find(session, authentication, id, path, in, out); break;
      default: throw new Exception();
    }
  }
  
  public void read(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
//    out.set(get().stream(path));
    out.set(get().read(path));
//    if(get().isFile(path))
//    {
//      out.set(get().stream(path));
//    }
//    else
//    {
//      out.set(get().list(path));
//    }
  }
  
  public void write(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String index = null;
    
    if(path == null || "".equals(path))
    {
      if(in.stream("") != null)
      {
        index = ((FSStorePath) get()).getStoreFile().fileCreate(in.stream(""));
      }
      else
      {
        index = ((FSStorePath) get()).getStoreFile().fileCreate(new Obj(in.object()).toStreamInput());
      }
    }
    else if(!get().exists(path))
    {
      get().nodes(get().parent(path));
//      if(in.type(StreamInput.class))
      if(in.stream("") != null)
      {
//        get().file(path, in.stream());
        index = get().file(path, in.stream(""));
      }
      else
      {
        index = get().file(path, new Obj(in.object()).toStreamInput());
        
//        Obj obj = new Obj(in.object());
//        byte[] buffer = obj.toBufferByte().buffer();
//        java.io.ByteArrayInputStream bais = new ByteArrayInputStream(buffer);
//        get().file(path, new WrapperIOByteStreamInput(bais));
        
//        get().file(path);
//        StreamSeekable stream = get().stream(path);
//        stream.write(new Obj(in.object()));
//        stream.close();
      }
    }
    else
    {
      index = path;
      // todo if versioning, instead of exception, index/hash at close after casting at hash-stream
      StreamSeekable stream = get().stream(path);
      if(in.type(StreamInput.class))
      {
        stream.streamFromInput(in.stream());
      }
      else
      {
        stream.write(new Obj(in.object()));
      }
      stream.close();
    }
    out.set(index);
  }
  
  public void write___(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    if(!get().exists(path))
    {
      get().nodes(get().parent(path));
//      if(in.type(StreamInput.class))
      if(in.stream("") != null)
      {
//        get().file(path, in.stream());
        get().file(path, in.stream(""));
      }
      else
      {
        get().file(path, new Obj(in.object()).toStreamInput());
        
//        Obj obj = new Obj(in.object());
//        byte[] buffer = obj.toBufferByte().buffer();
//        java.io.ByteArrayInputStream bais = new ByteArrayInputStream(buffer);
//        get().file(path, new WrapperIOByteStreamInput(bais));
        
//        get().file(path);
//        StreamSeekable stream = get().stream(path);
//        stream.write(new Obj(in.object()));
//        stream.close();
      }
    }
    else
    {
      StreamSeekable stream = get().stream(path);
      if(in.type(StreamInput.class))
      {
        stream.streamFromInput(in.stream());
      }
      else
      {
        stream.write(new Obj(in.object()));
      }
      stream.close();
    }
    out.set(path);
  }
  
  public void list(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(get().list(path));
//    if(get().isFile(path))
//    {
//      out.set(get().stream(path));
//    }
//    else
//    {
//      out.set(get().list(path));
//    }
  }
  
  public void find(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(get().find(path, null));
//    if(get().isFile(path))
//    {
//      out.set(get().stream(path));
//    }
//    else
//    {
//      out.set(get().find(path, null));
//    }
  }
  
  protected String getAuthentication(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = in.string(HTTP_FIELD_AUTHENTICATION);
    if(authentication == null || "".equals(authentication))
    {
      authentication = AUTHENTICATION_DEFAULT;
    }
    
    return authentication;
  }
  
  protected String getID(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = getAuthentication(session, command, in, out);
    String prefix = AUTHENTICATION_PREFIX + PROFILER_SEPARATOR + authentication + PROFILER_SEPARATOR;
    String id = in.string(HTTP_FIELD_ID);
    if(id == null || "".equals(id))
    {
      List<String> stack = session.profiler().profileStack();
      
      for(String profile: stack)
      {
        if(profile.startsWith(prefix))
        {
          id = profile;
        }
      }
      
      if(id != null)
      {
        int index = id.indexOf(prefix);
        if(-1 == index)
        {
          id = null;
        }
        else
        {
          id = id.replace(prefix, "");
        }
      }
    }
    
    return id;
  }
}
