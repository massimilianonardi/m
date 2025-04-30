package m.object;

import m.stream.*;

//public interface GenericMapOutput<T> extends StreamableObjectOutput<GenericMapEntryOutput<T>>
public interface GenericMapOutput<T> extends StreamableObjectOutput<GenericMapEntry<T>>
{
  public boolean isEmpty() throws Exception;
  
  public String size() throws Exception;
  public int sizeAsNumber() throws Exception;
  
  public void clear() throws Exception;
  
  // if key not present, then exception
  public T remove(String key) throws Exception;
  public T remove(Long key) throws Exception;
  
  default public void rename(String key, String newKey) throws Exception
  {
    if(key == null || newKey == null)
    {
      throw new Exception();
    }
    
    set(newKey, remove(key));
  }
  
  default public void rename(Long key, Long newKey) throws Exception
  {
    if(key == null || newKey == null)
    {
      throw new Exception();
    }
    
    set(newKey, remove(key));
  }
  
  public void set(String key, T object) throws Exception;
  public void set(Long key, T object) throws Exception;
  
//  public void set(MapOutput<T> object) throws Exception;
  
//  public StreamObjectOutput<T> mapStreamOutput() throws Exception;
//  public StreamObjectOutput<GenericMapEntry<T>> mapStreamOutput() throws Exception;
//  public StreamObjectOutput<GenericMapEntryOutput<T>> toStream() throws Exception;
}
