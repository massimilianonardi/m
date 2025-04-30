package m.object;

import m.stream.*;

//public interface GenericMapInput<T> extends StreamableObjectInput<GenericMapEntryInput<T>>
public interface GenericMapInput<T> extends StreamableObjectInput<GenericMapEntry<T>>
{
  public boolean isEmpty() throws Exception;
  
  public String size() throws Exception;
  public int sizeAsNumber() throws Exception;
  
  public T get(String key) throws Exception;
  public T get(Long key) throws Exception;
  
  public boolean containsKey(String key) throws Exception;
  public boolean containsKey(Long key) throws Exception;
  public boolean containsValue(T object) throws Exception;
  
  public StreamObjectInput<T> valuesStreamInput() throws Exception;
//  public StreamObjectInput<GenericMapEntry<T>> mapStreamInput() throws Exception;
}
