package m.object;

import java.util.*;

import m.stream.*;

public class StreamObjectMapEntry<T> implements StreamObject<GenericMapEntry<T>>
{
  protected Map<Object, T> map;
  protected Iterator<Map.Entry<Object, T>> iterator;
  
  public StreamObjectMapEntry(Map<Object, T> map) throws Exception
  {
    this.map = map;
    this.iterator = map.entrySet().iterator();
  }
  
  public boolean eos() throws Exception
  {
    return !iterator.hasNext();
  }
  
  public GenericMapEntry<T> readObject() throws Exception
  {
    Map.Entry<Object, T> object = iterator.next();
    
    GenericMapEntryBase<T> entry = new GenericMapEntryBase<T>();
    entry.key = object.getKey();
    entry.object = object.getValue();
    
    return entry;
  }
  
  public void writeObject(GenericMapEntry<T> object) throws Exception
  {
    map.put(object.key(), object.object());
    this.iterator = map.entrySet().iterator();
  }
}
