package m.conf;

import java.util.*;

import m.object.*;

//public class ConfigurableMap<T extends ConfigurableObject> implements ConfigurableObject
public class ConfigurableMap<T> implements ConfigurableObject
{
  protected PrefixMap<T> objects = new PrefixMap<T>();
  
  public void construct(Obj args) throws Exception
  {
    destruct();
    
    objects = new PrefixMap<T>();
  }
  
  public void destruct() throws Exception
  {
    if(objects != null)
    {
      Iterator<String> iterator = objects.keySet().iterator();
      while(iterator.hasNext())
      {
//        objects.get(iterator.next()).destruct();
//        ((ConfigurableObject) objects.get(iterator.next())).destruct();
        m.Global.objects.destroy(objects.get(iterator.next()));
      }
      
      objects.clear();
      objects = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    if(params != null && params.type(Map.class))
    {
      Map<String, Object> map = params.map();
      for(String key: map.keySet())
      {
        Obj objectConf = params.get(key);
        T object = (T) m.Global.objects.get(objectConf);
        objects.put(key, object);
      }
    }
  }
  
  public PrefixMap<T> get()
  {
    return objects;
  }
  
  public T get(String name)
  {
    return objects.get(name);
  }
}
