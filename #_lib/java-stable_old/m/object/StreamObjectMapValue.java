package m.object;

import java.util.*;

import m.stream.*;

public class StreamObjectMapValue<T> implements StreamObjectInput<T>
{
  protected Map<Object, T> map;
  protected Iterator<Map.Entry<Object, T>> iterator;
  
  public StreamObjectMapValue(Map<Object, T> map) throws Exception
  {
    this.map = map;
    this.iterator = map.entrySet().iterator();
  }
  
  public boolean eos() throws Exception
  {
    return !iterator.hasNext();
  }
  
  public T readObject() throws Exception
  {
    return iterator.next().getValue();
  }
}
