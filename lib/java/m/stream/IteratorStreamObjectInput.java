package m.stream;

import java.util.*;

public class IteratorStreamObjectInput<T> implements StreamObjectInput<T>
{
  protected Iterator<T> iterator;
  
  public IteratorStreamObjectInput(Iterator<T> iterator) throws Exception
  {
    this.iterator = iterator;
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
