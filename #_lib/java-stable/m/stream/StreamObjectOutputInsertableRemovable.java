package m.stream;

public interface StreamObjectOutputInsertableRemovable<T> extends StreamObjectOutput<T>, PositionableObject
{
  public void insertObject(T object) throws Exception;
  
  public void removeObject() throws Exception;
//  public void removeObject(T object) throws Exception;
}
