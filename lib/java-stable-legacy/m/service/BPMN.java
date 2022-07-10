package m.service;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;
import m.store.*;
import m.stream.*;

// bpmn service: is the interface against all the logic
// conf service returns the list of confs for all current profiles, but confs should not be used for app logic

// bpmn-srv commands: apps, app, execute-task, etc.
// applist gives complete list of apps allowed for current profiles
// app gives the app.js (also other js, css, mod, lib, conf, etc.) requested only if allowed by current profiles
// 
// app with no path gives array of apps with json spec in it (name, desc, libs, etc.) -> authz access for session/authenticated or operators profile
// NB list is filtered by subpath allowed by authz -> must find a clever way to such fileterd lists for dirs/files and in general
// app with path gives access to filesystem read for files and dirs -> authz access for specific paths into specific operators group
// 
// save command stores posted data/files to versioned history
// 
// exec/<sub-command> command stores posted data/files to versioned history and executes <sub-command> on such data/files
//

//public class BPMN extends Store implements AuthorizedService
//public class BPMN extends ConfigurableWrapper<StorePath> implements AuthorizedService
//public class BPMN extends FileSystemRead implements AuthorizedService
public class BPMN extends ConfigurableWrapper<___FileSystem> implements AuthorizedService
{
  static final protected String CMD_SEPARATOR = "/";
  
  static final protected String CMD_APP = "app";
  static final protected String CMD_SAVE = "save";
  static final protected String CMD_EXEC = "exec";
  
  static final protected String PROFILER_SEPARATOR = "/";
  
  static final protected String AUTHENTICATION_PREFIX = "authentication";
  static final protected String AUTHENTICATION_DEFAULT = "id";
  
  static final protected String HTTP_FIELD_AUTHENTICATION = "authentication";
  static final protected String HTTP_FIELD_ID = "id";
  static final protected String HTTP_FIELD_CREDENTIAL = "credential";
  static final protected String HTTP_FIELD_CREDENTIAL_NEW = "credentialNew";
  
  protected FileSystemRead fsr;
  protected FileSystemWrite fsw;
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
    fsr = new FileSystemRead();
    fsw = new FileSystemWrite();
    
    fsr.configure(params);
    fsw.configure(params);
  }
  
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
      case CMD_APP: app(session, authentication, id, path, in, out); break;
      case CMD_SAVE: save(session, authentication, id, path, in, out); break;
      case CMD_EXEC: exec(session, authentication, id, path, in, out); break;
      default: throw new Exception();
    }
  }
  
  public void app(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
    if(path != null && !"".equals(path))
    {
      fsr.execute(session, path, in, out);
      return;
    }
    
    // todo return app-list + apps-conf according to authz
    if(path == null) path = "";
    path += "app";
    Obj obj = new Obj(new HashMap());
    StreamInput list = get().list(path);
    while(!list.eos())
    {
      if(list.isObjStream())
      {
        String appName = list.readObj().string();
        String p = "m/bpmn/" + CMD_APP + CMD_SEPARATOR + path + "/" + appName + "/";
        m.Global.log.debug(appName, p, session.authorize(p));
        if(session.authorize(p))
        {
          // todo get app info and add map to app list
          Obj c = new Obj();
          String appConfPath = path + "/" + appName + "/" + "app.json";
          if(get().isFile(appConfPath))
          {
            c.fromBufferByte(get().stream(appConfPath).readBytes());
          }
          m.Global.log.debug("authorized", appName, p, session.authorize(p), c.object());
          obj.set(appName, c);
//          obj.set(appName, new HashMap());
        }
//        else
//        {
//          m.Global.log.debug("unauthorized", list.readObj().object(), p, session.authorize(p));
//        }
      }
      else
      {
        throw new Exception();
      }
    }
    
    out.set(obj.map());
//    throw new Exception();
  }
  
  public void save(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
  }
  
  public void exec(AuthorizationSession session, String authentication, String id, String path, ObjInput in, ObjOutput out) throws Exception
  {
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
