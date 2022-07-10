package m.object;

import m.stream.*;

public interface MultiMapOutput<T> extends StreamableObjectOutput<GenericMapEntry<GenericMap<T>>>
{
  public boolean isEmpty() throws Exception;
  public boolean isEmpty(String key) throws Exception;
  public boolean isEmpty(Long key) throws Exception;
  
  public String fullSize() throws Exception;
  public int fullSizeAsNumber() throws Exception;
  
  public String size() throws Exception;
  public int sizeAsNumber() throws Exception;
  
  public String size(String key) throws Exception;
  public int sizeAsNumber(String key) throws Exception;
  
  public String size(Long key) throws Exception;
  public int sizeAsNumber(Long key) throws Exception;
  
  public void clear() throws Exception;
  public void clear(String key) throws Exception;
  public void clear(Long key) throws Exception;
  
  // if key not present, then exception
  public GenericMapOutput<T> remove(String key) throws Exception;
  public GenericMapOutput<T> remove(Long key) throws Exception;
  
  public T remove(String key, String subKey) throws Exception;
  public T remove(String key, Long subKey) throws Exception;
  public T remove(Long key, String subKey) throws Exception;
  public T remove(Long key, Long subKey) throws Exception;
  
//  default public void rename(String key, String newKey) throws Exception
//  {
//    if(key == null || newKey == null)
//    {
//      throw new Exception();
//    }
//    
//    set(newKey, remove(key));
//  }
//  
//  default public void rename(Long key, Long newKey) throws Exception
//  {
//    if(key == null || newKey == null)
//    {
//      throw new Exception();
//    }
//    
//    set(newKey, remove(key));
//  }
  
  public GenericMapOutput<T> set(String key) throws Exception;
  public GenericMapOutput<T> set(Long key) throws Exception;
  
  public void set(String key, String subKey, T object) throws Exception;
  public void set(String key, Long subKey, T object) throws Exception;
  public void set(Long key, String subKey, T object) throws Exception;
  public void set(Long key, Long subKey, T object) throws Exception;
  
//  public void set(MapOutput<T> object) throws Exception;
  
//  public StreamObjectOutput<GenericMapEntry<T>> mapStreamOutput() throws Exception;
}
