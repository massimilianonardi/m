package m.object;

import java.util.*;

import m.conf.*;

public class Pool<T> implements ConfigurableObject
{
  protected Factory<T> factory;
  
  protected List<T> objectsAvailable;
  protected List<T> objectsAll;
  
  protected int min;
  protected int max;
  protected long wait;
  
  public Pool() throws Exception
  {
    this(null);
  }
  
  public Pool(Factory<T> factory) throws Exception
  {
    construct(factory);
  }
  
  public void construct(Obj args) throws Exception
  {
    construct((Factory<T>) m.Global.objects.get(args));
  }
  
  public void construct(Factory<T> factory) throws Exception
  {
    this.factory = factory;
    
    objectsAvailable = new ArrayList();
    objectsAll = new ArrayList();
  }
  
  public void destruct() throws Exception
  {
    if(objectsAll == null || objectsAvailable == null)
    {
      return;
    }
    
    for(int i = 0; i < objectsAll.size(); i++)
    {
      destroy(objectsAll.get(i));
    }
    
    objectsAll.clear();
    objectsAvailable.clear();
    
    objectsAll = null;
    objectsAvailable = null;
  }
  
  public void configure(Obj params) throws Exception
  {
    configure(params.integer(Conf.MIN), params.integer(Conf.MAX), params.integer(Conf.WAIT));
  }
  
  public void configure(Long sizeMin, Long sizeMax, Long waitMax) throws Exception
  {
    min = sizeMin == null ? 0 : sizeMin.intValue();
    max = sizeMax == null ? 10 : sizeMax.intValue();
    wait = waitMax == null ? 1000 : waitMax;
    
    int increase = min - objectsAll.size();
    if(0 <= increase)
    {
      for(int i = 0; i < increase; i++)
      {
        objectsAvailable.add(create());
      }
    }
    else
    {
      // todo reduce
    }
  }
  
  protected T create() throws Exception
  {
    T object = factory.create();
    objectsAll.add(object);
    
    return object;
  }
  
  protected void destroy(T object) throws Exception
  {
    objectsAll.remove(object);
    factory.destroy(object);
  }
  
  public synchronized T acquire() throws Exception
  {
    m.Global.log.debug("POOL_ACQUIRE_REQUEST", 
      "timestamp........: " + System.currentTimeMillis(), 
      "objectsAvailable.: " + objectsAvailable.size()
    );
    
    T object;
    if(0 < objectsAvailable.size())
    {
      m.Global.log.trace("POOL_ACQUIRED_FROM_POOL", 
        "timestamp........: " + System.currentTimeMillis(), 
        "objectsAvailable.: " + objectsAvailable.size()
      );
      
      object = objectsAvailable.remove(0);
    }
    else if(objectsAll.size() < max)
    {
      m.Global.log.trace("POOL_ACQUIRED_BY_CREATION", 
        "timestamp........: " + System.currentTimeMillis(), 
        "objectsAvailable.: " + objectsAvailable.size()
      );
      
      object = create();
    }
    else
    {
      m.Global.log.trace("POOL_WAIT_FOR_ACQUIRE", 
        "timestamp........: " + System.currentTimeMillis(), 
        "objectsAvailable.: " + objectsAvailable.size()
      );
      
      long t0 = System.currentTimeMillis();
      long t = 0;
      
      while(t < wait && 0 == objectsAvailable.size())
      {
        try
        {
          wait(wait);
        }
        catch(InterruptedException e)
        {
          e.printStackTrace();
        }
        t = System.currentTimeMillis() - t0;
      }
      
      m.Global.log.trace("MAX_POOL", 
        "timestamp........: " + t0, 
        "elapsed..........: " + t, 
        "objectsAvailable.: " + objectsAvailable.size()
      );
      
      if(0 < objectsAvailable.size())
      {
        object = objectsAvailable.remove(0);
      }
      else
      {
        throw new Exception();
      }
    }
    
    return validate(object);
  }
  
  public synchronized void release(T object) throws Exception
  {
    m.Global.log.debug("POOL_RELEASE", 
      "timestamp........: " + System.currentTimeMillis(), 
      "objectsAvailable.: " + objectsAvailable.size()
    );
    
    if(object != null && objectsAll.contains(object))
    {
      objectsAvailable.add(validate(object));
      notify();
    }
    else
    {
      throw new Exception();
    }
  }
  
  protected synchronized T validate(T object) throws Exception
  {
    if(!factory.check(object))
    {
      try
      {
        destroy(object);
      }
      catch(Exception e)
      {
        e.printStackTrace();
      }
      
      return create();
    }
    
    return object;
  }
}
