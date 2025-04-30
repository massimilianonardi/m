package m.object;

public interface Factory<T>
{
  public T create() throws Exception;
  public void destroy(T object) throws Exception;
  public boolean check(T object) throws Exception;
  
//  default public T create() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void destroy(T object) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public boolean check(T object) throws Exception
//  {
//    throw new Exception();
//  }
}
