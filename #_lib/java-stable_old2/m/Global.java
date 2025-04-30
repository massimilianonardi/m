package m;

import java.util.*;

import m.object.*;
import m.conf.*;
import m.log.*;
import m.file.*;
import m.auth.*;

public class Global implements ConfigurableObject
{
  static public class IFaces
  {
    public Map<String, Log> log;
    public Map<String, Configuration> conf;
    public Map<String, FileSystem> filesystem;
    public Map<String, Authorizator> authorizator;
    public Map<String, AuthenticatorManager> authenticator;
  };
  
  static public IFaces ifaces;
  
  static public Log log;
  static public Configuration conf;
  static public FileSystem filesystem;
  static public Authorizator authorizator;
  static public AuthenticatorManager authenticator;
  
  static public ObjectBuilder objects;
  
  static protected final Global global = new Global();
  
  protected Global()
  {
    try
    {
      construct(null);
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
  
  public void construct(Obj args) throws Exception
  {
    destruct();
    
    if(log == null)
    {
      log = new Log();
    }
    
    ifaces = new IFaces();
    objects = new ObjectBuilder();
    
    configure(args);
    
    m.Global.log.debug();
  }
  
  public void destruct() throws Exception
  {
    if(log != null)
    {
      m.Global.log.debug();
    }
    
    if(objects != null)
    {
      objects.destruct();
    }
    
    objects = null;
    ifaces = null;
    
    log = null;
    conf = null;
    filesystem = null;
    authorizator = null;
    authenticator = null;
  }
  
  static public Global get() throws Exception
  {
    return global;
  }
  
  public void configure(Obj params) throws Exception
  {
    objects.configure(params);
    
    ifaces.log = objects.ifaces(Log.class);
    ifaces.conf = objects.ifaces(Configuration.class);
    ifaces.filesystem = objects.ifaces(FileSystem.class);
    ifaces.authorizator = objects.ifaces(Authorizator.class);
    ifaces.authenticator = objects.ifaces(AuthenticatorManager.class);
    
    log = objects.iface(Log.class);
    conf = objects.iface(Configuration.class);
    filesystem = objects.iface(FileSystem.class);
    authorizator = objects.iface(Authorizator.class);
    authenticator = objects.iface(AuthenticatorManager.class);
    
    if(log == null)
    {
      log = new Log();
    }
    
    m.Global.log.debug();
  }
}
