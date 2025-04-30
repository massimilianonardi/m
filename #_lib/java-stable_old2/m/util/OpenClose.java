package m.util;

public interface OpenClose
{
  public void open() throws Exception;
  public void close() throws Exception;
  public boolean isOpen() throws Exception;
  
//  default public void open() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void close() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public boolean isOpen() throws Exception
//  {
//    throw new Exception();
//  }
}
