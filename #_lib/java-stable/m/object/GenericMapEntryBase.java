package m.object;

public class GenericMapEntryBase<T> implements GenericMapEntry<T>
{
  protected Object key;
  protected T object;
  
  public Object key() throws Exception
  {
    return key;
  }
  
  public T object() throws Exception
  {
    return object;
  }
  
  public void key(String key) throws Exception
  {
    this.key = key;
  }
  
  public void key(Long key) throws Exception
  {
    this.key = key;
  }
  
  public void object(T object) throws Exception
  {
    this.object = object;
  }
}
