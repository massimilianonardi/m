package m.object;

import java.util.*;

import m.stream.*;

public class BasicMultiMap<T> implements MultiMap<T>
{
  protected Map<Object, GenericMap<T>> map = new HashMap<Object, GenericMap<T>>();
  
  public BasicMultiMap()
  {
  }
  
  public BasicMultiMap(Map<Object, GenericMap<T>> map) throws Exception
  {
    this.map = map;
  }
  
  public String toString()
  {
    return map.toString();
  }
  
  public Map<Object, GenericMap<T>> map()
  {
    return map;
  }
  
  public boolean isEmpty() throws Exception
  {
    return map.isEmpty();
  }
  
  public boolean isEmpty(String key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? true : gm.isEmpty();
  }
  
  public boolean isEmpty(Long key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? true : gm.isEmpty();
  }
  
  public String fullSize() throws Exception
  {
    return "" + fullSizeAsNumber();
  }
  
  public int fullSizeAsNumber() throws Exception
  {
    int size = 0;
    for(Map.Entry<Object, GenericMap<T>> entry: map.entrySet())
    {
      size += entry.getValue().sizeAsNumber();
    }
    
    return size;
  }
  
  public String size() throws Exception
  {
    return "" + sizeAsNumber();
  }
  
  public String size(String key) throws Exception
  {
    return "" + sizeAsNumber(key);
  }
  
  public String size(Long key) throws Exception
  {
    return "" + sizeAsNumber(key);
  }
  
  public int sizeAsNumber() throws Exception
  {
    return map.size();
  }
  
  public int sizeAsNumber(String key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? -1 : gm.sizeAsNumber();
  }
  
  public int sizeAsNumber(Long key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? -1 : gm.sizeAsNumber();
  }
  
  public GenericMapInput<T> get(String key) throws Exception
  {
    return map.get(key);
  }
  
  public GenericMapInput<T> get(Long key) throws Exception
  {
    return map.get(key);
  }
  
  public T get(String key, String subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? null : gm.get(key);
  }
  
  public T get(String key, Long subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? null : gm.get(key);
  }
  
  public T get(Long key, String subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? null : gm.get(key);
  }
  
  public T get(Long key, Long subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? null : gm.get(key);
  }
  
  public boolean containsKey(String key) throws Exception
  {
    return map.containsKey(key);
  }
  
  public boolean containsKey(Long key) throws Exception
  {
    return map.containsKey(key);
  }
  
  public boolean containsKey(String key, String subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? false : gm.containsKey(subKey);
  }
  
  public boolean containsKey(String key, Long subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? false : gm.containsKey(subKey);
  }
  
  public boolean containsKey(Long key, String subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? false : gm.containsKey(subKey);
  }
  
  public boolean containsKey(Long key, Long subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? false : gm.containsKey(subKey);
  }
  
  public boolean containsValue(T object) throws Exception
  {
    return map.containsValue(object);
  }
  
  public boolean containsValue(String key, T object) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? false : gm.containsValue(object);
  }
  
  public boolean containsValue(Long key, T object) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    return gm == null ? false : gm.containsValue(object);
  }
  
  public StreamObjectInput<T> valuesStreamInput(String key) throws Exception
  {
    return map.get(key).valuesStreamInput();
  }
  
  public StreamObjectInput<T> valuesStreamInput(Long key) throws Exception
  {
    return map.get(key).valuesStreamInput();
  }
  
  public void clear() throws Exception
  {
    for(Object k: map.keySet())
    {
      if(k instanceof String) remove((String) k);
      else if(k instanceof Long) remove((Long) k);
      else throw new Exception();
    }
  }
  
  public void clear(String key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    if(gm != null)
    {
      gm.clear();
    }
  }
  
  public void clear(Long key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    if(gm != null)
    {
      gm.clear();
    }
  }
  
  public GenericMap<T> remove(String key) throws Exception
  {
    return map.remove(key);
  }
  
  public GenericMap<T> remove(Long key) throws Exception
  {
    return map.remove(key);
  }
  
  public T remove(String key, String subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    if(gm == null)
    {
      return null;
    }
    
    T o = gm.remove(key);
    
    if(gm.isEmpty())
    {
      map.remove(key);
    }
    
    return o;
  }
  
  public T remove(String key, Long subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    if(gm == null)
    {
      return null;
    }
    
    T o = gm.remove(key);
    
    if(gm.isEmpty())
    {
      map.remove(key);
    }
    
    return o;
  }
  
  public T remove(Long key, String subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    if(gm == null)
    {
      return null;
    }
    
    T o = gm.remove(key);
    
    if(gm.isEmpty())
    {
      map.remove(key);
    }
    
    return o;
  }
  
  public T remove(Long key, Long subKey) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    
    if(gm == null)
    {
      return null;
    }
    
    T o = gm.remove(key);
    
    if(gm.isEmpty())
    {
      map.remove(key);
    }
    
    return o;
  }
  
  public GenericMap<T> set(String key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    if(gm == null)
    {
      gm = new BasicMap<T>();
      map.put(key, gm);
    }
    
    return gm;
  }
  
  public GenericMap<T> set(Long key) throws Exception
  {
    GenericMap<T> gm = map.get(key);
    if(gm == null)
    {
      gm = new BasicMap<T>();
      map.put(key, gm);
    }
    
    return gm;
  }
  
  public void set(String key, String subKey, T object) throws Exception
  {
    set(key).set(subKey, object);
  }
  
  public void set(String key, Long subKey, T object) throws Exception
  {
    set(key).set(subKey, object);
  }
  
  public void set(Long key, String subKey, T object) throws Exception
  {
    set(key).set(subKey, object);
  }
  
  public void set(Long key, Long subKey, T object) throws Exception
  {
    set(key).set(subKey, object);
  }
  
  public StreamObject<GenericMapEntry<GenericMap<T>>> toStream() throws Exception
  {
    return new StreamObjectMapEntry<GenericMap<T>>(map);
  }
}
