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
    public Map<String, ___FileSystem> filesystem;
    public Map<String, Authorizator> authorizator;
    public Map<String, Authenticator> authenticator;
  };
  
  static public IFaces ifaces;
  
  static public Log log;
  static public Configuration conf;
  static public ___FileSystem filesystem;
  static public Authorizator authorizator;
  static public Authenticator authenticator;
  
  static public ObjectBuilder objects;
  
  static protected final Global global = new Global();
//  static public final Global global = new Global();
  
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
    ifaces.filesystem = objects.ifaces(___FileSystem.class);
    ifaces.authorizator = objects.ifaces(Authorizator.class);
    ifaces.authenticator = objects.ifaces(Authenticator.class);
    
    log = objects.iface(Log.class);
    conf = objects.iface(Configuration.class);
    filesystem = objects.iface(___FileSystem.class);
    authorizator = objects.iface(Authorizator.class);
    authenticator = objects.iface(Authenticator.class);
    
    if(log == null)
    {
      log = new Log();
    }
    
    m.Global.log.debug();
  }
}
