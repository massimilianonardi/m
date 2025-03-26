package m.log;

public interface Logger
{
  public void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception;
  
//  default public void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
//  {
//    throw new Exception();
//  }
}
