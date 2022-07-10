package m.util;

public interface Seekable
{
  public void begin() throws Exception;
  public void end() throws Exception;
  public long size() throws Exception;
  public long position() throws Exception;
  public void position(long position) throws Exception;
  public void seek(long seek) throws Exception;
  
//  default public void begin() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void end() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public long size() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public long position() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void position(long position) throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void seek(long seek) throws Exception
//  {
//    throw new Exception();
//  }
}
