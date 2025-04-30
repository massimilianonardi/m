package m.conf;

import m.object.*;

//public class ConfigurableWrapper<T extends ConfigurableObject> implements ConfigurableObject
public class ConfigurableWrapper<T> implements ConfigurableObject
{
  protected T object;
  
  public void construct(Obj args) throws Exception
  {
    destruct();
    
    object = null;
  }
  
  public void destruct() throws Exception
  {
    if(object != null)
    {
//      object.destruct();
//      ((ConfigurableObject) object).destruct();
      m.Global.objects.destroy(object);
      object = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    object = (T) m.Global.objects.get(params);
  }
  
  public T get()
  {
    return object;
  }
}
