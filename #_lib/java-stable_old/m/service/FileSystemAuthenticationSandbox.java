package m.service;

import java.text.*;
import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;
import m.stream.*;

public class FileSystemAuthenticationSandbox extends ConfigurableWrapper<___FileSystem> implements AuthorizedService, Authorizator.Listener
{
  static protected final String CMD_SEPARATOR = " ";
  
  static protected final String CMD_READ = "read";
  static protected final String CMD_WRITE = "write";
  static protected final String CMD_MOVE = "move";
  static protected final String CMD_SAVE = "save";
  static protected final String CMD_SHARE = "share";
  
  static protected final String DIR_SEPARATOR = "/";
  
  static protected final String DIR_INDEX = "$index";
  static protected final String DIR_HASH = "$hash";
  
  static protected final String DIR_ABSOLUTE = "file";
  static protected final String DIR_PROFILE = "$profile";
  static protected final String DIR_USER = "$user";
  static protected final String DIR_SESSION = "$session";
  
  static protected final String ALIAS_ABSOLUTE = "@";
  static protected final String ALIAS_PROFILE = "&";
  static protected final String ALIAS_USER = "#";
  static protected final String ALIAS_SESSION = "%";
  
  static protected int MAX_RANDOM_SUFFIX = 1000000;
  static protected Random rnd = new Random();
  
  public class FileAlias
  {
    protected String dir;
    protected String relPath;
    protected String path;
    
    public FileAlias(AuthorizationSession session, String alias) throws Exception
    {
      int index;
      
      index = alias.indexOf(DIR_SEPARATOR);
      if(index < 1)
      {
        throw new Exception();
      }
      dir = alias.substring(0, index);
      relPath = alias.substring(index);
      
      if(java.nio.file.Paths.get(relPath).normalize().toString().startsWith(".."))
      {
        throw new Exception();
      }
      
      String path;
      switch(dir)
      {
        case ALIAS_ABSOLUTE:
          path = DIR_ABSOLUTE;
          break;
          
//        case ALIAS_PROFILE:
//          List<String> authentications = session.authentications();
//          path = DIR_PROFILE + DIR_SEPARATOR + authentications.get(authentications.size() - 1);
//          break;
          
//        case ALIAS_USER:
//          List<String> authentications = session.profiler().authentications().get("id");
//          path = DIR_USER + DIR_SEPARATOR + authentications.get(authentications.size() - 1);
//          break;
          
        case ALIAS_SESSION:
          path = DIR_SESSION + DIR_SEPARATOR + session.id();
          break;
          
        default:
          throw new Exception();
      }
      
      if(relPath != null && !"".equals(relPath))
      {
        path += DIR_SEPARATOR + relPath;
      }
    }
    
    public String dir() throws Exception
    {
      return dir;
    }
    
    public String relPath() throws Exception
    {
      return relPath;
    }
    
    public String path() throws Exception
    {
      return path;
    }
  }
  
//  public FileSystemAuthenticationSandbox() throws Exception
  public void configure(Obj params) throws Exception
  {
//    m.Global.objects.iface(Authorizator.class).addListener(this);
  }
  
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String cmd;
    String dir;
    String relPath;
    String path;
    
    int index;
    
    index = command.indexOf(CMD_SEPARATOR);
    if(index < 1)
    {
      throw new Exception();
    }
    cmd = command.substring(0, index);
    FileAlias alias = new FileAlias(session, command.substring(index));
    
    dir = alias.dir();
    relPath = alias.relPath();
    path = alias.path();
    
//    index = relPath.indexOf(DIR_SEPARATOR);
//    if(index < 1)
//    {
//      throw new Exception();
//    }
//    dir = relPath.substring(0, index);
//    relPath = relPath.substring(index);
//    
//    if(java.nio.file.Paths.get(relPath).normalize().toString().startsWith(".."))
//    {
//      throw new Exception();
//    }
    
//    switch(dir)
//    {
//      case ALIAS_ABSOLUTE:
//        path = DIR_ABSOLUTE;
//        break;
//        
//      case ALIAS_USER:
//        List<String> authentications = session.authentications();
//        path = DIR_USER + DIR_SEPARATOR + authentications.get(authentications.size() - 1);
//        break;
//        
//      case ALIAS_SESSION:
//        path = DIR_SESSION + DIR_SEPARATOR + session.id();
//        break;
//        
//      default:
//        throw new Exception();
//    }
    
//    if(relPath != null && !"".equals(relPath))
//    {
//      path += DIR_SEPARATOR + relPath;
//    }
    
    m.Global.log.debug(cmd, dir, relPath);
    
    String outPath;
    switch(cmd)
    {
      case CMD_READ:
        if(object.isFile(path))
        {
          out.set(object.stream(path));
        }
        else
        {
          out.set(object.list(path));
        }
        break;
        
      case CMD_WRITE:
        if(relPath == null || "".equals(relPath))
        {
          if(ALIAS_ABSOLUTE.equals(dir))
          {
            path = object.file();
          }
          else
          {
//            relPath = DIR_INDEX + DIR_SEPARATOR + System.currentTimeMillis() + "_" + command.hashCode();
            relPath = DIR_INDEX + DIR_SEPARATOR + new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date()) + "_" + ("" + (rnd.nextInt(MAX_RANDOM_SUFFIX) + MAX_RANDOM_SUFFIX)).substring(1);
            path += DIR_SEPARATOR + relPath;
            object.file(path);
          }
        }
        else
        {
          object.file(path);
        }
        outPath = dir + DIR_SEPARATOR + relPath;
        object.stream(path).streamFromInput(in.stream());
        out.set(outPath);
        break;
        
      case CMD_MOVE:
        String dest = DIR_SESSION + DIR_SEPARATOR + session.id() + DIR_SEPARATOR + in.string();
        
        m.Global.log.debug(command, path, dest);
        
        object.move(path, dest);
        break;
        
      case CMD_SAVE:
        // anon session file to anon user file
        if(!ALIAS_SESSION.equals(dir) || relPath == null || "".equals(relPath))
        {
          throw new Exception();
        }
        FileAlias param = new FileAlias(session, in.string());
        outPath = DIR_SESSION + DIR_SEPARATOR + session.id() + DIR_SEPARATOR + in.string();
        
        m.Global.log.debug(command, path, outPath);
        
        object.move(path, param.path());
        out.set(param.relPath());
        break;
        
      case CMD_SHARE:
        // anon user file to anon abs file
        if(!ALIAS_SESSION.equals(dir) || relPath == null || "".equals(relPath))
        {
          throw new Exception();
        }
//        FileAlias param = new FileAlias(session, in.string());
//        outPath = DIR_SESSION + DIR_SEPARATOR + session.id() + DIR_SEPARATOR + in.string();
//        
//        m.Global.log.debug(command, path, outPath);
//        
//        object.move(path, param.path());
//        out.set(param.relPath());
        break;
        
      default:
        throw new Exception();
    }
  }
  
  public void sessionCreated(AuthorizationSession session) throws Exception
  {
    object.nodes(DIR_SESSION + DIR_SEPARATOR + session.id());
  }
  
  public void sessionDestroyed(AuthorizationSession session) throws Exception
  {
    object.delete(DIR_SESSION + DIR_SEPARATOR + session.id(), true);
  }
  
  public void sessionRenamed(AuthorizationSession session) throws Exception
  {
  }
}
