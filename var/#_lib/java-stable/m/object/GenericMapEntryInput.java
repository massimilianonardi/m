package m.object;

public interface GenericMapEntryInput<T>
{
  public Object key() throws Exception;
  default public String stringKey() throws Exception {return (String) key();}
  default public Long longKey() throws Exception {return (Long) key();}
  public T object() throws Exception;
}
