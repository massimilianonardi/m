package m.object;

import java.util.*;

import m.stream.*;

public class StreamObjectSet<T> implements StreamObjectInput<T>
{
  protected Set<T> set;
  protected Iterator<T> iterator;
  
  public StreamObjectSet(Set<T> set) throws Exception
  {
    this.set = set;
    this.iterator = set.iterator();
  }
  
  public boolean eos() throws Exception
  {
    return !iterator.hasNext();
  }
  
  public T readObject() throws Exception
  {
    return iterator.next();
  }
}
