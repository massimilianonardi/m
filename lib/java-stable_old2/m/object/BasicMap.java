package m.object;

import java.util.*;

import m.stream.*;

public class BasicMap<T> implements GenericMap<T>
{
  protected Map<Object, T> map = new HashMap<Object, T>();
  
  public BasicMap()
  {
  }
  
  public BasicMap(Map<Object, T> map) throws Exception
  {
    this.map = map;
  }
  
  public String toString()
  {
    return map.toString();
  }
  
  public boolean isEmpty() throws Exception
  {
    return map.isEmpty();
  }
  
  public String size() throws Exception
  {
    return "" + map.size();
  }
  
  public int sizeAsNumber() throws Exception
  {
    return map.size();
  }
  
  public T get(String key) throws Exception
  {
    return map.get(key);
  }
  
  public T get(Long key) throws Exception
  {
    return map.get(key);
  }
  
  public boolean containsKey(String key) throws Exception
  {
    return map.containsKey(key);
  }
  
  public boolean containsKey(Long key) throws Exception
  {
    return map.containsKey(key);
  }
  
  public boolean containsValue(T object) throws Exception
  {
    return map.containsValue(object);
  }
  
  public StreamObject<GenericMapEntry<T>> toStream() throws Exception
  {
    return new StreamObjectMapEntry<T>(map);
  }
  
  public StreamObjectInput<T> valuesStreamInput() throws Exception
  {
    return new StreamObjectMapValue<T>(map);
  }
  
  public void clear() throws Exception
  {
    map.clear();
  }
  
  public T remove(String key) throws Exception
  {
    return map.remove(key);
  }
  
  public T remove(Long key) throws Exception
  {
    return map.remove(key);
  }
  
  public void set(String key, T object) throws Exception
  {
    map.put(key, object);
  }
  
  public void set(Long key, T object) throws Exception
  {
    map.put(key, object);
  }
}
