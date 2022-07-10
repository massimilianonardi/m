package m.util;

public interface StartStop
{
  public void start() throws Exception;
  public void stop() throws Exception;
  public boolean isRunning() throws Exception;
  
//  default public void start() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public void stop() throws Exception
//  {
//    throw new Exception();
//  }
//  
//  default public boolean isRunning() throws Exception
//  {
//    throw new Exception();
//  }
}
