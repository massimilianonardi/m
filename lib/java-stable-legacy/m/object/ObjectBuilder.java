package m.object;

import java.lang.reflect.*;
import java.util.*;

import m.conf.*;

public class ObjectBuilder implements ConfigurableObject
{
  protected Map<String, ConfigurableObject> names;
  protected Map<String, Map<String, ConfigurableObject>> ifaces;
  protected Map<String, ConfigurableObject> defaultIfaces;
  
//  public ObjectBuilder()
  public ObjectBuilder() throws Exception
  {
    construct(null);
  }
  
  public void construct(Obj args) throws Exception
  {
    destruct();
    
    names = new HashMap();
    ifaces = new HashMap();
    defaultIfaces = new HashMap();
  }
  
  public void destruct() throws Exception
  {
    destroyMap(names);
    names = null;
    
    destroyMapMap(ifaces);
    ifaces = null;
    
    destroyMap(defaultIfaces);
    defaultIfaces = null;
  }
  
//  protected void destroy(Object object) throws Exception
  public void destroy(Object object) throws Exception
  {
    if(object == null)
    {
      return;
    }
    
    if(object instanceof ConfigurableObject)
    {
      ((ConfigurableObject) object).destruct();
    }
  }
  
  protected void destroyMap(Map<String, ConfigurableObject> objectMap) throws Exception
  {
    if(objectMap == null)
    {
      return;
    }
    
    for(String key: objectMap.keySet())
    {
      destroy(objectMap.get(key));
    }
    objectMap.clear();
  }
  
  protected void destroyMapMap(Map<String, Map<String, ConfigurableObject>> objectMapMap) throws Exception
  {
    if(objectMapMap == null)
    {
      return;
    }
    
    for(String keyMap: objectMapMap.keySet())
    {
      Map<String, ConfigurableObject> objectMap = objectMapMap.get(keyMap);
      for(String key: objectMap.keySet())
      {
        destroy(objectMap.get(key));
      }
      objectMap.clear();
    }
    objectMapMap.clear();
  }
  
  public void configure(Obj params) throws Exception
  {
    if(params != null)
    {
//      m.Global.log.info(params.object());
      
      if(params.type(List.class))
      {
        int size = params.list().size();
        for(int i = 0; i < size; i++)
        {
          get(params.get(i));
        }
      }
      else if(params.type(Map.class))
      {
        if(params.string(Conf.CLASS) == null)
        {
          Map<String, Object> map = params.map();
          for(String key: map.keySet())
          {
            get(params.get(key));
          }
        }
        else
        {
          get(params);
        }
      }
      else
      {
        throw new Exception();
      }
    }
    
    m.Global.log.debug("names", names.keySet());
    m.Global.log.debug("ifaces", ifaces.keySet());
    for(String key: ifaces.keySet())
    {
      m.Global.log.debug("iface: " + key, ifaces.get(key).keySet());
    }
    m.Global.log.debug("ifacesDefaults", defaultIfaces.keySet());
  }
  
  public Map<String, ConfigurableObject> getIfaceMap(String className) throws Exception
  {
    Map<String, ConfigurableObject> ifaceMap = ifaces.get(className);
    if(ifaceMap == null)
    {
      ifaceMap = new HashMap();
      ifaces.put(className, ifaceMap);
    }
    
    return ifaceMap;
  }
  
  public ConfigurableObject get(String className, Obj args, Obj params, String confPath, Obj ifacesConf, String name, String iface, Obj call) throws Exception
  {
    ConfigurableObject object = null;
    
    if(className != null)
    {
      Class classObject = Class.forName(className);
      Constructor constructor = classObject.getConstructor();
      object = (ConfigurableObject) constructor.newInstance();
      
      if(name != null)
      {
        names.put(name, object);
        getIfaceMap(className).put(name, object);
      }
      
      if(ifacesConf != null)
      {
        if(!ifacesConf.type(List.class))
        {
          throw new Exception();
        }
        
        List ifacesList = ifacesConf.list();
        for(int i = 0; i < ifacesList.size(); i++)
        {
          Obj ifaceConf = ifacesConf.get(i);
          if(ifaceConf.type(String.class))
          {
            if(name != null)
            {
              getIfaceMap(ifaceConf.string()).put(name, object);
              if(iface != null)
              {
                defaultIfaces.put(iface, object);
              }
            }
            else
            {
              defaultIfaces.put(ifaceConf.string(), object);
//              throw new Exception();
            }
          }
          else
          {
            String ifaceClass = ifaceConf.string(Conf.CLASS);
            String objectName = ifaceConf.string(Conf.NAME);
            Boolean defaultObject = ifaceConf.bool(Conf.DEFAULT);
            
            if(ifaceClass == null)
            {
              throw new Exception();
            }
            
            if(objectName == null)
            {
              getIfaceMap(ifaceClass).put(name, object);
            }
            else
            {
              getIfaceMap(ifaceClass).put(objectName, object);
            }
            
            if(defaultObject != null && defaultObject == true)
            {
              defaultIfaces.put(ifaceClass, object);
            }
          }
        }
      }
      
      object.construct(args);
    }
    else if(name != null)
    {
      if(iface != null)
      {
        object = ifaces.get(iface).get(name);
      }
      else
      {
        object = names.get(name);
      }
    }
    else if(iface != null)
    {
      object = defaultIfaces.get(iface);
    }
    else
    {
      throw new Exception();
    }
    
    if(object != null)
    {
      if(params != null)
      {
        object.configure(params);
      }
      
      if(confPath != null)
      {
        object.configure(new Configuration(confPath, object));
      }
      
      if(call != null)
      {
        m.Global.log.info(call.object());
        
        if(call.type(List.class))
        {
          int size = call.list().size();
          for(int i = 0; i < size; i++)
          {
            call(object, call.get(i));
          }
        }
        else if(call.type(Map.class))
        {
          if(call.string(Conf.METHOD) == null)
          {
            Map<String, Object> map = call.map();
            for(String key: map.keySet())
            {
              call(object, call.get(key));
            }
          }
          else
          {
            call(object, call);
          }
        }
        else
        {
          throw new Exception();
        }
      }
    }
    else
    {
      throw new Exception();
    }
    
    return object;
  }
  
  public ConfigurableObject get(Obj params) throws Exception
  {
    if(params != null)
    {
//      m.Global.log.trace(params.object());
      
      String className = params.string(Conf.CLASS);
      Obj objectArgs = params.get(Conf.ARGS);
      Obj objectParams = params.get(Conf.PARAMS);
      String confPath = params.string(Conf.CONF);
      Obj ifacesConf = params.get(Conf.IFACES);
      
      String name = params.string(Conf.NAME);
      String iface = params.string(Conf.IFACE);
      
      Obj call = params.get(Conf.CALL);
      
      return get(className, objectArgs, objectParams, confPath, ifacesConf, name, iface, call);
    }
    else
    {
      return null;
    }
  }
  
  public ConfigurableObject get(String name) throws Exception
  {
    return names.get(name);
  }
  
  public ConfigurableObject iface(String iface) throws Exception
  {
    return defaultIfaces.get(iface);
  }
  
  public ConfigurableObject iface(String iface, String name) throws Exception
  {
    return ifaces.get(iface).get(name);
  }
  
  public Map<String, ConfigurableObject> ifaces(String iface) throws Exception
  {
    return ifaces.get(iface);
  }
  
  public <T> T get(Class<T> type, String className, Obj args, Obj params, String confPath, Obj ifacesConf, String name, String iface, Obj call) throws Exception
  {
    return type.cast(get(className, args, params, confPath, ifacesConf, name, iface, call));
  }
  
//  public <T extends ConfigurableObject> T get(Class<T> type, Obj params) throws Exception
  public <T> T get(Class<T> type, Obj params) throws Exception
  {
    return type.cast(get(params));
  }
  
//  public <T extends ConfigurableObject> T get(Class<T> type, String name) throws Exception
  public <T> T get(Class<T> type, String name) throws Exception
  {
    return type.cast(names.get(name));
  }
  
//  public <T extends ConfigurableObject> T iface(Class<T> type) throws Exception
  public <T> T iface(Class<T> type) throws Exception
  {
    return type.cast(defaultIfaces.get(type.getName()));
  }
  
//  public <T extends ConfigurableObject> T iface(Class<T> type, String name) throws Exception
  public <T> T iface(Class<T> type, String name) throws Exception
  {
    return type.cast(ifaces.get(type.getName()).get(name));
  }
  
//  public <T extends ConfigurableObject> Map<String, T> ifaces(Class<T> iface) throws Exception
  public <T> Map<String, T> ifaces(Class<T> iface) throws Exception
  {
    return (Map<String, T>) ifaces.get(iface.getName());
  }
  
  public Object call(ConfigurableObject object, Obj call) throws Exception
  {
    if(call != null)
    {
      String methodName = call.string(Conf.METHOD);
      List<String> methodTypes = call.list(Conf.TYPES);
      List methodArgs = call.list(Conf.ARGS);
      
      return call(object, methodName, methodTypes, methodArgs);
    }
    else
    {
      return null;
    }
  }
  
  public Object call(ConfigurableObject object, String methodName, List<String> methodTypes, List methodArgs) throws Exception
  {
    Class[] parameterTypes = new Class[methodTypes.size()];
    for(int i = 0; i < methodTypes.size(); i++)
    {
      parameterTypes[i] = Class.forName(methodTypes.get(i));
    }
    
    Object[] args = new Object[methodArgs.size()];
    for(int i = 0; i < methodArgs.size(); i++)
    {
      try
      {
        args[i] = get(new Obj(methodArgs.get(i)));
      }
      catch(Exception e)
      {
//        args[i] = parameterTypes[i].cast(methodArgs.get(i));
        args[i] = methodArgs.get(i);
      }
    }
    
    Method method = object.getClass().getMethod(methodName, parameterTypes);
    
    return method.invoke(object, (Object) args);
  }
}
