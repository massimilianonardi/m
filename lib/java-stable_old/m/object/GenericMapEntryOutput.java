package m.object;

public interface GenericMapEntryOutput<T>
{
  public void key(String key) throws Exception;
  public void key(Long key) throws Exception;
  public void object(T object) throws Exception;
}
