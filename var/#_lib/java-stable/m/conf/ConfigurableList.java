package m.conf;

import java.util.*;

import m.object.*;

//public class ConfigurableList<T extends ConfigurableObject> implements ConfigurableObject
public class ConfigurableList<T> implements ConfigurableObject
{
  protected List<T> objects = new ArrayList<T>();
  
  public void construct(Obj args) throws Exception
  {
    destruct();
    
    objects = new ArrayList<T>();
  }
  
  public void destruct() throws Exception
  {
    if(objects != null)
    {
      for(int i = 0; i < objects.size(); i++)
      {
//        objects.get(i).destruct();
        ((ConfigurableObject) objects.get(i)).destruct();
        m.Global.objects.destroy(objects.get(i));
      }
      
      objects.clear();
      objects = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    if(params != null && params.type(List.class))
    {
      int size = params.list().size();
      for(int i = 0; i < size; i++)
      {
        Obj objectConf = params.get(i);
        T object = (T) m.Global.objects.get(objectConf);
        objects.add(object);
      }
    }
  }
  
  public List<T> get()
  {
    return objects;
  }
  
  public T get(int index)
  {
    return objects.get(index);
  }
}
