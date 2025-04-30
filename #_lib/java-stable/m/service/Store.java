package m.service;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.store.*;
import m.stream.*;

public class Store extends ConfigurableWrapper<m.store.Store> implements AuthorizedStatelessService
{
  static final protected String CMD_SEPARATOR = "/";
  
  static final protected String CMD_EXISTS = "exists";
  static final protected String CMD_CREATE = "create";
  static final protected String CMD_SEALED = "sealed";
  static final protected String CMD_READ = "read";
  static final protected String CMD_LIST = "list";
  static final protected String CMD_FIND = "find";
  static final protected String CMD_DELETE = "delete";
  static final protected String CMD_REINDEX = "reindex";
  static final protected String CMD_COPY = "copy";
  static final protected String CMD_EDIT = "edit";
  
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
  
  public void execute(String command, ObjInput in, ObjOutput out) throws Exception
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
    
    executePath(cmd, path, in, out);
  }
  
  public void executePath(String command, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = getAuthentication(command, in, out);
    String id = getID(command, in, out);
    
    m.Global.log.debug(command, path, authentication, id);
    
    switch(command)
    {
      case CMD_SEALED: sealed(authentication, id, path, in, out); break;
      case CMD_READ: read(authentication, id, path, in, out); break;
      case CMD_EDIT: edit(authentication, id, path, in, out); break;
      case CMD_CREATE: create(authentication, id, path, in, out); break;
      case CMD_COPY: copy(authentication, id, path, in, out); break;
      case CMD_REINDEX: reindex(authentication, id, path, in, out); break;
      case CMD_DELETE: delete(authentication, id, path, in, out); break;
      case CMD_EXISTS: exists(authentication, id, path, in, out); break;
      case CMD_LIST: list(authentication, id, path, in, out); break;
      case CMD_FIND: find(authentication, id, path, in, out); break;
      default: throw new Exception();
    }
  }
  
  public void sealed(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(get().sealed(path));
  }
  
  public void read(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(get().read(path));
  }
  
  public void edit(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String index = null;
    
    if(path == null || "".equals(path))
    {
      index = get().create();
    }
    else
    {
      index = path;
      
      if(get().exists(path))
      {
        get().delete(path);
      }
      
      get().create(path);
    }
    
    StreamSeekable stream = get().edit(path);
    
    if(in.stream("") != null)
    {
      stream.streamFromInput(in.stream(""));
    }
    else
    {
      stream.write(new Obj(in.object()));
    }
    
    stream.close();
    
    out.set(index);
  }
  
  public void create(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    String index = null;
    
    if(path == null || "".equals(path))
    {
      index = get().create();
    }
    else
    {
      index = path;
      
      get().create(path);
    }
    
    out.set(index);
  }
  
  public void copy(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(get().copy(path));
  }
  
  public void reindex(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
  }
  
  public void delete(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    get().delete(path);
  }
  
  public void exists(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    out.set(get().exists(path));
  }
  
  public void list(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
//    out.set(get().list());
    ObjInput obj = ((StoreFS) get()).get().list(path);
    out.set(obj.list());
  }
  
  public void find(String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
//    out.set(get().find(path));
    ObjInput obj = ((StoreFS) get()).get().find(path, null);
    out.set(obj.list());
  }
  
  protected String getAuthentication(String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = in.string(HTTP_FIELD_AUTHENTICATION);
    if(authentication == null || "".equals(authentication))
    {
      authentication = AUTHENTICATION_DEFAULT;
    }
    
    return authentication;
  }
  
  protected String getID(String command, ObjInput in, ObjOutput out) throws Exception
  {
    String authentication = getAuthentication(command, in, out);
    String prefix = AUTHENTICATION_PREFIX + PROFILER_SEPARATOR + authentication + PROFILER_SEPARATOR;
    String id = in.string(HTTP_FIELD_ID);
//    if(id == null || "".equals(id))
//    {
//      List<String> stack = session.profiler().profileStack();
//      
//      for(String profile: stack)
//      {
//        if(profile.startsWith(prefix))
//        {
//          id = profile;
//        }
//      }
//      
//      if(id != null)
//      {
//        int index = id.indexOf(prefix);
//        if(-1 == index)
//        {
//          id = null;
//        }
//        else
//        {
//          id = id.replace(prefix, "");
//        }
//      }
//    }
    
    return id;
  }
}
