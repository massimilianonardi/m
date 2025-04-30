package m.stream;

import java.util.*;

import m.object.*;

//abstract public class ObjInputStream extends WrapperStreamInput implements ObjInput
abstract public class ObjInputStream implements ObjInput
{
  protected Object object;
  protected boolean isInitialized = false;
  
  protected Obj next() throws Exception
  {
    throw new Exception();
  }
  
  protected List nextEntry() throws Exception
  {
    return next().list();
  }
  
  protected boolean hasEnded() throws Exception
  {
    throw new Exception();
  }
  
  public void parseObject() throws Exception
  {
    if(!isInitialized)
    {
      isInitialized = true;
      
      object = next();
      if(!hasEnded())
      {
        throw new Exception();
      }
    }
  }
  
  public void parseAsMap() throws Exception
  {
    if(!isInitialized)
    {
      isInitialized = true;
      
      object = new HashMap<String, Object>();
      Map map = (Map) object;
      while(!hasEnded())
      {
        List entry = nextEntry();
        map.put(entry.get(0), entry.get(1));
      }
    }
  }
  
  public void parseAsList() throws Exception
  {
    if(!isInitialized)
    {
      isInitialized = true;
      
      object = new ArrayList<Object>();
      List list = (List) object;
      while(!hasEnded())
      {
        list.add(next());
      }
    }
  }
  
  public Object object() throws Exception
  {
    if(!isInitialized)
    {
      isInitialized = true;
      
      if(!hasEnded())
      {
        object = next().object();
      }
      
      if(!hasEnded())
      {
        throw new Exception();
      }
    }
    
    return object;
  }
  
  public Object object(String key) throws Exception
  {
    if(!isInitialized)
    {
      isInitialized = true;
      
      object = new HashMap<String, Object>();
    }
    
    if(!hasEnded())
    {
      Map map = (Map) object;
      while(!hasEnded())
      {
        List entry = nextEntry();
        String entryKey = (String) entry.get(0);
        Object entryObject = entry.get(1);
        map.put(entryKey, entryObject);
        if(key != null && key.equals(entryKey) || (key == null && entryKey == null))
        {
          return entryObject;
        }
      }
    }
    
    return ((Map) object).get(key);
  }
  
  public Object object(int key) throws Exception
  {
    if(!isInitialized)
    {
      isInitialized = true;
      
      object = new ArrayList<Object>();
    }
    
    if(!hasEnded())
    {
      List list = (List) object;
      while(!hasEnded())
      {
        Object entryObject = next();
        int nextIndex = list.size();
        list.add(entryObject);
        if(key == nextIndex)
        {
          return entryObject;
        }
      }
    }
    
    return ((List) object).get(key);
  }
}
