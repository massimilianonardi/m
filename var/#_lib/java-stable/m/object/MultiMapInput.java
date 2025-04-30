package m.object;

import m.stream.*;

public interface MultiMapInput<T> extends StreamableObjectInput<GenericMapEntry<GenericMap<T>>>
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
  
  public GenericMapInput<T> get(String key) throws Exception;
  public GenericMapInput<T> get(Long key) throws Exception;
  
  public T get(String key, String subKey) throws Exception;
  public T get(String key, Long subKey) throws Exception;
  public T get(Long key, String subKey) throws Exception;
  public T get(Long key, Long subKey) throws Exception;
  
  public boolean containsKey(String key) throws Exception;
  public boolean containsKey(Long key) throws Exception;
  
  public boolean containsKey(String key, String subKey) throws Exception;
  public boolean containsKey(String key, Long subKey) throws Exception;
  public boolean containsKey(Long key, String subKey) throws Exception;
  public boolean containsKey(Long key, Long subKey) throws Exception;
  
  public boolean containsValue(T object) throws Exception;
  
  public boolean containsValue(String key, T object) throws Exception;
  public boolean containsValue(Long key, T object) throws Exception;
  
//  public StreamObjectInput<T> valuesStreamInput() throws Exception;
  public StreamObjectInput<T> valuesStreamInput(String key) throws Exception;
  public StreamObjectInput<T> valuesStreamInput(Long key) throws Exception;
//  public StreamObjectInput<GenericMapEntry<T>> mapStreamInput() throws Exception;
}
